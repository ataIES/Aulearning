<?php

namespace App\Repositories;

use App\Models\ChatGroup;
use App\Repositories\Interfaces\IChatGroupRepository;
use Illuminate\Database\Eloquent\Collection;

class ChatGroupRepository extends BaseRepository implements IChatGroupRepository
{
    public function __construct(ChatGroup $model)
    {
        parent::__construct($model);
    }

    public function getByOwner(int $ownerId): Collection
    {
        return ChatGroup::query()
            ->where('owner_id', $ownerId)
            ->with(['owner', 'participants', 'messages'])
            ->get();
    }
}