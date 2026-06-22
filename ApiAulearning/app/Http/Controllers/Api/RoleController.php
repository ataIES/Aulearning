<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use OpenApi\Attributes as OA;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends BaseApiController
{
    #[OA\Get(
        path: '/roles',
        summary: 'Listar roles',
        description: 'Obtiene todos los roles con sus permisos.',
        security: [['sanctum' => []]],
        tags: ['Roles']
    )]
    #[OA\Response(response: 200, description: 'Roles obtenidos correctamente')]
    public function index(): JsonResponse
    {
        $roles = Role::query()
            ->with('permissions:id,name')
            ->orderBy('name')
            ->get();

        return $this->success($roles, 'Roles obtenidos correctamente.');
    }

    #[OA\Post(
        path: '/roles',
        summary: 'Crear rol',
        security: [['sanctum' => []]],
        tags: ['Roles']
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['name'],
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'coordinator')
            ]
        )
    )]
    #[OA\Response(response: 201, description: 'Rol creado correctamente')]
    #[OA\Response(response: 422, description: 'Error de validación')]
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:roles,name'],
        ]);

        $role = Role::create([
            'name' => $data['name'],
            'guard_name' => 'web',
        ]);

        return $this->success($role, 'Rol creado correctamente.', 201);
    }

    #[OA\Put(
        path: '/roles/{id}',
        summary: 'Actualizar rol',
        security: [['sanctum' => []]],
        tags: ['Roles']
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['name'],
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'teacher')
            ]
        )
    )]
    #[OA\Response(response: 200, description: 'Rol actualizado correctamente')]
    #[OA\Response(response: 404, description: 'Rol no encontrado')]
    public function update(Request $request, int $id): JsonResponse
    {
        $role = Role::query()->find($id);

        if (!$role) {
            return $this->error('Rol no encontrado.', 404);
        }

        $data = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('roles', 'name')->ignore($role->id),
            ],
        ]);

        $role->update(['name' => $data['name']]);

        return $this->success($role, 'Rol actualizado correctamente.');
    }

    #[OA\Delete(
        path: '/roles/{id}',
        summary: 'Eliminar rol',
        security: [['sanctum' => []]],
        tags: ['Roles']
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Response(response: 200, description: 'Rol eliminado correctamente')]
    #[OA\Response(response: 404, description: 'Rol no encontrado')]
    public function destroy(int $id): JsonResponse
    {
        $role = Role::query()->find($id);

        if (!$role) {
            return $this->error('Rol no encontrado.', 404);
        }

        if (in_array($role->name, ['admin', 'teacher', 'student'], true)) {
            return $this->error('No puedes eliminar un rol base del sistema.', 422);
        }

        $role->delete();

        return $this->success(null, 'Rol eliminado correctamente.');
    }

    #[OA\Put(
        path: '/roles/{id}/permissions',
        summary: 'Sincronizar permisos de rol',
        security: [['sanctum' => []]],
        tags: ['Roles']
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['permissions'],
            properties: [
                new OA\Property(
                    property: 'permissions',
                    type: 'array',
                    items: new OA\Items(type: 'string'),
                    example: ['users.view', 'courses.view']
                )
            ]
        )
    )]
    #[OA\Response(response: 200, description: 'Permisos actualizados correctamente')]
    public function syncPermissions(Request $request, int $id): JsonResponse
    {
        $role = Role::query()->find($id);

        if (!$role) {
            return $this->error('Rol no encontrado.', 404);
        }

        $data = $request->validate([
            'permissions' => ['required', 'array'],
            'permissions.*' => ['required', 'string', 'exists:permissions,name'],
        ]);

        $role->syncPermissions($data['permissions']);

        $role->load('permissions:id,name');

        return $this->success(
            $role,
            'Permisos actualizados correctamente.'
        );
    }
}