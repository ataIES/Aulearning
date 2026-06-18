<?php

namespace App\Services\Interfaces;

use App\Filters\DeliverTaskFilter;
use App\Services\Interfaces\IBaseService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface IDeliverTaskService extends IBaseService
{
    public function getByStudent(
        int $studentId
    ): Collection;

    public function getByTask(
        int $taskId
    ): Collection;
    public function paginateDeliveries(
        DeliverTaskFilter $filter,
        array $relations = []
    ): LengthAwarePaginator;
}
