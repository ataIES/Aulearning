<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Auth\LoginRequest;
use App\Services\Interfaces\IAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class AuthController extends BaseApiController
{
    public function __construct(
        private readonly IAuthService $authService
    ) {}

    #[OA\Post(
        path: '/auth/login',
        summary: 'Iniciar sesión',
        tags: ['Auth']
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['email', 'password'],
            properties: [
                new OA\Property(property: 'email', type: 'string', example: 'admin@aulearning.test'),
                new OA\Property(property: 'password', type: 'string', example: 'password'),
            ]
        )
    )]
    #[OA\Response(response: 200, description: 'Login correcto')]
    #[OA\Response(response: 422, description: 'Error de validación')]
    public function login(LoginRequest $request): JsonResponse
    {
        return $this->success(
            $this->authService->login($request->validated()),
            'Login correcto.'
        );
    }

    #[OA\Get(
        path: '/auth/me',
        summary: 'Usuario autenticado',
        security: [['sanctum' => []]],
        tags: ['Auth']
    )]
    #[OA\Response(response: 200, description: 'Usuario autenticado')]
    #[OA\Response(response: 401, description: 'No autenticado')]
    public function me(Request $request): JsonResponse
    {
        return $this->success(
            $request->user()->load('roles', 'permissions'),
            'Usuario autenticado.'
        );
    }

    #[OA\Post(
        path: '/auth/logout',
        summary: 'Cerrar sesión actual',
        security: [['sanctum' => []]],
        tags: ['Auth']
    )]
    #[OA\Response(response: 200, description: 'Logout correcto')]
    #[OA\Response(response: 401, description: 'No autenticado')]
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return $this->success(null, 'Sesión cerrada correctamente.');
    }

    #[OA\Post(
        path: '/auth/logout-all',
        summary: 'Cerrar todas las sesiones',
        security: [['sanctum' => []]],
        tags: ['Auth']
    )]
    #[OA\Response(response: 200, description: 'Todas las sesiones cerradas')]
    #[OA\Response(response: 401, description: 'No autenticado')]
    public function logoutAll(Request $request): JsonResponse
    {
        $this->authService->logoutAll($request->user());

        return $this->success(null, 'Todas las sesiones han sido cerradas.');
    }
}