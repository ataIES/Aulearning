<?php

namespace App\Mappers;

use App\DTOs\Interfaces\IBaseDto;
use App\DTOs\TaskDto;
use App\Models\Task;
use App\Mappers\Interfaces\IBaseMapper;
use Illuminate\Database\Eloquent\Model;

class TaskMapper extends BaseMapper implements IBaseMapper
{
    public function toDto(Model $model): TaskDto
    {
        /** @var Task $model */
        return new TaskDto(
            id: $model->id,
            title: $model->title,
            description: $model->description,
            dueDate: (string) $model->due_date,
            courseId: $model->course_id,
            studentId: $model->student_id,
            type: $model->type,
            gradable: (bool) $model->gradable,
            comment: $model->comment,
            status: $model->status,
        );
    }

    public function toArray(IBaseDto $dto): array
    {
        /** @var TaskDto $dto */
        return $this->removeNulls([
            'title' => $dto->title,
            'description' => $dto->description,
            'due_date' => $dto->dueDate,
            'course_id' => $dto->courseId,
            'student_id' => $dto->studentId,
            'type' => $dto->type,
            'gradable' => $dto->gradable,
            'comment' => $dto->comment,
            'status' => $dto->status,
        ]);
    }
}