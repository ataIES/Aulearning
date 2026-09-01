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
        ?string $sortBy = 'due_date',
        ?string $sortDirection = 'asc',
    ) {
        parent::__construct(
            $perPage,
            $sortBy,
            $sortDirection
        );
    }

    public function apply(Builder $query): Builder
    {
        $query
            ->when(
                $this->search,
                function (Builder $query) {
                    $query->where(function (Builder $query) {
                        $query
                            ->where(
                                'title',
                                'like',
                                "%{$this->search}%"
                            )
                            ->orWhere(
                                'description',
                                'like',
                                "%{$this->search}%"
                            );
                    });
                }
            )

            ->when(
                $this->studentId,
                function (Builder $query) {
                    $query->whereHas(
                        'course.enrollments',
                        function (Builder $query) {
                            $query
                                ->where(
                                    'student_id',
                                    $this->studentId
                                )
                                ->where(
                                    'active',
                                    true
                                );
                        }
                    );
                }
            )

            ->when(
                $this->courseId,
                fn (Builder $query) =>
                    $query->where(
                        'course_id',
                        $this->courseId
                    )
            )

            ->when(
                $this->type,
                fn (Builder $query) =>
                    $query->where(
                        'type',
                        $this->type
                    )
            )

            ->when(
                $this->status,
                fn (Builder $query) =>
                    $query->where(
                        'status',
                        $this->status
                    )
            )

            ->when(
                !is_null($this->gradable),
                fn (Builder $query) =>
                    $query->where(
                        'gradable',
                        $this->gradable
                    )
            )

            ->when(
                $this->dueDateFrom,
                fn (Builder $query) =>
                    $query->whereDate(
                        'due_date',
                        '>=',
                        $this->dueDateFrom
                    )
            )

            ->when(
                $this->dueDateTo,
                fn (Builder $query) =>
                    $query->whereDate(
                        'due_date',
                        '<=',
                        $this->dueDateTo
                    )
            );

        return $this->applySorting(
            $query,
            [
                'id',
                'title',
                'type',
                'status',
                'due_date',
                'created_at',
                'updated_at',
            ]
        );
    }
}