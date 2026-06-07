<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class EnrollmentFilter extends BaseFilter
{
    public function __construct(
        public readonly ?int $studentId = null,
        public readonly ?int $courseId = null,
        public readonly ?bool $active = null,
        public readonly ?string $enrollmentDateFrom = null,
        public readonly ?string $enrollmentDateTo = null,
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
            ->when($this->active !== null, fn (Builder $query) =>
                $query->where('active', $this->active)
            )
            ->when($this->enrollmentDateFrom, fn (Builder $query) =>
                $query->whereDate('enrollment_date', '>=', $this->enrollmentDateFrom)
            )
            ->when($this->enrollmentDateTo, fn (Builder $query) =>
                $query->whereDate('enrollment_date', '<=', $this->enrollmentDateTo)
            );

        return $this->applySorting(
            $query,
            ['id', 'student_id', 'course_id', 'enrollment_date', 'active', 'created_at']
        );
    }
}