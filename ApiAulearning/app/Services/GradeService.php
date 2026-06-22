<?php

namespace App\Services;

use App\Mappers\GradeMapper;
use App\Repositories\Interfaces\IGradeRepository;
use App\Services\Interfaces\IGradeService;
use Illuminate\Support\Collection;

class GradeService extends BaseService implements IGradeService
{
    public function __construct(
        private readonly IGradeRepository $gradeRepository,
        GradeMapper $mapper,
    ) {
        parent::__construct($gradeRepository, $mapper);
    }

    public function getByStudent(int $studentId): Collection
    {
        return $this->gradeRepository
            ->getByStudent($studentId)
            ->map(fn ($grade) => $this->mapper->toDto($grade));
    }

    public function getByCourse(int $courseId): Collection
    {
        return $this->gradeRepository
            ->getByCourse($courseId)
            ->map(fn ($grade) => $this->mapper->toDto($grade));
    }
}