<?php

namespace App\Mappers;

use App\DTOs\GradeDto;
use App\DTOs\Interfaces\IBaseDto;
use App\Models\Grade;
use App\Mappers\Interfaces\IBaseMapper;
use Illuminate\Database\Eloquent\Model;

class GradeMapper extends BaseMapper implements IBaseMapper
{
    public function toDto(Model $model): GradeDto
    {
        /** @var Grade $model */
        return new GradeDto(
            id: $model->id,
            grade: (float) $model->grade,
            studentId: $model->student_id,
            courseId: $model->course_id,
        );
    }

    public function toArray(IBaseDto $dto): array
    {
        /** @var GradeDto $dto */
        return $this->removeNulls([
            'grade' => $dto->grade,
            'student_id' => $dto->studentId,
            'course_id' => $dto->courseId,
        ]);
    }
}