<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;
use Spatie\Permission\Models\Permission;

class PermissionController extends BaseApiController
{
    #[OA\Get(
        path: '/permissions',
        summary: 'Listar permisos',
        description: 'Obtiene todos los permisos disponibles.',
        security: [['sanctum' => []]],
        tags: ['Permissions']
    )]
    #[OA\Response(response: 200, description: 'Permisos obtenidos correctamente')]
    #[OA\Response(response: 401, description: 'No autenticado')]
    #[OA\Response(response: 403, description: 'No autorizado')]
    public function index(): JsonResponse
    {
        $permissions = Permission::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return $this->success(
            $permissions,
            'Permisos obtenidos correctamente.'
        );
    }
}