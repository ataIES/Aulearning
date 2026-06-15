<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class EnrollmentFilter extends BaseFilter
{
    public function __construct(
        public readonly ?int $courseId = null,
        public readonly ?int $studentId = null,
        public readonly ?string $search = null,
        ?int $perPage = 15,
        ?string $sortBy = 'id',
        ?string $sortDirection = 'desc',
    ) {
        parent::__construct($perPage, $sortBy, $sortDirection);
    }

    public function apply(Builder $query): Builder
    {
        $query
            ->when($this->courseId, fn (Builder $query) =>
                $query->where('course_id', $this->courseId)
            )
            ->when($this->studentId, fn (Builder $query) =>
                $query->where('student_id', $this->studentId)
            )
            ->when($this->search, function (Builder $query) {
                $query->whereHas('student', function (Builder $query) {
                    $query->where('name', 'like', "%{$this->search}%")
                        ->orWhere('last_name', 'like', "%{$this->search}%")
                        ->orWhere('email', 'like', "%{$this->search}%");
                });
            });

        return $this->applySorting(
            $query,
            ['id', 'enrollment_date', 'created_at']
        );
    }
}