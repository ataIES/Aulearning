<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class TaskFilter extends BaseFilter
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly ?int $courseId = null,
        public readonly ?int $studentId = null,
        public readonly ?string $type = null,
        public readonly ?string $status = null,
        public readonly ?bool $gradable = null,
        public readonly ?string $dueDateFrom = null,
        public readonly ?string $dueDateTo = null,
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
                        ->where('title', 'like', "%{$this->search}%")
                        ->orWhere('description', 'like', "%{$this->search}%")
                        ->orWhere('comment', 'like', "%{$this->search}%");
                });
            })
            ->when($this->courseId, fn (Builder $query) =>
                $query->where('course_id', $this->courseId)
            )
            ->when($this->studentId, fn (Builder $query) =>
                $query->where('student_id', $this->studentId)
            )
            ->when($this->type, fn (Builder $query) =>
                $query->where('type', $this->type)
            )
            ->when($this->status, fn (Builder $query) =>
                $query->where('status', $this->status)
            )
            ->when($this->gradable !== null, fn (Builder $query) =>
                $query->where('gradable', $this->gradable)
            )
            ->when($this->dueDateFrom, fn (Builder $query) =>
                $query->whereDate('due_date', '>=', $this->dueDateFrom)
            )
            ->when($this->dueDateTo, fn (Builder $query) =>
                $query->whereDate('due_date', '<=', $this->dueDateTo)
            );

        return $this->applySorting(
            $query,
            ['id', 'title', 'due_date', 'course_id', 'student_id', 'type', 'status', 'created_at']
        );
    }
}