<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class RoleFilter extends BaseFilter
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly ?string $guardName = null,
        ?int $perPage = 15,
        ?string $sortBy = 'id',
        ?string $sortDirection = 'name',
    ) {
        parent::__construct($perPage, $sortBy, $sortDirection);
    }

    public function apply(Builder $query): Builder
    {
        $query
            ->when($this->search, fn (Builder $query) =>
                $query->where('name', 'like', "%{$this->search}%")
            )
            ->when($this->guardName, fn (Builder $query) =>
                $query->where('guard_name', $this->guardName)
            );

        return $this->applySorting(
            $query,
            ['id', 'name', 'guard_name', 'created_at']
        );
    }
}