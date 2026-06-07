<?php

namespace App\Repositories;

use App\Models\Grade;
use App\Repositories\Interfaces\IGradeRepository;
use Illuminate\Database\Eloquent\Collection;

class GradeRepository extends BaseRepository implements IGradeRepository
{
    public function __construct(Grade $model)
    {
        parent::__construct($model);
    }

    public function getByStudent(int $studentId): Collection
    {
        return Grade::query()
            ->where('student_id', $studentId)
            ->with(['course'])
            ->get();
    }

    public function getByCourse(int $courseId): Collection
    {
        return Grade::query()
            ->where('course_id', $courseId)
            ->with(['student'])
            ->get();
    }
}