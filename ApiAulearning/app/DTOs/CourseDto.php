<?php

namespace App\DTOs;

use App\DTOs\Interfaces\IBaseDto;

class CourseDto implements IBaseDto
{
    public function __construct(
        public ?int $id,
        public string $name,
        public ?string $description,
        public string $startDate,
        public string $endDate,
        public int $teacherId,
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'start_date' => $this->startDate,
            'end_date' => $this->endDate,
            'teacher_id' => $this->teacherId,
        ];
    }
}