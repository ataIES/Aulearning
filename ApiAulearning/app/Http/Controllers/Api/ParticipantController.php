<?php

namespace App\Http\Controllers\Api;

use App\DTOs\ParticipantDto;
use App\Filters\ParticipantFilter;
use App\Services\Interfaces\IParticipantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ParticipantController extends BaseApiController
{
    public function __construct(
        private readonly IParticipantService $participantService
    ) {}

    #[OA\Parameter(name: 'chat_group_id', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'user_id', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'role', in: 'query', schema: new OA\Schema(type: 'string'))]
    #[OA\Parameter(name: 'active', in: 'query', schema: new OA\Schema(type: 'boolean'))]
    #[OA\Parameter(name: 'joined_from', in: 'query', schema: new OA\Schema(type: 'string', format: 'date'))]
    #[OA\Parameter(name: 'joined_to', in: 'query', schema: new OA\Schema(type: 'string', format: 'date'))]
    #[OA\Parameter(ref: '#/components/parameters/PerPage')]
    #[OA\Parameter(ref: '#/components/parameters/SortBy')]
    #[OA\Parameter(ref: '#/components/parameters/SortDirection')]
    #[OA\Get(path: '/participants', summary: 'Listar participantes', security: [['sanctum' => []]], tags: ['Participants'])]
    #[OA\Response(response: 200, description: 'Listado de participantes')]
    public function index(Request $request): JsonResponse
    {
        $filter = new ParticipantFilter(
            chatGroupId: $request->query('chat_group_id')
                ? (int) $request->query('chat_group_id')
                : null,
            userId: $request->query('user_id')
                ? (int) $request->query('user_id')
                : null,
            role: $request->query('role'),
            active: $request->has('active')
                ? $request->boolean('active')
                : null,
            joinedFrom: $request->query('joined_from'),
            joinedTo: $request->query('joined_to'),
            perPage: (int) $request->query('per_page', 15),
            sortBy: $request->query('sort_by', 'id'),
            sortDirection: $request->query('sort_direction', 'desc'),
        );

        return $this->success(
            $this->paginated(
                $this->participantService->paginate($filter, ['user', 'group'])
            ),
            'Participantes obtenidos correctamente.'
        );
    }

    #[OA\Post(path: '/participants', summary: 'Añadir participante', security: [['sanctum' => []]], tags: ['Participants'])]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['chat_group_id', 'user_id'],
            properties: [
                new OA\Property(property: 'chat_group_id', type: 'integer', example: 1),
                new OA\Property(property: 'user_id', type: 'integer', example: 3),
                new OA\Property(property: 'role', type: 'string', example: 'member'),
            ]
        )
    )]
    #[OA\Response(response: 201, description: 'Participante añadido')]
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'chat_group_id' => ['required', 'exists:chat_groups,id'],
            'user_id' => ['required', 'exists:users,id'],
            'role' => ['sometimes', 'in:member,moderator,admin'],
        ]);

        return $this->success(
            $this->participantService->addParticipant(new ParticipantDto(
                id: null,
                chatGroupId: $data['chat_group_id'],
                userId: $data['user_id'],
                role: $data['role'] ?? 'member',
                joinedAt: now()->toDateTimeString(),
                active: true,
            )),
            'Participante añadido correctamente.',
            201
        );
    }

    #[OA\Delete(path: '/participants/{id}', summary: 'Eliminar participante', security: [['sanctum' => []]], tags: ['Participants'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Participante eliminado')]
    public function destroy(int $id): JsonResponse
    {
        return $this->participantService->delete($id)
            ? $this->success(null, 'Participante eliminado correctamente.')
            : $this->error('Participante no encontrado.', 404);
    }
}
