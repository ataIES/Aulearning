<?php

namespace App\Http\Controllers\Api;

use App\Services\Interfaces\IDashboardService;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

class DashBoardController extends BaseApiController
{
    public function __construct(
        private readonly IDashBoardService $dashboardService
    ) {}

    #[OA\Get(
        path: '/dashboard/admin',
        summary: 'Dashboard de administrador',
        description: 'Devuelve resumen y últimas actualizaciones de los últimos 3 días.',
        security: [['sanctum' => []]],
        tags: ['Dashboard']
    )]
    #[OA\Response(
        response: 200,
        description: 'Dashboard obtenido correctamente'
    )]
    #[OA\Response(
        response: 401,
        description: 'No autenticado'
    )]
    #[OA\Response(
        response: 403,
        description: 'No autorizado'
    )]
    public function getAdminDashBoard(): JsonResponse
    {
        return $this->success(
            $this->dashboardService->getAdminDashboard(),
            'Dashboard obtenido correctamente.'
        );
    }
}