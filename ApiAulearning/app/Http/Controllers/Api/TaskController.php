<?php

namespace App\Http\Controllers\Api;

use App\DTOs\TaskDto;
use App\Filters\TaskFilter;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Models\File;
use App\Models\Task;
use App\Models\User;
use App\Services\Interfaces\INotificationService;
use App\Services\Interfaces\ITaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class TaskController extends BaseApiController
{
    public function __construct(
        private readonly ITaskService $taskService,
        private readonly INotificationService $notificationService
    ) {}

    #[OA\Get(path: '/tasks', summary: 'Listar tareas', security: [['sanctum' => []]], tags: ['Tasks'])]
    #[OA\Response(response: 200, description: 'Listado de tareas')]
    public function index(Request $request): JsonResponse
    {
        $filter = new TaskFilter(
            search: $request->query('search'),
            courseId: $request->query('course_id') ? (int) $request->query('course_id') : null,
            studentId: $request->query('student_id') ? (int) $request->query('student_id') : null,
            type: $request->query('type'),
            status: $request->query('status'),
            gradable: $request->has('gradable') ? $request->boolean('gradable') : null,
            dueDateFrom: $request->query('due_date_from'),
            dueDateTo: $request->query('due_date_to'),
            perPage: (int) $request->query('per_page', 15),
            sortBy: $request->query('sort_by', 'id'),
            sortDirection: $request->query('sort_direction', 'desc'),
        );

        return $this->success(
            $this->paginated(
                $this->taskService->paginate($filter, ['course', 'student', 'files'])
            ),
            'Tareas obtenidas correctamente.'
        );
    }

    #[OA\Post(path: '/tasks', summary: 'Crear tarea', security: [['sanctum' => []]], tags: ['Tasks'])]
    #[OA\Response(response: 201, description: 'Tarea creada')]
    public function store(StoreTaskRequest $request): JsonResponse
    {
        $data = $request->validated();

        $task = $this->taskService->create(new TaskDto(
            id: null,
            title: $data['title'],
            description: $data['description'],
            dueDate: $data['due_date'] ?? null,
            courseId: $data['course_id'],
            studentId: $data['student_id'] ?? null,
            type: $data['type'],
            gradable: $data['gradable'] ?? true,
            comment: $data['comment'] ?? null,
            status: $data['status'] ?? 'pending',
        ));

        $taskModel = Task::query()
            ->with('course')
            ->find($task->id);

        if ($taskModel?->course) {
            $this->notifyCourseStudents(
                $taskModel->course_id,
                'Nueva tarea publicada',
                "Se ha publicado la tarea \"{$taskModel->title}\" en el curso \"{$taskModel->course->name}\".",
                'task'
            );
        }

        return $this->success(
            $task,
            'Tarea creada correctamente.',
            201
        );
    }

    #[OA\Get(path: '/tasks/{id}', summary: 'Ver tarea', security: [['sanctum' => []]], tags: ['Tasks'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Tarea encontrada')]
    public function show(int $id): JsonResponse
    {
        $task = $this->taskService->getById($id, ['course', 'student', 'files']);

        return $task
            ? $this->success($task)
            : $this->error('Tarea no encontrada.', 404);
    }

    #[OA\Put(path: '/tasks/{id}', summary: 'Actualizar tarea', security: [['sanctum' => []]], tags: ['Tasks'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Tarea actualizada')]
    public function update(UpdateTaskRequest $request, int $id): JsonResponse
    {
        $current = $this->taskService->getById($id);

        if (!$current) {
            return $this->error('Tarea no encontrada.', 404);
        }

        $oldTask = Task::query()
            ->with('course')
            ->find($id);

        $data = array_merge($current->toArray(), $request->validated());

        $removedFiles = $request->validated('removed_files') ?? [];

        if (!empty($removedFiles)) {
            File::query()
                ->where('task_id', $id)
                ->whereIn('id', $removedFiles)
                ->delete();
        }


        $task = $this->taskService->update($id, new TaskDto(
            id: $id,
            title: $data['title'],
            description: $data['description'],
            dueDate: $data['due_date'] ?? null,
            courseId: $data['course_id'],
            studentId: $data['student_id'] ?? null,
            type: $data['type'],
            gradable: $data['gradable'],
            comment: $data['comment'] ?? null,
            status: $data['status'],
        ));

        $taskModel = Task::query()
            ->with('course')
            ->find($id);

        if ($task && $taskModel?->course) {
            $content = "Se ha actualizado la tarea \"{$taskModel->title}\" del curso \"{$taskModel->course->name}\".";

            if (
                $oldTask &&
                $oldTask->due_date &&
                $taskModel->due_date &&
                $oldTask->due_date != $taskModel->due_date
            ) {
                $content .= ' Revisa la nueva fecha de entrega.';
            }

            $this->notifyCourseStudents(
                $taskModel->course_id,
                'Tarea actualizada',
                $content,
                'task'
            );
        }

        return $this->success(
            $task,
            'Tarea actualizada correctamente.'
        );
    }

    #[OA\Delete(path: '/tasks/{id}', summary: 'Eliminar tarea', security: [['sanctum' => []]], tags: ['Tasks'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Tarea eliminada')]
    public function destroy(int $id): JsonResponse
    {
        $task = Task::query()
            ->with('course')
            ->find($id);

        $deleted = $this->taskService->delete($id);

        if (!$deleted) {
            return $this->error('Tarea no encontrada.', 404);
        }

        if ($task?->course) {
            $this->notifyCourseStudents(
                $task->course_id,
                'Tarea eliminada',
                "La tarea \"{$task->title}\" del curso \"{$task->course->name}\" ha sido eliminada.",
                'task'
            );
        }

        return $this->success(
            null,
            'Tarea eliminada correctamente.'
        );
    }

    private function notifyCourseStudents(
        int $courseId,
        string $title,
        string $content,
        string $type = 'task'
    ): void {
        $students = User::query()
            ->whereHas('enrollments', function ($query) use ($courseId) {
                $query->where('course_id', $courseId);
            })
            ->get();

        foreach ($students as $student) {
            $this->notificationService->createForUser(
                $student,
                $title,
                $content,
                $type
            );
        }
    }
}
