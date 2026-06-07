<?php

namespace App\DTOs;

use App\DTOs\Interfaces\IBaseDto;

class GradeDto implements IBaseDto
{
    public function __construct(
        public ?int $id,
        public float $grade,
        public int $studentId,
        public int $courseId,
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'grade' => $this->grade,
            'student_id' => $this->studentId,
            'course_id' => $this->courseId,
        ];
    }
}