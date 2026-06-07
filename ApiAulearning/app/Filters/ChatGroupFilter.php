<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class ChatGroupFilter extends BaseFilter
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly ?int $ownerId = null,
        public readonly ?bool $active = null,
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
                        ->orWhere('description', 'like', "%{$this->search}%");
                });
            })
            ->when($this->ownerId, fn (Builder $query) =>
                $query->where('owner_id', $this->ownerId)
            )
            ->when($this->active !== null, fn (Builder $query) =>
                $query->where('active', $this->active)
            );

        return $this->applySorting(
            $query,
            ['id', 'name', 'owner_id', 'active', 'created_at']
        );
    }
}