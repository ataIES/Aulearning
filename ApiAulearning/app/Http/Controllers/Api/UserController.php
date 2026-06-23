<?php

namespace App\Http\Controllers\Api;

use App\DTOs\UserDto;
use App\Filters\UserFilter;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\User;
use App\Services\Interfaces\IUserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;
use App\Services\Interfaces\INotificationService;

class UserController extends BaseApiController
{

    public function __construct(
        private readonly IUserService $userService,
        private readonly INotificationService $notificationService
    ) {}
    #[OA\Parameter(
        name: 'search',
        in: 'query',
        description: 'Buscar por nombre, apellidos o email',
        schema: new OA\Schema(type: 'string')
    )]
    #[OA\Parameter(
        name: 'type',
        in: 'query',
        description: 'Tipo de usuario',
        schema: new OA\Schema(type: 'string')
    )]
    #[OA\Parameter(
        name: 'active',
        in: 'query',
        description: 'Usuario activo',
        schema: new OA\Schema(type: 'boolean')
    )]
    #[OA\Parameter(ref: '#/components/parameters/PerPage')]
    #[OA\Parameter(ref: '#/components/parameters/SortBy')]
    #[OA\Parameter(ref: '#/components/parameters/SortDirection')]
    #[OA\Get(
        path: '/users',
        summary: 'Listar usuarios',
        security: [['sanctum' => []]],
        tags: ['Users']
    )]
    #[OA\Response(response: 200, description: 'Listado de usuarios')]
    public function index(Request $request): JsonResponse
    {
        $filter = new UserFilter(
            search: $request->query('search'),
            searchBy: $request->query('searchBy', 'all'),
            type: $request->query('type'),
            active: $request->has('active')
                ? $request->boolean('active')
                : null,
            perPage: (int) $request->query('per_page', 15),
            sortBy: $request->query('sort_by', 'name'),
            sortDirection: $request->query('sort_direction', 'asc'),
        );

        return $this->success(
            $this->paginated(
                $this->userService->paginate($filter)
            ),
            'Usuarios obtenidos correctamente.'
        );
    }

    #[OA\Post(
        path: '/users',
        summary: 'Crear usuario',
        security: [['sanctum' => []]],
        tags: ['Users']
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['name', 'last_name', 'email', 'password', 'password_confirmation', 'type'],
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Adrián'),
                new OA\Property(property: 'last_name', type: 'string', example: 'Tresgallo'),
                new OA\Property(property: 'email', type: 'string', example: 'alumno@test.com'),
                new OA\Property(property: 'password', type: 'string', example: 'password'),
                new OA\Property(property: 'password_confirmation', type: 'string', example: 'password'),
                new OA\Property(property: 'type', type: 'string', example: 'student'),
                new OA\Property(property: 'active', type: 'boolean', example: true),
            ]
        )
    )]
    #[OA\Response(response: 201, description: 'Usuario creado')]
    #[OA\Response(response: 422, description: 'Error de validación')]
    public function store(StoreUserRequest $request): JsonResponse
    {
        $data = $request->validated();

        $dto = new UserDto(
            id: null,
            name: $data['name'],
            lastName: $data['last_name'],
            email: $data['email'],
            type: $data['type'],
            active: $data['active'] ?? true,
            password: $data['password'],
        );

        $user = $this->userService->create($dto);

        $userModel = User::find($user->id);

        if ($userModel) {
            $userModel->syncRoles([$userModel->type]);

            $this->notificationService->createForUser(
                $userModel,
                'Bienvenido a Aulearning',
                'Tu cuenta ha sido creada correctamente. Ya puedes acceder a la plataforma.',
                'user'
            );
        }

        return $this->success(
            $user,
            'Usuario creado correctamente.',
            201
        );
    }

    #[OA\Get(
        path: '/users/{id}',
        summary: 'Ver usuario',
        security: [['sanctum' => []]],
        tags: ['Users']
    )]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Usuario encontrado')]
    #[OA\Response(response: 404, description: 'Usuario no encontrado')]
    public function show(int $id): JsonResponse
    {
        $user = $this->userService->getById($id);

        if (!$user) {
            return $this->error('Usuario no encontrado.', 404);
        }

        return $this->success($user, 'Usuario obtenido correctamente.');
    }

    #[OA\Put(
        path: '/users/{id}',
        summary: 'Actualizar usuario',
        security: [['sanctum' => []]],
        tags: ['Users']
    )]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Usuario actualizado')]
    #[OA\Response(response: 404, description: 'Usuario no encontrado')]
    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        $current = $this->userService->getById($id);

        if (!$current) {
            return $this->error('Usuario no encontrado.', 404);
        }

        $oldUser = User::find($id);

        $data = array_merge($current->toArray(), $request->validated());

        $dto = new UserDto(
            id: $id,
            name: $data['name'],
            lastName: $data['last_name'],
            email: $data['email'],
            type: $data['type'],
            active: $data['active'],
            password: $data['password'] ?? null,
        );

        $user = $this->userService->update($id, $dto);

        $userModel = \App\Models\User::find($id);

        if ($userModel) {
            $userModel->syncRoles([$userModel->type]);
        }

        return $this->success(
            $user,
            'Usuario actualizado correctamente.'
        );
    }

    #[OA\Delete(
        path: '/users/{id}',
        summary: 'Eliminar usuario',
        security: [['sanctum' => []]],
        tags: ['Users']
    )]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Usuario eliminado')]
    #[OA\Response(response: 404, description: 'Usuario no encontrado')]
    public function destroy(int $id): JsonResponse
    {
        $user = User::find($id);

        if (!$this->userService->delete($id)) {
            return $this->error(
                'Usuario no encontrado.',
                404
            );
        }

        $this->notificationService->createGlobal(
            'Usuario eliminado',
            "Se ha eliminado el usuario {$user?->name} {$user?->last_name}.",
            'user'
        );

        return $this->success(
            null,
            'Usuario eliminado correctamente.'
        );
    }
}
