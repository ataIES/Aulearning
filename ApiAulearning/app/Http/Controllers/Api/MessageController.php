<?php

namespace App\Http\Controllers\Api;

use App\DTOs\MessageDto;
use App\Filters\MessageFilter;
use App\Http\Requests\Chat\StoreMessageRequest;
use App\Services\Interfaces\IMessageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class MessageController extends BaseApiController
{
    public function __construct(
        private readonly IMessageService $messageService
    ) {}

    #[OA\Parameter(name: 'search', in: 'query', schema: new OA\Schema(type: 'string'))]
    #[OA\Parameter(name: 'user_id', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'chat_group_id', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'created_from', in: 'query', schema: new OA\Schema(type: 'string', format: 'date'))]
    #[OA\Parameter(name: 'created_to', in: 'query', schema: new OA\Schema(type: 'string', format: 'date'))]
    #[OA\Parameter(ref: '#/components/parameters/PerPage')]
    #[OA\Parameter(ref: '#/components/parameters/SortBy')]
    #[OA\Parameter(ref: '#/components/parameters/SortDirection')]
    #[OA\Get(path: '/messages', summary: 'Listar mensajes', security: [['sanctum' => []]], tags: ['Messages'])]
    #[OA\Response(response: 200, description: 'Listado de mensajes')]
    public function index(Request $request): JsonResponse
    {
        $filter = new MessageFilter(
            search: $request->query('search'),
            userId: $request->query('user_id')
                ? (int) $request->query('user_id')
                : null,
            chatGroupId: $request->query('chat_group_id')
                ? (int) $request->query('chat_group_id')
                : null,
            createdFrom: $request->query('created_from'),
            createdTo: $request->query('created_to'),
            perPage: (int) $request->query('per_page', 15),
            sortBy: $request->query('sort_by', 'id'),
            sortDirection: $request->query('sort_direction', 'desc'),
        );

        return $this->success(
            $this->paginated(
                $this->messageService->paginate($filter, ['user', 'group'])
            ),
            'Mensajes obtenidos correctamente.'
        );
    }

    #[OA\Post(path: '/messages', summary: 'Enviar mensaje', security: [['sanctum' => []]], tags: ['Messages'])]
    #[OA\Response(response: 201, description: 'Mensaje enviado')]
    public function store(StoreMessageRequest $request): JsonResponse
    {
        $data = $request->validated();

        return $this->success(
            $this->messageService->send(new MessageDto(
                id: null,
                content: $data['content'],
                userId: $request->user()->id,
                chatGroupId: $data['chat_group_id'],
            )),
            'Mensaje enviado correctamente.',
            201
        );
    }

    #[OA\Get(path: '/messages/{id}', summary: 'Ver mensaje', security: [['sanctum' => []]], tags: ['Messages'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Mensaje encontrado')]
    public function show(int $id): JsonResponse
    {
        $message = $this->messageService->getById($id, ['user', 'group']);

        return $message
            ? $this->success($message)
            : $this->error('Mensaje no encontrado.', 404);
    }

    #[OA\Delete(path: '/messages/{id}', summary: 'Eliminar mensaje', security: [['sanctum' => []]], tags: ['Messages'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Mensaje eliminado')]
    public function destroy(int $id): JsonResponse
    {
        return $this->messageService->delete($id)
            ? $this->success(null, 'Mensaje eliminado correctamente.')
            : $this->error('Mensaje no encontrado.', 404);
    }
}
