<?php

namespace App\Services;

use App\Models\User;
use App\Services\Interfaces\IAuthService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class AuthService implements IAuthService
{
    public function login(array $credentials): array
    {
        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales son incorrectas.'],
            ]);
        }

        /** @var User $user */
        $user = Auth::user();

        if (!$user->active) {
            throw ValidationException::withMessages([
                'email' => ['El usuario está desactivado.'],
            ]);
        }

        return [
            'user' => $user->load('roles', 'permissions'),
            'token' => $user->createToken('api-token')->plainTextToken,
            'token_type' => 'Bearer',
        ];
    }

    public function logout(User $user): void
    {
        $token = $user->currentAccessToken();

        if ($token instanceof PersonalAccessToken) {
            $token->delete();
        }
    }

    public function logoutAll(User $user): void
    {
        $user->tokens()->delete();
    }
}