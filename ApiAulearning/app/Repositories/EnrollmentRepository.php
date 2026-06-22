<?php

namespace App\Repositories;

use App\Models\Enrollment;
use App\Repositories\Interfaces\IEnrollmentRepository;
use Illuminate\Database\Eloquent\Collection;

class EnrollmentRepository extends BaseRepository implements IEnrollmentRepository
{
    public function __construct(Enrollment $model)
    {
        parent::__construct($model);
    }

    public function getByStudent(int $studentId): Collection
    {
        return Enrollment::query()
            ->where('student_id', $studentId)
            ->with(['course'])
            ->get();
    }

    public function getByCourse(int $courseId): Collection
    {
        return Enrollment::query()
            ->where('course_id', $courseId)
            ->with(['student'])
            ->get();
    }

    public function existsEnrollment(int $studentId, int $courseId): bool
    {
        return Enrollment::query()
            ->where('student_id', $studentId)
            ->where('course_id', $courseId)
            ->exists();
    }
}