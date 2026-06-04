<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    use ApiResponse;

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
                new OA\Property(
                    property: 'email',
                    type: 'string',
                    example: 'admin@aulearning.test'
                ),
                new OA\Property(
                    property: 'password',
                    type: 'string',
                    example: 'password'
                ),
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Login correcto'
    )]
    #[OA\Response(
        response: 422,
        description: 'Error de validación'
    )]
    public function login(LoginRequest $request): JsonResponse
    {
        if (!Auth::attempt($request->validated())) {
            throw ValidationException::withMessages([
                'email' => [
                    'Las credenciales son incorrectas.',
                ],
            ]);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->active) {
            throw ValidationException::withMessages([
                'email' => [
                    'El usuario está desactivado.',
                ],
            ]);
        }

        $token = $user
            ->createToken('api-token')
            ->plainTextToken;

        return $this->success(
            [
                'user' => $user->load(
                    'roles',
                    'permissions'
                ),
                'token' => $token,
                'token_type' => 'Bearer',
            ],
            'Login correcto.'
        );
    }

    #[OA\Get(
        path: '/auth/me',
        summary: 'Usuario autenticado',
        security: [['sanctum' => []]],
        tags: ['Auth']
    )]
    #[OA\Response(
        response: 200,
        description: 'Usuario autenticado'
    )]
    #[OA\Response(
        response: 401,
        description: 'No autenticado'
    )]
    public function me(Request $request): JsonResponse
    {
        return $this->success(
            $request->user()->load(
                'roles',
                'permissions'
            )
        );
    }

    #[OA\Post(
        path: '/auth/logout',
        summary: 'Cerrar sesión actual',
        security: [['sanctum' => []]],
        tags: ['Auth']
    )]
    #[OA\Response(
        response: 200,
        description: 'Logout correcto'
    )]
    #[OA\Response(
        response: 401,
        description: 'No autenticado'
    )]
    public function logout(Request $request): JsonResponse
    {
        $request
            ->user()
            ->currentAccessToken()
            ?->delete();

        return $this->success(
            null,
            'Sesión cerrada correctamente.'
        );
    }

    #[OA\Post(
        path: '/auth/logout-all',
        summary: 'Cerrar todas las sesiones',
        security: [['sanctum' => []]],
        tags: ['Auth']
    )]
    #[OA\Response(
        response: 200,
        description: 'Todas las sesiones cerradas'
    )]
    #[OA\Response(
        response: 401,
        description: 'No autenticado'
    )]
    public function logoutAll(Request $request): JsonResponse
    {
        $request
            ->user()
            ->tokens()
            ->delete();

        return $this->success(
            null,
            'Todas las sesiones han sido cerradas.'
        );
    }
}