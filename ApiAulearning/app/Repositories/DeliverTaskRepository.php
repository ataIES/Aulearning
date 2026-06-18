<?php

namespace App\Repositories;

use App\Models\DeliveryTask;
use App\Repositories\Interfaces\IDeliverTaskRepository;
use Illuminate\Support\Collection;

class DeliverTaskRepository extends BaseRepository implements IDeliverTaskRepository
{
    public function __construct(
        DeliveryTask $model
    ) {
        parent::__construct($model);
    }

    public function getByStudent(int $studentId): Collection
    {
        return $this->model
            ->with([
                'student',
                'task',
                'task.course',
                'files',
            ])
            ->where('student_id', $studentId)
            ->latest()
            ->get();
    }

    public function getByTask(int $taskId): Collection
    {
        return $this->model
            ->with([
                'student',
                'task',
                'task.course',
                'files',
            ])
            ->where('task_id', $taskId)
            ->latest()
            ->get();
    }
}