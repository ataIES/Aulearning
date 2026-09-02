<?php

namespace App\Mappers;

use App\DTOs\DeliverTaskDto;
use App\Mappers\Interfaces\IDeliverTaskMapper;
use App\Models\DeliveryTask;
use Carbon\Carbon;

class DeliverTaskMapper extends BaseMapper implements IDeliverTaskMapper
{
    public function toDto(
        mixed $model
    ): DeliverTaskDto {
        /** @var DeliveryTask $model */

        return new DeliverTaskDto(
            id: $model->id,

            studentId: $model->student_id,

            taskId: $model->task_id,

            deliveryDate: $model->delivery_date
                ? Carbon::parse($model->delivery_date)
                : null,

            updatedDate: $model->updated_date
                ? Carbon::parse($model->updated_date)
                : null,

            grade: $model->grade !== null
                ? (float) $model->grade
                : null,

            comment: $model->comment,

            gradedAt: $model->graded_at
                ? Carbon::parse($model->graded_at)
                : null,
        );
    }

    public function toArray(
        mixed $dto
    ): array {
        /** @var DeliverTaskDto $dto */

        return $this->removeNulls([
            'student_id' => $dto->studentId,

            'task_id' => $dto->taskId,

            'delivery_date' => $dto->deliveryDate,

            'updated_date' => $dto->updatedDate,

            'grade' => $dto->grade,

            'comment' => $dto->comment,

            'graded_at' => $dto->gradedAt,
        ]);
    }
}