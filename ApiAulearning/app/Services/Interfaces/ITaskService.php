<?php

namespace App\Services\Interfaces;

use App\Services\Interfaces\IBaseService;
use Illuminate\Support\Collection;

interface ITaskService extends IBaseService
{
    public function getByCourse(
        int $courseId
    ): Collection;

    public function getByStudent(
        int $studentId
    ): Collection;
}