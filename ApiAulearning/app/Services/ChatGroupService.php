<?php

namespace App\Services;

use App\Mappers\ChatGroupMapper;
use App\Repositories\Interfaces\IChatGroupRepository;
use App\Services\Interfaces\IChatGroupService;
use Illuminate\Support\Collection;

class ChatGroupService extends BaseService implements IChatGroupService
{
    public function __construct(
        private readonly IChatGroupRepository $chatGroupRepository,
        ChatGroupMapper $mapper,
    ) {
        parent::__construct($chatGroupRepository, $mapper);
    }

    public function getByOwner(int $ownerId): Collection
    {
        return $this->chatGroupRepository
            ->getByOwner($ownerId)
            ->map(fn ($group) => $this->mapper->toDto($group));
    }
}