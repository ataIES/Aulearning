<?php

namespace App\Services;

use App\Mappers\TaskMapper;
use App\Repositories\Interfaces\ITaskRepository;
use App\Services\Interfaces\ITaskService;
use Illuminate\Support\Collection;

class TaskService extends BaseService implements ITaskService
{
    public function __construct(
        private readonly ITaskRepository $taskRepository,
        TaskMapper $mapper,
    ) {
        parent::__construct($taskRepository, $mapper);
    }

    public function getByCourse(int $courseId): Collection
    {
        return $this->taskRepository
            ->getByCourse($courseId)
            ->map(fn ($task) => $this->mapper->toDto($task));
    }

    public function getByStudent(int $studentId): Collection
    {
        return $this->taskRepository
            ->getByStudent($studentId)
            ->map(fn ($task) => $this->mapper->toDto($task));
    }
}