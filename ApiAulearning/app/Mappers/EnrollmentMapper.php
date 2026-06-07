<?php

namespace App\Mappers;

use App\DTOs\EnrollmentDto;
use App\DTOs\Interfaces\IBaseDto;
use App\Models\Enrollment;
use App\Mappers\Interfaces\IBaseMapper;
use Illuminate\Database\Eloquent\Model;

class EnrollmentMapper extends BaseMapper implements IBaseMapper
{
    public function toDto(Model $model): EnrollmentDto
    {
        /** @var Enrollment $model */
        return new EnrollmentDto(
            id: $model->id,
            studentId: $model->student_id,
            courseId: $model->course_id,
            enrollmentDate: (string) $model->enrollment_date,
            active: (bool) $model->active,
        );
    }

    public function toArray(IBaseDto $dto): array
    {
        /** @var EnrollmentDto $dto */
        return $this->removeNulls([
            'student_id' => $dto->studentId,
            'course_id' => $dto->courseId,
            'enrollment_date' => $dto->enrollmentDate,
            'active' => $dto->active,
        ]);
    }
}