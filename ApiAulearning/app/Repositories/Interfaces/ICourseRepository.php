<?php

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Collection;

interface ICourseRepository extends IBaseRepository
{
    public function getByTeacher(int $teacherId): Collection;
}