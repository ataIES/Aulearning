<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class DeliveryTaskFilter extends BaseFilter
{
    public function __construct(
        public readonly ?int $courseId = null,
        public readonly ?int $taskId = null,
        public readonly ?int $studentId = null,
        public readonly ?int $teacherId = null,
        public readonly ?string $status = null,
        public readonly ?string $search = null,
        ?int $perPage = 15,
        ?string $sortBy = 'created_at',
        ?string $sortDirection = 'asc',
    ) {
        parent::__construct($perPage, $sortBy, $sortDirection);
    }

    public function apply(Builder $query): Builder
    {
        $query
            ->when($this->courseId, fn ($query) =>
                $query->whereHas('task', fn ($query) =>
                    $query->where('course_id', $this->courseId)
                )
            )
            ->when($this->teacherId, fn ($query) =>
                $query->whereHas('task.course', fn ($query) =>
                    $query->where('teacher_id', $this->teacherId)
                )
            )
            ->when($this->taskId, fn ($query) =>
                $query->where('task_id', $this->taskId)
            )
            ->when($this->studentId, fn ($query) =>
                $query->where('student_id', $this->studentId)
            )
            ->when($this->status === 'pending', fn ($query) =>
                $query->whereNull('grade')
            )
            ->when($this->status === 'graded', fn ($query) =>
                $query->whereNotNull('grade')
            )
            ->when($this->search, function ($query) {
                $query->where(function ($query) {
                    $query
                        ->whereHas('student', fn ($query) =>
                            $query->where('name', 'like', "%{$this->search}%")
                                ->orWhere('last_name', 'like', "%{$this->search}%")
                                ->orWhere('email', 'like', "%{$this->search}%")
                        )
                        ->orWhereHas('task', fn ($query) =>
                            $query->where('title', 'like', "%{$this->search}%")
                        );
                });
            });

        return $this->applySorting($query, [
            'id',
            'delivery_date',
            'updated_date',
            'grade',
            'created_at',
            'updated_at',
        ]);
    }
}