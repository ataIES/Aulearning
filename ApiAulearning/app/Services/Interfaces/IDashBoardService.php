<?php

namespace App\Services\Interfaces;

use App\Models\User;

interface IDashBoardService
{
    public function getAdminDashboard(): array;

    public function clearAdminDashboardCache(): void;

    public function getTeacherDashboard(User $teacher): array;

    public function getStudentDashboard(User $student): array;
}
