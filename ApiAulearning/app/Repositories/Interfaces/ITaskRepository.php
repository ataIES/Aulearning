<?php

namespace App\Repositories\Interfaces;

use App\Repositories\Interfaces\IBaseRepository;
use Illuminate\Database\Eloquent\Collection;

interface ITaskRepository extends IBaseRepository
{
    public function getByCourse(int $courseId): Collection;

    public function getByStudent(int $studentId): Collection;
}