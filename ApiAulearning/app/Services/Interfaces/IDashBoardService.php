<?php

namespace App\Services\Interfaces;

interface IDashBoardService
{
    public function getAdminDashboard(): array;

    public function clearAdminDashboardCache(): void;
}