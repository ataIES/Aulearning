<?php

namespace App\DTOs;

use App\DTOs\Interfaces\IBaseDto;
use Carbon\Carbon;

class DeliverTaskDto implements IBaseDto
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $studentId,
        public readonly int $taskId,
        public readonly ?Carbon $deliveryDate = null,
        public readonly ?Carbon $updatedDate = null,
        public readonly ?float $grade = null,
        public readonly ?string $comment = null,
        public ?Carbon $gradedAt = null,
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,

            'student_id' =>
                $this->studentId,

            'task_id' =>
                $this->taskId,

            'delivery_date' =>
                $this->deliveryDate
                    ?->toISOString(),

            'updated_date' =>
                $this->updatedDate
                    ?->toISOString(),

            'grade' =>
                $this->grade,

            'comment' =>
                $this->comment,

            'graded_at' =>
                $this->gradedAt
                    ?->toISOString(),
        ];
    }
}