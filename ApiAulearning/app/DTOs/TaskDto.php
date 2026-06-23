<?php

namespace App\DTOs;

use App\DTOs\Interfaces\IBaseDto;

class TaskDto implements IBaseDto
{
    public function __construct(
        public ?int $id,
        public string $title,
        public string $description,
        public ?string $dueDate,
        public int $courseId,
        public ?int $studentId,
        public string $type,
        public bool $gradable = true,
        public ?string $comment = null,
        public string $status = 'pending',
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'due_date' => $this->dueDate,
            'course_id' => $this->courseId,
            'student_id' => $this->studentId,
            'type' => $this->type,
            'gradable' => $this->gradable,
            'comment' => $this->comment,
            'status' => $this->status,
        ];
    }
}