<?php

namespace App\Repositories;

use App\Models\Message;
use App\Repositories\Interfaces\IMessageRepository;
use Illuminate\Database\Eloquent\Collection;

class MessageRepository extends BaseRepository implements IMessageRepository
{
    public function __construct(Message $model)
    {
        parent::__construct($model);
    }

    public function getByGroup(int $chatGroupId): Collection
    {
        return Message::query()
            ->where('chat_group_id', $chatGroupId)
            ->with(['user'])
            ->latest()
            ->get();
    }
}