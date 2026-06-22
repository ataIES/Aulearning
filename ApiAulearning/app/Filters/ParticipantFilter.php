<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class ParticipantFilter extends BaseFilter
{
    public function __construct(
        public readonly ?int $chatGroupId = null,
        public readonly ?int $userId = null,
        public readonly ?string $role = null,
        public readonly ?bool $active = null,
        public readonly ?string $joinedFrom = null,
        public readonly ?string $joinedTo = null,
        ?int $perPage = 15,
        ?string $sortBy = 'id',
        ?string $sortDirection = 'desc',
    ) {
        parent::__construct($perPage, $sortBy, $sortDirection);
    }

    public function apply(Builder $query): Builder
    {
        $query
            ->when($this->chatGroupId, fn (Builder $query) =>
                $query->where('chat_group_id', $this->chatGroupId)
            )
            ->when($this->userId, fn (Builder $query) =>
                $query->where('user_id', $this->userId)
            )
            ->when($this->role, fn (Builder $query) =>
                $query->where('role', $this->role)
            )
            ->when($this->active !== null, fn (Builder $query) =>
                $query->where('active', $this->active)
            )
            ->when($this->joinedFrom, fn (Builder $query) =>
                $query->whereDate('joined_at', '>=', $this->joinedFrom)
            )
            ->when($this->joinedTo, fn (Builder $query) =>
                $query->whereDate('joined_at', '<=', $this->joinedTo)
            );

        return $this->applySorting(
            $query,
            ['id', 'chat_group_id', 'user_id', 'role', 'active', 'joined_at', 'created_at']
        );
    }
}