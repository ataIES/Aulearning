<?php

namespace App\Http\Controllers\Api;

use App\Services\Interfaces\INotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class NotificationController extends BaseApiController
{
    public function __construct(
        private readonly INotificationService $notificationService
    ) {}

    #[OA\Get(
        path: '/notifications',
        summary: 'Listar notificaciones',
        description: 'Obtiene todas las notificaciones del usuario autenticado, incluyendo las globales.',
        security: [['sanctum' => []]],
        tags: ['Notifications']
    )]
    #[OA\Response(response: 200, description: 'Notificaciones obtenidas correctamente')]
    public function index(Request $request): JsonResponse
    {
        return $this->success(
            $this->notificationService->getByUser(
                $request->user()->id
            ),
            'Notificaciones obtenidas correctamente.'
        );
    }

    #[OA\Get(
        path: '/notifications/unread',
        summary: 'Listar notificaciones no leídas',
        description: 'Obtiene las notificaciones no leídas del usuario autenticado, incluyendo las globales.',
        security: [['sanctum' => []]],
        tags: ['Notifications']
    )]
    #[OA\Response(response: 200, description: 'Notificaciones no leídas obtenidas correctamente')]
    public function unread(Request $request): JsonResponse
    {
        return $this->success(
            $this->notificationService->getUnreadByUser(
                $request->user()->id
            ),
            'Notificaciones no leídas obtenidas correctamente.'
        );
    }

    #[OA\Patch(
        path: '/notifications/{id}/read',
        summary: 'Marcar notificación como leída',
        description: 'Marca una notificación como leída.',
        security: [['sanctum' => []]],
        tags: ['Notifications']
    )]
    #[OA\Parameter(
        name: 'id',
        description: 'ID de la notificación',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Response(response: 200, description: 'Notificación marcada como leída')]
    #[OA\Response(response: 404, description: 'Notificación no encontrada')]
    public function markAsRead(int $id): JsonResponse
    {
        $updated = $this->notificationService->markAsRead($id);

        if (!$updated) {
            return $this->error(
                'Notificación no encontrada.',
                404
            );
        }

        return $this->success(
            null,
            'Notificación marcada como leída.'
        );
    }

    #[OA\Patch(
        path: '/notifications/read-all',
        summary: 'Marcar todas las notificaciones como leídas',
        description: 'Marca como leídas todas las notificaciones del usuario autenticado.',
        security: [['sanctum' => []]],
        tags: ['Notifications']
    )]
    #[OA\Response(response: 200, description: 'Notificaciones marcadas como leídas')]
    public function markAllAsRead(Request $request): JsonResponse
    {
        $this->notificationService->markAllAsRead(
            $request->user()->id
        );

        return $this->success(
            null,
            'Todas las notificaciones han sido marcadas como leídas.'
        );
    }
}