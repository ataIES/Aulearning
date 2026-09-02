<?php

namespace App\Services\Interfaces;

use App\Models\User;

interface IDashboardService
{
    public function getAdminDashboard(): array;

    public function teacherDashboard(int $teacherId): array;

    public function getStudentDashboard(User $student): array;
}
