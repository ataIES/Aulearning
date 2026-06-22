<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class DashBoardFilter extends BaseFilter
{
    public function __construct(
        public readonly ?string $createdFrom = null,
        public readonly ?string $createdTo = null,
        ?int $perPage = 15,
        ?string $sortBy = 'created_at',
        ?string $sortDirection = 'desc',
    ) {
        parent::__construct($perPage, $sortBy, $sortDirection);
    }

    public function apply(Builder $query): Builder
    {
        $query
            ->when($this->createdFrom, fn (Builder $query) =>
                $query->where('created_at', '>=', $this->createdFrom)
            )
            ->when($this->createdTo, fn (Builder $query) =>
                $query->where('created_at', '<=', $this->createdTo)
            );

        return $this->applySorting(
            $query,
            ['id', 'created_at', 'updated_at']
        );
    }
}