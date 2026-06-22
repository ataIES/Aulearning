<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class FileFilter extends BaseFilter
{
    public function __construct(
        public readonly ?int $taskId = null,
        public readonly ?int $courseId = null,
        public readonly ?string $search = null,
        ?int $perPage = 15,
        ?string $sortBy = 'created_at',
        ?string $sortDirection = 'desc',
    ) {
        parent::__construct($perPage, $sortBy, $sortDirection);
    }

    public function apply(Builder $query): Builder
    {
        $query
            ->when($this->taskId, fn ($query) =>
                $query->where('task_id', $this->taskId)
            )
            ->when($this->courseId, fn ($query) =>
                $query->whereHas('task', fn ($query) =>
                    $query->where('course_id', $this->courseId)
                )
            )
            ->when($this->search, fn ($query) =>
                $query->where('name', 'like', "%{$this->search}%")
            );

        return $this->applySorting($query, [
            'id',
            'name',
            'size',
            'created_at',
            'updated_at',
        ]);
    }
}