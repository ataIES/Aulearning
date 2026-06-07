<?php

namespace App\Http\Controllers\Api;

use App\DTOs\TaskDto;
use App\Filters\TaskFilter;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Services\Interfaces\ITaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class TaskController extends BaseApiController
{
    public function __construct(
        private readonly ITaskService $taskService
    ) {}

    #[OA\Parameter(name: 'search', in: 'query', schema: new OA\Schema(type: 'string'))]
    #[OA\Parameter(name: 'course_id', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'student_id', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'type', in: 'query', schema: new OA\Schema(type: 'string'))]
    #[OA\Parameter(name: 'status', in: 'query', schema: new OA\Schema(type: 'string'))]
    #[OA\Parameter(name: 'gradable', in: 'query', schema: new OA\Schema(type: 'boolean'))]
    #[OA\Parameter(name: 'due_date_from', in: 'query', schema: new OA\Schema(type: 'string', format: 'date'))]
    #[OA\Parameter(name: 'due_date_to', in: 'query', schema: new OA\Schema(type: 'string', format: 'date'))]
    #[OA\Parameter(ref: '#/components/parameters/PerPage')]
    #[OA\Parameter(ref: '#/components/parameters/SortBy')]
    #[OA\Parameter(ref: '#/components/parameters/SortDirection')]
    #[OA\Get(path: '/tasks', summary: 'Listar tareas', security: [['sanctum' => []]], tags: ['Tasks'])]
    #[OA\Response(response: 200, description: 'Listado de tareas')]
    public function index(Request $request): JsonResponse
    {
        $filter = new TaskFilter(
            search: $request->query('search'),
            courseId: $request->query('course_id')
                ? (int) $request->query('course_id')
                : null,
            studentId: $request->query('student_id')
                ? (int) $request->query('student_id')
                : null,
            type: $request->query('type'),
            status: $request->query('status'),
            gradable: $request->has('gradable')
                ? $request->boolean('gradable')
                : null,
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

        return $this->success(
            $this->taskService->create(new TaskDto(
                id: null,
                title: $data['title'],
                description: $data['description'],
                dueDate: $data['due_date'],
                courseId: $data['course_id'],
                studentId: $data['student_id'] ?? null,
                type: $data['type'],
                gradable: $data['gradable'] ?? true,
                comment: $data['comment'] ?? null,
                status: $data['status'] ?? 'pending',
            )),
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

        $data = array_merge($current->toArray(), $request->validated());

        return $this->success(
            $this->taskService->update($id, new TaskDto(
                id: $id,
                title: $data['title'],
                description: $data['description'],
                dueDate: $data['due_date'],
                courseId: $data['course_id'],
                studentId: $data['student_id'] ?? null,
                type: $data['type'],
                gradable: $data['gradable'],
                comment: $data['comment'] ?? null,
                status: $data['status'],
            )),
            'Tarea actualizada correctamente.'
        );
    }

    #[OA\Delete(path: '/tasks/{id}', summary: 'Eliminar tarea', security: [['sanctum' => []]], tags: ['Tasks'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Tarea eliminada')]
    public function destroy(int $id): JsonResponse
    {
        return $this->taskService->delete($id)
            ? $this->success(null, 'Tarea eliminada correctamente.')
            : $this->error('Tarea no encontrada.', 404);
    }
}
