<?php

namespace App\Repositories;

use App\Models\Course;
use App\Repositories\Interfaces\ICourseRepository;
use Illuminate\Database\Eloquent\Collection;

class CourseRepository extends BaseRepository implements ICourseRepository
{
    public function __construct(Course $model)
    {
        parent::__construct($model);
    }

    public function getByTeacher(int $teacherId): Collection
    {
        return Course::query()
            ->where('teacher_id', $teacherId)
            ->with(['teacher'])
            ->get();
    }
}