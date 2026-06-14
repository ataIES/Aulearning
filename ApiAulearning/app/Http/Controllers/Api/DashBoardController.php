<?php

namespace App\Http\Controllers\Api;

use App\Services\Interfaces\IDashboardService;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;
use Illuminate\Http\Request;

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

    #[OA\Get(
        path: '/dashboard/teacher',
        summary: 'Dashboard del profesor',
        description: 'Obtiene el dashboard del profesor autenticado con resumen de cursos, tareas, entregas, alumnos y actividad reciente.',
        security: [['sanctum' => []]],
        tags: ['Dashboard']
    )]
    #[OA\Response(response: 200, description: 'Dashboard del profesor obtenido correctamente')]
    #[OA\Response(response: 401, description: 'No autenticado')]
    #[OA\Response(response: 403, description: 'No autorizado')]
    public function getTeacherDashBoard(Request $request): JsonResponse
    {
        return $this->success(
            $this->dashboardService->getTeacherDashboard($request->user()),
            'Dashboard del profesor obtenido correctamente.'
        );
    }

    #[OA\Get(
        path: '/dashboard/student',
        summary: 'Dashboard del alumno',
        description: 'Obtiene el dashboard del alumno autenticado con resumen de cursos, tareas pendientes, materiales y calificaciones.',
        security: [['sanctum' => []]],
        tags: ['Dashboard']
    )]
    #[OA\Response(response: 200, description: 'Dashboard del alumno obtenido correctamente')]
    #[OA\Response(response: 401, description: 'No autenticado')]
    #[OA\Response(response: 403, description: 'No autorizado')]
    public function getStudentDashBoard(Request $request): JsonResponse
    {
        return $this->success(
            $this->dashboardService->getStudentDashboard($request->user()),
            'Dashboard del alumno obtenido correctamente.'
        );
    }
}
