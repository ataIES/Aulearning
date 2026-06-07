<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class FileFilter extends BaseFilter
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly ?int $taskId = null,
        public readonly ?string $mimeType = null,
        public readonly ?string $disk = null,
        public readonly ?int $minSize = null,
        public readonly ?int $maxSize = null,
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
                        ->orWhere('path', 'like', "%{$this->search}%");
                });
            })
            ->when($this->taskId, fn (Builder $query) =>
                $query->where('task_id', $this->taskId)
            )
            ->when($this->mimeType, fn (Builder $query) =>
                $query->where('mime_type', 'like', "%{$this->mimeType}%")
            )
            ->when($this->disk, fn (Builder $query) =>
                $query->where('disk', $this->disk)
            )
            ->when($this->minSize !== null, fn (Builder $query) =>
                $query->where('size', '>=', $this->minSize)
            )
            ->when($this->maxSize !== null, fn (Builder $query) =>
                $query->where('size', '<=', $this->maxSize)
            );

        return $this->applySorting(
            $query,
            ['id', 'name', 'size', 'mime_type', 'disk', 'task_id', 'created_at']
        );
    }
}