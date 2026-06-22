<?php

namespace App\Services\Interfaces;

use App\DTOs\EnrollmentDto;
use Illuminate\Support\Collection;

interface IEnrollmentService extends IBaseService
{
    public function enroll(
        EnrollmentDto $dto
    ): EnrollmentDto;

    public function getByStudent(
        int $studentId
    ): Collection;

    public function getByCourse(
        int $courseId
    ): Collection;
}