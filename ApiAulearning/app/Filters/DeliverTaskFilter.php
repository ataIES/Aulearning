<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class DeliverTaskFilter extends BaseFilter
{
    public function __construct(
        public readonly ?int $courseId = null,
        public readonly ?int $taskId = null,
        public readonly ?int $studentId = null,
        public readonly ?int $teacherId = null,
        public readonly ?string $status = null,
        public readonly ?string $search = null,
        ?int $perPage = 15,
        ?string $sortBy = 'delivery_date',
        ?string $sortDirection = 'desc',
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

        if (!$this->status) {
            return $query
                ->orderByRaw('CASE WHEN grade IS NULL THEN 0 ELSE 1 END')
                ->orderByDesc('delivery_date')
                ->orderByDesc('created_at');
        }

        return $query
            ->orderByDesc('delivery_date')
            ->orderByDesc('created_at');
    }
}