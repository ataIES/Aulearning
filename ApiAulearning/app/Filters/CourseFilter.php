<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class CourseFilter extends BaseFilter
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly ?int $teacherId = null,
        public readonly ?int $studentId = null,
        public readonly ?string $startDateFrom = null,
        public readonly ?string $startDateTo = null,
        public readonly ?string $endDateFrom = null,
        public readonly ?string $endDateTo = null,
        ?int $perPage = 15,
        ?string $sortBy = 'name',
        ?string $sortDirection = 'desc',
    ) {
        parent::__construct($perPage, $sortBy, $sortDirection);
    }

    public function apply(Builder $query): Builder
    {
        $query
            ->when($this->search, fn ($query) =>
                $query->where('name', 'like', "%{$this->search}%")
                    ->orWhere('description', 'like', "%{$this->search}%")
            )
            ->when($this->teacherId, fn ($query) =>
                $query->where('teacher_id', $this->teacherId)
            )
            ->when($this->studentId, fn ($query) =>
                $query->whereHas('enrollments', fn ($query) =>
                    $query->where('student_id', $this->studentId)
                )
            )
            ->when($this->startDateFrom, fn ($query) =>
                $query->whereDate('start_date', '>=', $this->startDateFrom)
            )
            ->when($this->startDateTo, fn ($query) =>
                $query->whereDate('start_date', '<=', $this->startDateTo)
            )
            ->when($this->endDateFrom, fn ($query) =>
                $query->whereDate('end_date', '>=', $this->endDateFrom)
            )
            ->when($this->endDateTo, fn ($query) =>
                $query->whereDate('end_date', '<=', $this->endDateTo)
            );

        return $this->applySorting($query, [
            'id',
            'name',
            'start_date',
            'end_date',
            'created_at',
            'updated_at',
        ]);
    }
}