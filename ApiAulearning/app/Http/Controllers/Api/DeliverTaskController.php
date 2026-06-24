<?php

namespace App\Http\Controllers\Api;

use App\Models\File;
use Illuminate\Support\Facades\Storage;
use App\DTOs\DeliverTaskDto;
use App\Filters\DeliverTaskFilter;
use App\Http\Requests\DeliverTask\StoreDeliverTaskRequest;
use App\Http\Requests\DeliverTask\UpdateDeliverTaskRequest;
use App\Models\DeliveryFile;
use App\Models\DeliveryTask;
use App\Services\Interfaces\IDeliverTaskService;
use App\Services\Interfaces\INotificationService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class DeliverTaskController extends BaseApiController
{
    public function __construct(
        private readonly IDeliverTaskService $deliverTaskService,
        private readonly INotificationService $notificationService
    ) {}

    #[OA\Get(
        path: '/deliveries',
        summary: 'Listar entregas',
        description: 'Obtiene una lista paginada de entregas. Permite filtrar por curso, tarea, alumno, estado y búsqueda general.',
        security: [['sanctum' => []]],
        tags: ['Deliveries']
    )]
    #[OA\Parameter(name: 'course_id', in: 'query', required: false, schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'task_id', in: 'query', required: false, schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'student_id', in: 'query', required: false, schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'teacher_id', in: 'query', required: false, schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'status', in: 'query', required: false, schema: new OA\Schema(type: 'string', enum: ['pending', 'graded']))]
    #[OA\Parameter(name: 'search', in: 'query', required: false, schema: new OA\Schema(type: 'string'))]
    #[OA\Parameter(ref: '#/components/parameters/PerPage')]
    #[OA\Parameter(ref: '#/components/parameters/SortBy')]
    #[OA\Parameter(ref: '#/components/parameters/SortDirection')]
    #[OA\Response(response: 200, description: 'Entregas obtenidas correctamente')]
    #[OA\Response(response: 401, description: 'No autenticado')]
    #[OA\Response(response: 403, description: 'No autorizado')]
    public function index(Request $request): JsonResponse
    {
        $filter = new DeliverTaskFilter(
            teacherId: $request->query('teacher_id')
                ? (int) $request->query('teacher_id')
                : null,
            courseId: $request->query('course_id')
                ? (int) $request->query('course_id')
                : null,
            taskId: $request->query('task_id')
                ? (int) $request->query('task_id')
                : null,
            studentId: $request->query('student_id')
                ? (int) $request->query('student_id')
                : null,
            status: $request->query('status'),
            search: $request->query('search'),
            perPage: (int) $request->query('per_page', 15),
            sortBy: $request->query('sort_by', 'id'),
            sortDirection: $request->query('sort_direction', 'desc'),
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

    #[OA\Post(
        path: '/deliveries',
        summary: 'Crear entrega',
        description: 'Crea una entrega de una tarea.',
        security: [['sanctum' => []]],
        tags: ['Deliveries']
    )]
    #[OA\Response(response: 201, description: 'Entrega creada correctamente')]
    #[OA\Response(response: 422, description: 'Error de validación')]
    public function store(StoreDeliverTaskRequest $request): JsonResponse
    {
        $data = $request->validated();

        $delivery = $this->deliverTaskService->create(
            new DeliverTaskDto(
                id: null,
                studentId: $data['student_id'],
                taskId: $data['task_id'],
                deliveryDate: isset($data['delivery_date'])
                    ? Carbon::parse($data['delivery_date'])
                    : now(),
                updatedDate: null,
                grade: $data['grade'] ?? null,
                comment: $data['comment'] ?? null,
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

        if ($deliveryModel && $request->hasFile('files')) {
            $this->storeDeliveryFiles(
                $deliveryModel,
                $request->file('files')
            );
        }

        if ($deliveryModel?->task?->course?->teacher) {
            $studentName = trim(
                "{$deliveryModel->student?->name} {$deliveryModel->student?->last_name}"
            );

            $this->notificationService->createForUser(
                $deliveryModel->task->course->teacher,
                'Nueva entrega recibida',
                "{$studentName} ha entregado la tarea \"{$deliveryModel->task->title}\" del curso \"{$deliveryModel->task->course->name}\".",
                'delivery'
            );
        }

        return $this->success(
            $delivery,
            'Entrega creada correctamente.',
            201
        );
    }

    #[OA\Get(
        path: '/deliveries/{id}',
        summary: 'Obtener entrega',
        description: 'Obtiene el detalle de una entrega.',
        security: [['sanctum' => []]],
        tags: ['Deliveries']
    )]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Entrega obtenida correctamente')]
    #[OA\Response(response: 404, description: 'Entrega no encontrada')]
    public function show(int $id): JsonResponse
    {
        $delivery = $this->deliverTaskService->getById(
            $id,
            [
                'student',
                'task',
                'task.course',
                'files',
            ]
        );

        if (!$delivery) {
            return $this->error(
                'Entrega no encontrada.',
                404
            );
        }

        return $this->success(
            $delivery,
            'Entrega obtenida correctamente.'
        );
    }

    #[OA\Put(
        path: '/deliveries/{id}',
        summary: 'Actualizar entrega',
        description: 'Actualiza una entrega existente.',
        security: [['sanctum' => []]],
        tags: ['Deliveries']
    )]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Entrega actualizada correctamente')]
    #[OA\Response(response: 404, description: 'Entrega no encontrada')]
    #[OA\Response(response: 422, description: 'Error de validación')]
    public function update(UpdateDeliverTaskRequest $request, int $id): JsonResponse
    {
        $current = $this->deliverTaskService->getById($id);

        if (!$current) {
            return $this->error('Entrega no encontrada.', 404);
        }

        $oldDelivery = DeliveryTask::query()
            ->with([
                'student',
                'task',
                'task.course',
                'task.course.teacher',
            ])
            ->find($id);

        $oldGrade = $oldDelivery?->grade;

        $gradedAt = $oldDelivery?->graded_at;

        if (
            isset($data['grade']) &&
            $data['grade'] !== null
        ) {
            $gradedAt = now();
        }

        $validated = $request->validated();

        $removedFiles = $validated['removed_files'] ?? [];

        if (!empty($removedFiles)) {
            DeliveryFile::query()
                ->where('delivery_task_id', $id)
                ->whereIn('id', $removedFiles)
                ->delete();
        }

        $data = array_merge(
            $current->toArray(),
            $validated
        );

        $delivery = $this->deliverTaskService->update(
            $id,
            new DeliverTaskDto(
                id: $id,
                studentId: $data['student_id'],
                taskId: $data['task_id'],
                deliveryDate: !empty($data['delivery_date'])
                    ? Carbon::parse($data['delivery_date'])
                    : null,
                updatedDate: $data['grade'] !== null
                    ? now()
                    : $current->updatedDate,
                grade: $data['grade'] ?? null,
                comment: $data['comment'] ?? null,
                gradedAt: $gradedAt,
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

        if ($deliveryModel && $request->hasFile('files')) {
            $this->storeDeliveryFiles(
                $deliveryModel,
                $request->file('files')
            );
        }

        if ($deliveryModel) {
            $newGrade = $deliveryModel->grade;

            $isGradedNow =
                is_null($oldGrade) &&
                !is_null($newGrade);

            $gradeChanged =
                !is_null($oldGrade) &&
                !is_null($newGrade) &&
                (float) $oldGrade !== (float) $newGrade;

            if (($isGradedNow || $gradeChanged) && $deliveryModel->student) {
                $this->notificationService->createForUser(
                    $deliveryModel->student,
                    $gradeChanged ? 'Calificación actualizada' : 'Tarea corregida',
                    "Tu entrega de la tarea \"{$deliveryModel->task?->title}\" ha sido "
                        . ($gradeChanged ? 'actualizada' : 'corregida')
                        . ". Nota: {$newGrade}.",
                    'grade'
                );
            } elseif ($deliveryModel->task?->course?->teacher) {
                $studentName = trim(
                    "{$deliveryModel->student?->name} {$deliveryModel->student?->last_name}"
                );

                $this->notificationService->createForUser(
                    $deliveryModel->task->course->teacher,
                    'Entrega actualizada',
                    "{$studentName} ha actualizado su entrega de la tarea \"{$deliveryModel->task->title}\".",
                    'delivery'
                );
            }
        }

        return $this->success(
            $delivery,
            'Entrega actualizada correctamente.'
        );
    }

    #[OA\Delete(
        path: '/deliveries/{id}',
        summary: 'Eliminar entrega',
        description: 'Elimina una entrega.',
        security: [['sanctum' => []]],
        tags: ['Deliveries']
    )]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Entrega eliminada correctamente')]
    #[OA\Response(response: 404, description: 'Entrega no encontrada')]
    public function destroy(int $id): JsonResponse
    {
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
    private function storeDeliveryFiles(DeliveryTask $delivery, array $files): void
    {
        foreach ($files as $uploadedFile) {
            $path = $uploadedFile->store('deliveries', 'public');

            DeliveryFile::query()->create([
                'delivery_task_id' => $delivery->id,
                'name' => $uploadedFile->getClientOriginalName(),
                'path' => $path,
                'disk' => 'public',
                'mime_type' => $uploadedFile->getClientMimeType(),
                'size' => $uploadedFile->getSize(),
            ]);
        }
    }
}
