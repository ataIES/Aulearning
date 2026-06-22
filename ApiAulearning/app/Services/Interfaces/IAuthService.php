<?php

namespace App\Services\Interfaces;

use App\Models\User;

interface IAuthService
{
    public function login(
        array $credentials
    ): array;

    public function logout(
        User $user
    ): void;

    public function logoutAll(
        User $user
    ): void;
}