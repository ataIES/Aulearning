<?php

namespace App\Http\Controllers\Api;

use App\DTOs\DeliverTaskDto;
use App\Filters\DeliverTaskFilter;
use App\Http\Requests\DeliverTask\StoreDeliverTaskRequest;
use App\Http\Requests\DeliverTask\UpdateDeliverTaskRequest;
use App\Models\DeliveryFile;
use App\Models\DeliveryTask;
use App\Services\Interfaces\IDeliverTaskService;
use App\Services\Interfaces\INotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class DeliverTaskController extends BaseApiController
{
    public function __construct(
        private readonly IDeliverTaskService $deliverTaskService,
        private readonly INotificationService $notificationService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $teacherId = $request->query('teacher_id')
            ? (int) $request->query('teacher_id')
            : null;

        $studentId = $request->query('student_id')
            ? (int) $request->query('student_id')
            : null;

        if ($user->hasRole('student')) {
            $studentId = $user->id;
            $teacherId = null;
        }

        if ($user->hasRole('teacher')) {
            $teacherId = $user->id;
        }

        $filter = new DeliverTaskFilter(
            teacherId: $teacherId,

            courseId: $request->query('course_id')
                ? (int) $request->query('course_id')
                : null,

            taskId: $request->query('task_id')
                ? (int) $request->query('task_id')
                : null,

            studentId: $studentId,

            status: $request->query('status'),

            search: $request->query('search'),

            perPage: (int) $request->query(
                'per_page',
                15
            ),

            sortBy: $request->query(
                'sort_by',
                'id'
            ),

            sortDirection: $request->query(
                'sort_direction',
                'desc'
            ),
        );

        return $this->success(
            $this->paginated(
                $this->deliverTaskService->paginateDeliveries(
                    $filter,
                    [
                        'student',
                        'task',
                        'task.course',
                        'files',
                    ]
                )
            ),
            'Entregas obtenidas correctamente.'
        );
    }

    public function store(
        StoreDeliverTaskRequest $request
    ): JsonResponse {
        $user = $request->user();
        $data = $request->validated();

        if (!$user->hasRole('student')) {
            return $this->error(
                'No autorizado.',
                403
            );
        }

        $delivery = $this->deliverTaskService->create(
            new DeliverTaskDto(
                id: null,
                studentId: $user->id,
                taskId: $data['task_id'],
                deliveryDate: now(),
                updatedDate: null,
                grade: null,
                comment: $data['comment'] ?? null,
                gradedAt: null,
            )
        );

        $deliveryModel = DeliveryTask::query()
            ->with([
                'student',
                'task',
                'task.course',
                'task.course.teacher',
            ])
            ->find($delivery->id);

        if (
            $deliveryModel &&
            $request->hasFile('files')
        ) {
            $this->storeDeliveryFiles(
                $deliveryModel,
                $request->file('files')
            );
        }

        if (
            $deliveryModel?->task?->course?->teacher
        ) {
            $studentName = trim(
                "{$deliveryModel->student?->name} "
                . "{$deliveryModel->student?->last_name}"
            );

            $this->notificationService->createForUser(
                $deliveryModel->task->course->teacher,
                'Nueva entrega recibida',
                "{$studentName} ha entregado la tarea "
                . "\"{$deliveryModel->task->title}\" "
                . "del curso "
                . "\"{$deliveryModel->task->course->name}\".",
                'delivery'
            );
        }

        return $this->success(
            $delivery,
            'Entrega creada correctamente.',
            201
        );
    }

    public function show(
        Request $request,
        int $id
    ): JsonResponse {
        $user = $request->user();

        $deliveryModel = DeliveryTask::query()
            ->with([
                'task.course',
            ])
            ->find($id);

        if (!$deliveryModel) {
            return $this->error(
                'Entrega no encontrada.',
                404
            );
        }

        if (
            $user->hasRole('student') &&
            (int) $deliveryModel->student_id !==
                (int) $user->id
        ) {
            return $this->error(
                'No autorizado.',
                403
            );
        }

        if (
            $user->hasRole('teacher') &&
            (int) $deliveryModel->task?->course?->teacher_id !==
                (int) $user->id
        ) {
            return $this->error(
                'No autorizado.',
                403
            );
        }

        $delivery = $this->deliverTaskService->getById(
            $id,
            [
                'student',
                'task',
                'task.course',
                'files',
            ]
        );

        return $this->success(
            $delivery,
            'Entrega obtenida correctamente.'
        );
    }

    public function update(
        UpdateDeliverTaskRequest $request,
        int $id
    ): JsonResponse {
        $user = $request->user();

        $current = $this->deliverTaskService
            ->getById($id);

        if (!$current) {
            return $this->error(
                'Entrega no encontrada.',
                404
            );
        }

        $oldDelivery = DeliveryTask::query()
            ->with([
                'student',
                'task',
                'task.course',
                'task.course.teacher',
            ])
            ->find($id);

        if (!$oldDelivery) {
            return $this->error(
                'Entrega no encontrada.',
                404
            );
        }

        if (
            $user->hasRole('student') &&
            (int) $oldDelivery->student_id !==
                (int) $user->id
        ) {
            return $this->error(
                'No puedes modificar esta entrega.',
                403
            );
        }

        if ($user->hasRole('teacher')) {
            if (
                (int) $oldDelivery->task?->course?->teacher_id !==
                (int) $user->id
            ) {
                return $this->error(
                    'No puedes modificar entregas de otros cursos.',
                    403
                );
            }

            if (!$user->can('tasks.grade')) {
                return $this->error(
                    'No tienes permiso para calificar tareas.',
                    403
                );
            }
        }

        if (
            $user->hasRole('admin') &&
            !$user->can('tasks.grade')
        ) {
            return $this->error(
                'No tienes permiso para calificar tareas.',
                403
            );
        }

        $validated = $request->validated();

        $oldGrade = $oldDelivery->grade;

        if ($user->hasRole('student')) {
            unset(
                $validated['grade'],
                $validated['graded_at']
            );
        }

        $removedFiles =
            $validated['removed_files'] ?? [];

        if (
            $user->hasRole('student') &&
            !empty($removedFiles)
        ) {
            $filesToDelete = DeliveryFile::query()
                ->where(
                    'delivery_task_id',
                    $id
                )
                ->whereIn(
                    'id',
                    $removedFiles
                )
                ->get();

            foreach ($filesToDelete as $file) {
                $file->delete();
            }
        }

        $newGrade = $user->hasRole('student')
            ? $oldGrade
            : ($validated['grade'] ?? $oldGrade);

        $gradedAt = $oldDelivery->graded_at;

        if (
            !$user->hasRole('student') &&
            !is_null($newGrade) &&
            (
                is_null($oldGrade) ||
                (float) $oldGrade !==
                    (float) $newGrade
            )
        ) {
            $gradedAt = now();
        }

        $delivery = $this->deliverTaskService->update(
            $id,
            new DeliverTaskDto(
                id: $id,

                studentId:
                    $oldDelivery->student_id,

                taskId:
                    $oldDelivery->task_id,

                deliveryDate:
                    $oldDelivery->delivery_date,

                updatedDate: now(),

                grade: $newGrade !== null
                    ? (float) $newGrade
                    : null,

                comment:
                    $validated['comment']
                    ?? $oldDelivery->comment,

                gradedAt:
                    $gradedAt,
            )
        );

        $deliveryModel = DeliveryTask::query()
            ->with([
                'student',
                'task',
                'task.course',
                'task.course.teacher',
            ])
            ->find($id);

        if (
            $user->hasRole('student') &&
            $deliveryModel &&
            $request->hasFile('files')
        ) {
            $this->storeDeliveryFiles(
                $deliveryModel,
                $request->file('files')
            );
        }

        if ($deliveryModel) {
            $currentGrade =
                $deliveryModel->grade;

            $isGradedNow =
                is_null($oldGrade) &&
                !is_null($currentGrade);

            $gradeChanged =
                !is_null($oldGrade) &&
                !is_null($currentGrade) &&
                (float) $oldGrade !==
                    (float) $currentGrade;

            if (
                !$user->hasRole('student') &&
                ($isGradedNow || $gradeChanged) &&
                $deliveryModel->student
            ) {
                $this->notificationService->createForUser(
                    $deliveryModel->student,

                    $gradeChanged
                        ? 'Calificación actualizada'
                        : 'Tarea corregida',

                    "Tu entrega de la tarea "
                    . "\"{$deliveryModel->task?->title}\" "
                    . 'ha sido '
                    . (
                        $gradeChanged
                            ? 'actualizada'
                            : 'corregida'
                    )
                    . ". Nota: {$currentGrade}.",

                    'grade'
                );
            }

            if (
                $user->hasRole('student') &&
                $deliveryModel->task?->course?->teacher
            ) {
                $studentName = trim(
                    "{$deliveryModel->student?->name} "
                    . "{$deliveryModel->student?->last_name}"
                );

                $this->notificationService->createForUser(
                    $deliveryModel
                        ->task
                        ->course
                        ->teacher,

                    'Entrega actualizada',

                    "{$studentName} ha actualizado "
                    . 'su entrega de la tarea '
                    . "\"{$deliveryModel->task->title}\".",

                    'delivery'
                );
            }
        }

        return $this->success(
            $delivery,
            'Entrega actualizada correctamente.'
        );
    }

    public function destroy(
        Request $request,
        int $id
    ): JsonResponse {
        $user = $request->user();

        $delivery = DeliveryTask::query()
            ->find($id);

        if (!$delivery) {
            return $this->error(
                'Entrega no encontrada.',
                404
            );
        }

        if (
            $user->hasRole('student') &&
            (int) $delivery->student_id !==
                (int) $user->id
        ) {
            return $this->error(
                'No puedes eliminar esta entrega.',
                403
            );
        }

        return $this->deliverTaskService->delete($id)
            ? $this->success(
                null,
                'Entrega eliminada correctamente.'
            )
            : $this->error(
                'Entrega no encontrada.',
                404
            );
    }

    private function storeDeliveryFiles(
        DeliveryTask $delivery,
        array $files
    ): void {
        foreach ($files as $uploadedFile) {
            $path = $uploadedFile->store(
                'deliveries',
                'public'
            );

            DeliveryFile::query()->create([
                'delivery_task_id' =>
                    $delivery->id,

                'name' =>
                    $uploadedFile
                        ->getClientOriginalName(),

                'path' => $path,

                'disk' => 'public',

                'mime_type' =>
                    $uploadedFile
                        ->getClientMimeType(),

                'size' =>
                    $uploadedFile
                        ->getSize(),
            ]);
        }
    }
}