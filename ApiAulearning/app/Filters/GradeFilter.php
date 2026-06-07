<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class GradeFilter extends BaseFilter
{
    public function __construct(
        public readonly ?int $studentId = null,
        public readonly ?int $courseId = null,
        public readonly ?float $minGrade = null,
        public readonly ?float $maxGrade = null,
        ?int $perPage = 15,
        ?string $sortBy = 'id',
        ?string $sortDirection = 'desc',
    ) {
        parent::__construct($perPage, $sortBy, $sortDirection);
    }

    public function apply(Builder $query): Builder
    {
        $query
            ->when($this->studentId, fn (Builder $query) =>
                $query->where('student_id', $this->studentId)
            )
            ->when($this->courseId, fn (Builder $query) =>
                $query->where('course_id', $this->courseId)
            )
            ->when($this->minGrade !== null, fn (Builder $query) =>
                $query->where('grade', '>=', $this->minGrade)
            )
            ->when($this->maxGrade !== null, fn (Builder $query) =>
                $query->where('grade', '<=', $this->maxGrade)
            );

        return $this->applySorting(
            $query,
            ['id', 'grade', 'student_id', 'course_id', 'created_at']
        );
    }
}