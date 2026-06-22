<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class UserFilter extends BaseFilter
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly ?string $type = null,
        public readonly ?bool $active = null,
        ?int $perPage = 15,
        ?string $sortBy = 'name',
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
                        ->orWhere('last_name', 'like', "%{$this->search}%")
                        ->orWhere('email', 'like', "%{$this->search}%");
                });
            })
            ->when($this->type, fn (Builder $query) =>
                $query->where('type', $this->type)
            )
            ->when($this->active !== null, fn (Builder $query) =>
                $query->where('active', $this->active)
            );

        return $this->applySorting(
            $query,
            ['id', 'name', 'last_name', 'email', 'type', 'active', 'created_at']
        );
    }
}