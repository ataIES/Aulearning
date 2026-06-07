<?php

namespace App\Services;

use App\Mappers\CourseMapper;
use App\Repositories\Interfaces\ICourseRepository;
use App\Services\Interfaces\ICourseService;
use Illuminate\Support\Collection;

class CourseService extends BaseService implements ICourseService
{
    public function __construct(
        private readonly ICourseRepository $courseRepository,
        CourseMapper $mapper,
    ) {
        parent::__construct($courseRepository, $mapper);
    }

    public function getByTeacher(int $teacherId): Collection
    {
        return $this->courseRepository
            ->getByTeacher($teacherId)
            ->map(fn ($course) => $this->mapper->toDto($course));
    }
}