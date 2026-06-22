<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;

class NotificationFilter extends BaseFilter
{
    public function __construct(
        public readonly ?string $search = null,
        public readonly ?int $userId = null,
        public readonly ?string $type = null,
        public readonly ?bool $read = null,
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
            ->when($this->search, function (Builder $query) {
                $query->where(function (Builder $query) {
                    $query
                        ->where('title', 'like', "%{$this->search}%")
                        ->orWhere('content', 'like', "%{$this->search}%");
                });
            })
            ->when($this->userId, fn (Builder $query) =>
                $query->where('user_id', $this->userId)
            )
            ->when($this->type, fn (Builder $query) =>
                $query->where('type', $this->type)
            )
            ->when($this->read !== null, function (Builder $query) {
                $this->read
                    ? $query->whereNotNull('read_at')
                    : $query->whereNull('read_at');
            })
            ->when($this->createdFrom, fn (Builder $query) =>
                $query->whereDate('created_at', '>=', $this->createdFrom)
            )
            ->when($this->createdTo, fn (Builder $query) =>
                $query->whereDate('created_at', '<=', $this->createdTo)
            );

        return $this->applySorting(
            $query,
            ['id', 'title', 'type', 'user_id', 'read_at', 'created_at']
        );
    }
}