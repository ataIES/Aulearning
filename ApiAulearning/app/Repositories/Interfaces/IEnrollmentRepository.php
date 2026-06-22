<?php

namespace App\Repositories\Interfaces;

use App\Repositories\Interfaces\IBaseRepository;
use Illuminate\Database\Eloquent\Collection;

interface IEnrollmentRepository extends IBaseRepository
{
    public function getByStudent(int $studentId): Collection;

    public function getByCourse(int $courseId): Collection;

    public function existsEnrollment(int $studentId, int $courseId): bool;
}