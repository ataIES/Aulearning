<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class CourseFilter extends BaseFilter
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly ?int $teacherId = null,
        public readonly ?string $startDateFrom = null,
        public readonly ?string $startDateTo = null,
        public readonly ?string $endDateFrom = null,
        public readonly ?string $endDateTo = null,
        ?int $perPage = 15,
        ?string $sortBy = 'id',
        ?string $sortDirection = 'desc',
    ) {
        parent::__construct($perPage, $sortBy, $sortDirection);
    }

    public function apply(Builder $query): Builder
    {
        $query
            ->when($this->search, function (Builder $query) {
                $query->where(function (Builder $query) {
                    $query
                        ->where('name', 'like', "%{$this->search}%")
                        ->orWhere('description', 'like', "%{$this->search}%");
                });
            })
            ->when($this->teacherId, fn (Builder $query) =>
                $query->where('teacher_id', $this->teacherId)
            )
            ->when($this->startDateFrom, fn (Builder $query) =>
                $query->whereDate('start_date', '>=', $this->startDateFrom)
            )
            ->when($this->startDateTo, fn (Builder $query) =>
                $query->whereDate('start_date', '<=', $this->startDateTo)
            )
            ->when($this->endDateFrom, fn (Builder $query) =>
                $query->whereDate('end_date', '>=', $this->endDateFrom)
            )
            ->when($this->endDateTo, fn (Builder $query) =>
                $query->whereDate('end_date', '<=', $this->endDateTo)
            );

        return $this->applySorting(
            $query,
            ['id', 'name', 'start_date', 'end_date', 'teacher_id', 'created_at']
        );
    }
}