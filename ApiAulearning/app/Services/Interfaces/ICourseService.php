<?php

namespace App\Services\Interfaces;

use App\Services\Interfaces\IBaseService;
use Illuminate\Support\Collection;

interface ICourseService extends IBaseService
{
    public function getByTeacher(
        int $teacherId
    ): Collection;

    public function getTeacherCourseDetail(
        int $courseId,
        int $teacherId
    ): mixed;
}
