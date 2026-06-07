<?php

namespace App\Services;

use App\DTOs\EnrollmentDto;
use App\Mappers\EnrollmentMapper;
use App\Repositories\Interfaces\IEnrollmentRepository;
use App\Services\Interfaces\IEnrollmentService;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class EnrollmentService extends BaseService implements IEnrollmentService
{
    public function __construct(
        private readonly IEnrollmentRepository $enrollmentRepository,
        EnrollmentMapper $mapper,
    ) {
        parent::__construct($enrollmentRepository, $mapper);
    }

    public function enroll(EnrollmentDto $dto): EnrollmentDto
    {
        if ($this->enrollmentRepository->existsEnrollment($dto->studentId, $dto->courseId)) {
            throw ValidationException::withMessages([
                'student_id' => ['El alumno ya está inscrito en este curso.'],
            ]);
        }

        /** @var EnrollmentDto $enrollment */
        $enrollment = $this->create($dto);

        return $enrollment;
    }

    public function getByStudent(int $studentId): Collection
    {
        return $this->enrollmentRepository
            ->getByStudent($studentId)
            ->map(fn ($enrollment) => $this->mapper->toDto($enrollment));
    }

    public function getByCourse(int $courseId): Collection
    {
        return $this->enrollmentRepository
            ->getByCourse($courseId)
            ->map(fn ($enrollment) => $this->mapper->toDto($enrollment));
    }
}