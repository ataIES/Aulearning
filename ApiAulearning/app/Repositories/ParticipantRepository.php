<?php

namespace App\Repositories;

use App\Models\Participant;
use App\Repositories\Interfaces\IParticipantRepository;
use Illuminate\Database\Eloquent\Collection;

class ParticipantRepository extends BaseRepository implements IParticipantRepository
{
    public function __construct(Participant $model)
    {
        parent::__construct($model);
    }

    public function getByGroup(int $chatGroupId): Collection
    {
        return Participant::query()
            ->where('chat_group_id', $chatGroupId)
            ->with(['user'])
            ->get();
    }

    public function getByUser(int $userId): Collection
    {
        return Participant::query()
            ->where('user_id', $userId)
            ->with(['group'])
            ->get();
    }

    public function isParticipant(int $chatGroupId, int $userId): bool
    {
        return Participant::query()
            ->where('chat_group_id', $chatGroupId)
            ->where('user_id', $userId)
            ->where('active', true)
            ->exists();
    }
}