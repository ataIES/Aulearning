<?php

namespace App\Services\Interfaces;

use App\Services\Interfaces\IBaseService;
use Illuminate\Support\Collection;

interface IDeliverTaskService extends IBaseService
{
    public function getByStudent(
        int $studentId
    ): Collection;

    public function getByTask(
        int $taskId
    ): Collection;
}