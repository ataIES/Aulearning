<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class UserFilter extends BaseFilter
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly ?string $searchBy = 'all',
        public readonly ?string $type = null,
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
            ->when($this->search, function ($query) {
                $search = "%{$this->search}%";

                if ($this->searchBy === 'name') {
                    $query->where(function ($query) use ($search) {
                        $query->where('name', 'like', $search)
                            ->orWhere('last_name', 'like', $search);
                    });
                } elseif ($this->searchBy === 'email') {
                    $query->where('email', 'like', $search);
                } else {
                    $query->where(function ($query) use ($search) {
                        $query->where('name', 'like', $search)
                            ->orWhere('last_name', 'like', $search)
                            ->orWhere('email', 'like', $search);
                    });
                }
            })
            ->when($this->type, fn ($query) =>
                $query->where('type', $this->type)
            )
            ->when(!is_null($this->active), fn ($query) =>
                $query->where('active', $this->active)
            );

        return $this->applySorting($query, [
            'id',
            'name',
            'last_name',
            'email',
            'type',
            'active',
            'created_at',
            'updated_at',
        ]);
    }
}