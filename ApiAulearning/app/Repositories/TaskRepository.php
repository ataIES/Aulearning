<?php

namespace App\Repositories;

use App\Models\Task;
use App\Repositories\Interfaces\ITaskRepository;
use Illuminate\Database\Eloquent\Collection;

class TaskRepository extends BaseRepository implements ITaskRepository
{
    public function __construct(Task $model)
    {
        parent::__construct($model);
    }

    public function getByCourse(int $courseId): Collection
    {
        return Task::query()
            ->where('course_id', $courseId)
            ->with(['course', 'student', 'files'])
            ->get();
    }

    public function getByStudent(int $studentId): Collection
    {
        return Task::query()
            ->where('student_id', $studentId)
            ->with(['course', 'files'])
            ->get();
    }
}