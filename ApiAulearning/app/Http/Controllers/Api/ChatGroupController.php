<?php

namespace App\Http\Controllers\Api;

use App\DTOs\ChatGroupDto;
use App\Filters\ChatGroupFilter;
use App\Http\Requests\Chat\StoreChatGroupRequest;
use App\Http\Requests\Chat\UpdateChatGroupRequest;
use App\Services\Interfaces\IChatGroupService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ChatGroupController extends BaseApiController
{
    public function __construct(
        private readonly IChatGroupService $chatGroupService
    ) {}


    #[OA\Parameter(name: 'search', in: 'query', schema: new OA\Schema(type: 'string'))]
    #[OA\Parameter(name: 'owner_id', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'active', in: 'query', schema: new OA\Schema(type: 'boolean'))]
    #[OA\Parameter(ref: '#/components/parameters/PerPage')]
    #[OA\Parameter(ref: '#/components/parameters/SortBy')]
    #[OA\Parameter(ref: '#/components/parameters/SortDirection')]
    #[OA\Get(path: '/chat-groups', summary: 'Listar grupos de chat', security: [['sanctum' => []]], tags: ['Chat Groups'])]
    #[OA\Response(response: 200, description: 'Listado de grupos')]
    public function index(Request $request): JsonResponse
    {
        $filter = new ChatGroupFilter(
            search: $request->query('search'),
            ownerId: $request->query('owner_id')
                ? (int) $request->query('owner_id')
                : null,
            active: $request->has('active')
                ? $request->boolean('active')
                : null,
            perPage: (int) $request->query('per_page', 15),
            sortBy: $request->query('sort_by', 'id'),
            sortDirection: $request->query('sort_direction', 'desc'),
        );

        return $this->success(
            $this->paginated(
                $this->chatGroupService->paginate($filter, ['owner', 'participants'])
            ),
            'Grupos de chat obtenidos correctamente.'
        );
    }

    #[OA\Post(path: '/chat-groups', summary: 'Crear grupo de chat', security: [['sanctum' => []]], tags: ['Chat Groups'])]
    #[OA\Response(response: 201, description: 'Grupo creado')]
    public function store(StoreChatGroupRequest $request): JsonResponse
    {
        $data = $request->validated();

        return $this->success(
            $this->chatGroupService->create(new ChatGroupDto(
                id: null,
                name: $data['name'],
                description: $data['description'] ?? null,
                active: $data['active'] ?? true,
                ownerId: $request->user()->id,
            )),
            'Grupo creado correctamente.',
            201
        );
    }

    #[OA\Get(path: '/chat-groups/{id}', summary: 'Ver grupo de chat', security: [['sanctum' => []]], tags: ['Chat Groups'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Grupo encontrado')]
    public function show(int $id): JsonResponse
    {
        $group = $this->chatGroupService->getById($id, ['owner', 'participants', 'messages']);

        return $group
            ? $this->success($group)
            : $this->error('Grupo no encontrado.', 404);
    }

    #[OA\Put(path: '/chat-groups/{id}', summary: 'Actualizar grupo de chat', security: [['sanctum' => []]], tags: ['Chat Groups'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Grupo actualizado')]
    public function update(UpdateChatGroupRequest $request, int $id): JsonResponse
    {
        $current = $this->chatGroupService->getById($id);

        if (!$current) {
            return $this->error('Grupo no encontrado.', 404);
        }

        $data = array_merge($current->toArray(), $request->validated());

        return $this->success(
            $this->chatGroupService->update($id, new ChatGroupDto(
                id: $id,
                name: $data['name'],
                description: $data['description'] ?? null,
                active: $data['active'],
                ownerId: $data['owner_id'],
            )),
            'Grupo actualizado correctamente.'
        );
    }

    #[OA\Delete(path: '/chat-groups/{id}', summary: 'Eliminar grupo de chat', security: [['sanctum' => []]], tags: ['Chat Groups'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Grupo eliminado')]
    public function destroy(int $id): JsonResponse
    {
        return $this->chatGroupService->delete($id)
            ? $this->success(null, 'Grupo eliminado correctamente.')
            : $this->error('Grupo no encontrado.', 404);
    }
}
