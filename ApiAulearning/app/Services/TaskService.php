<?php

namespace App\Services;

use App\DTOs\Interfaces\IBaseDto;
use App\Models\Enrollment;
use App\Models\Task;
use App\Models\User;
use App\Mappers\TaskMapper;
use App\Repositories\Interfaces\ITaskRepository;
use App\Services\Interfaces\INotificationService;
use App\Services\Interfaces\ITaskService;
use Illuminate\Support\Collection;

class TaskService extends BaseService implements ITaskService
{
    public function __construct(
        private readonly ITaskRepository $taskRepository,
        private readonly INotificationService $notificationService,
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

    public function create(IBaseDto $dto): IBaseDto
    {
        $createdTask = parent::create($dto);

        $task = Task::query()
            ->with('course')
            ->find($createdTask->id);

        if ($task) {
            $this->notifyCourseStudents(
                $task->course_id,
                'Nueva tarea publicada',
                "Se ha publicado la tarea {$task->title} en el curso {$task->course?->name}.",
                'task'
            );
        }

        return $createdTask;
    }

    public function update(int $id, IBaseDto $dto): ?IBaseDto
    {
        $updatedTask = parent::update($id, $dto);

        $task = Task::query()
            ->with('course')
            ->find($id);

        if ($updatedTask && $task) {
            $this->notifyCourseStudents(
                $task->course_id,
                'Tarea actualizada',
                "Se ha actualizado la tarea {$task->title} del curso {$task->course?->name}.",
                'task'
            );
        }

        return $updatedTask;
    }

    private function notifyCourseStudents(
        int $courseId,
        string $title,
        string $content,
        string $type = 'task'
    ): void {
        $students = User::query()
            ->whereHas('enrollments', function ($query) use ($courseId) {
                $query->where('course_id', $courseId);
            })
            ->get();

        foreach ($students as $student) {
            $this->notificationService->createForUser(
                $student,
                $title,
                $content,
                $type
            );
        }
    }
}