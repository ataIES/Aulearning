<?php

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Collection;

interface ICourseRepository extends IBaseRepository
{
    public function getByTeacher(int $teacherId): Collection;

    public function getTeacherCourseDetail(
        int $courseId,
        int $teacherId
    ): mixed;
}
