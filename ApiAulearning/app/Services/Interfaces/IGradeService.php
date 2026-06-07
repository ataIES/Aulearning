<?php

namespace App\Services\Interfaces;

use Illuminate\Support\Collection;

interface IGradeService extends IBaseService
{
    public function getByStudent(int $studentId): Collection;

    public function getByCourse(int $courseId): Collection;
}