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
        array $allowedSorts = []
    ): Builder {
        $sortBy = $this->sortBy ?: 'id';

        $direction = strtolower($this->sortDirection ?? 'desc');

        if (!in_array($direction, ['asc', 'desc'])) {
            $direction = 'desc';
        }

        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = in_array('created_at', $allowedSorts)
                ? 'created_at'
                : 'id';
        }

        if ($sortBy === 'due_date') {
            return $query
                ->orderByRaw('due_date IS NULL')
                ->orderBy('due_date', $direction);
        }

        if ($sortBy === 'grade') {
            return $query
                ->orderByRaw('grade IS NULL')
                ->orderBy('grade', $direction);
        }

        return $query->orderBy($sortBy, $direction);
    }
}