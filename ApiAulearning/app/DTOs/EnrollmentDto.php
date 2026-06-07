<?php

namespace App\DTOs;

use App\DTOs\Interfaces\IBaseDto;

class EnrollmentDto implements IBaseDto
{
    public function __construct(
        public ?int $id,
        public int $studentId,
        public int $courseId,
        public string $enrollmentDate,
        public bool $active = true,
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'student_id' => $this->studentId,
            'course_id' => $this->courseId,
            'enrollment_date' => $this->enrollmentDate,
            'active' => $this->active,
        ];
    }
}