<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class MessageFilter extends BaseFilter
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly ?int $userId = null,
        public readonly ?int $chatGroupId = null,
        public readonly ?string $createdFrom = null,
        public readonly ?string $createdTo = null,
        ?int $perPage = 15,
        ?string $sortBy = 'id',
        ?string $sortDirection = 'desc',
    ) {
        parent::__construct($perPage, $sortBy, $sortDirection);
    }

    public function apply(Builder $query): Builder
    {
        $query
            ->when($this->search, fn (Builder $query) =>
                $query->where('content', 'like', "%{$this->search}%")
            )
            ->when($this->userId, fn (Builder $query) =>
                $query->where('user_id', $this->userId)
            )
            ->when($this->chatGroupId, fn (Builder $query) =>
                $query->where('chat_group_id', $this->chatGroupId)
            )
            ->when($this->createdFrom, fn (Builder $query) =>
                $query->whereDate('created_at', '>=', $this->createdFrom)
            )
            ->when($this->createdTo, fn (Builder $query) =>
                $query->whereDate('created_at', '<=', $this->createdTo)
            );

        return $this->applySorting(
            $query,
            ['id', 'user_id', 'chat_group_id', 'created_at']
        );
    }
}