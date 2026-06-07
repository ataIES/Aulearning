<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

abstract class BaseFilter
{
    public function __construct(
        public readonly ?int $perPage = 15,
        public readonly ?string $sortBy = 'id',
        public readonly ?string $sortDirection = 'desc',
    ) {}

    abstract public function apply(Builder $query): Builder;

    protected function applySorting(
        Builder $query,
        array $allowedSorts = ['id', 'created_at']
    ): Builder {
        $sortBy = in_array($this->sortBy, $allowedSorts, true)
            ? $this->sortBy
            : 'id';

        $direction = strtolower($this->sortDirection ?? 'desc') === 'asc'
            ? 'asc'
            : 'desc';

        return $query->orderBy($sortBy, $direction);
    }
}