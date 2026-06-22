<?php

namespace App\Repositories\Interfaces;

use App\Repositories\Interfaces\IBaseRepository;
use Illuminate\Database\Eloquent\Collection;

interface IFileRepository extends IBaseRepository
{
    public function getByTask(int $taskId): Collection;
}