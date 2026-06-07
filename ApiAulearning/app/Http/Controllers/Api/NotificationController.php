<?php

namespace App\Http\Controllers\Api;

use App\DTOs\NotificationDto;
use App\Filters\NotificationFilter;
use App\Http\Requests\Notification\StoreNotificationRequest;
use App\Services\Interfaces\INotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class NotificationController extends BaseApiController
{
    public function __construct(
        private readonly INotificationService $notificationService
    ) {}

    #[OA\Parameter(name: 'search', in: 'query', schema: new OA\Schema(type: 'string'))]
    #[OA\Parameter(name: 'user_id', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'type', in: 'query', schema: new OA\Schema(type: 'string'))]
    #[OA\Parameter(name: 'read', in: 'query', schema: new OA\Schema(type: 'boolean'))]
    #[OA\Parameter(name: 'created_from', in: 'query', schema: new OA\Schema(type: 'string', format: 'date'))]
    #[OA\Parameter(name: 'created_to', in: 'query', schema: new OA\Schema(type: 'string', format: 'date'))]
    #[OA\Parameter(ref: '#/components/parameters/PerPage')]
    #[OA\Parameter(ref: '#/components/parameters/SortBy')]
    #[OA\Parameter(ref: '#/components/parameters/SortDirection')]
    #[OA\Get(path: '/notifications', summary: 'Listar notificaciones', security: [['sanctum' => []]], tags: ['Notifications'])]
    #[OA\Response(response: 200, description: 'Listado de notificaciones')]
    public function index(Request $request): JsonResponse
    {
        $filter = new NotificationFilter(
            search: $request->query('search'),
            userId: $request->query('user_id')
                ? (int) $request->query('user_id')
                : null,
            type: $request->query('type'),
            read: $request->has('read')
                ? $request->boolean('read')
                : null,
            createdFrom: $request->query('created_from'),
            createdTo: $request->query('created_to'),
            perPage: (int) $request->query('per_page', 15),
            sortBy: $request->query('sort_by', 'id'),
            sortDirection: $request->query('sort_direction', 'desc'),
        );

        return $this->success(
            $this->paginated(
                $this->notificationService->paginate($filter, ['user'])
            ),
            'Notificaciones obtenidas correctamente.'
        );
    }

    #[OA\Post(path: '/notifications', summary: 'Crear notificación', security: [['sanctum' => []]], tags: ['Notifications'])]
    #[OA\Response(response: 201, description: 'Notificación creada')]
    public function store(StoreNotificationRequest $request): JsonResponse
    {
        $data = $request->validated();

        return $this->success(
            $this->notificationService->create(new NotificationDto(
                id: null,
                title: $data['title'],
                content: $data['content'],
                userId: $data['user_id'],
                type: $data['type'],
                readAt: null,
            )),
            'Notificación creada correctamente.',
            201
        );
    }

    #[OA\Get(path: '/notifications/{id}', summary: 'Ver notificación', security: [['sanctum' => []]], tags: ['Notifications'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Notificación encontrada')]
    public function show(int $id): JsonResponse
    {
        $notification = $this->notificationService->getById($id, ['user']);

        return $notification
            ? $this->success($notification)
            : $this->error('Notificación no encontrada.', 404);
    }

    #[OA\Patch(path: '/notifications/{id}/read', summary: 'Marcar como leída', security: [['sanctum' => []]], tags: ['Notifications'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Notificación leída')]
    public function markAsRead(int $id): JsonResponse
    {
        return $this->notificationService->markAsRead($id)
            ? $this->success(null, 'Notificación marcada como leída.')
            : $this->error('Notificación no encontrada.', 404);
    }

    #[OA\Delete(path: '/notifications/{id}', summary: 'Eliminar notificación', security: [['sanctum' => []]], tags: ['Notifications'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Notificación eliminada')]
    public function destroy(int $id): JsonResponse
    {
        return $this->notificationService->delete($id)
            ? $this->success(null, 'Notificación eliminada correctamente.')
            : $this->error('Notificación no encontrada.', 404);
    }
}
