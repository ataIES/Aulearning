<?php

namespace App\Repositories\Interfaces;

use Illuminate\Support\Collection;

interface IDeliverTaskRepository extends IBaseRepository
{
    public function getByStudent(
        int $studentId
    ): Collection;

    public function getByTask(
        int $taskId
    ): Collection;
}