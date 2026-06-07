<?php

namespace App\Mappers;

use App\DTOs\CourseDto;
use App\DTOs\Interfaces\IBaseDto;
use App\Models\Course;
use App\Mappers\Interfaces\IBaseMapper;
use Illuminate\Database\Eloquent\Model;

class CourseMapper extends BaseMapper implements IBaseMapper
{
    public function toDto(Model $model): CourseDto
    {
        /** @var Course $model */
        return new CourseDto(
            id: $model->id,
            name: $model->name,
            description: $model->description,
            startDate: (string) $model->start_date,
            endDate: (string) $model->end_date,
            teacherId: $model->teacher_id,
        );
    }

    public function toArray(IBaseDto $dto): array
    {
        /** @var CourseDto $dto */
        return $this->removeNulls([
            'name' => $dto->name,
            'description' => $dto->description,
            'start_date' => $dto->startDate,
            'end_date' => $dto->endDate,
            'teacher_id' => $dto->teacherId,
        ]);
    }
}