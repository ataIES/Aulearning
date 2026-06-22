<?php

namespace App\Mappers;

use App\DTOs\Interfaces\IBaseDto;
use App\DTOs\ParticipantDto;
use App\Models\Participant;
use App\Mappers\Interfaces\IBaseMapper;
use Illuminate\Database\Eloquent\Model;

class ParticipantMapper extends BaseMapper implements IBaseMapper
{
    public function toDto(Model $model): ParticipantDto
    {
        /** @var Participant $model */
        return new ParticipantDto(
            id: $model->id,
            chatGroupId: $model->chat_group_id,
            userId: $model->user_id,
            role: $model->role,
            joinedAt: $model->joined_at ? (string) $model->joined_at : null,
            active: (bool) $model->active,
        );
    }

    public function toArray(IBaseDto $dto): array
    {
        /** @var ParticipantDto $dto */
        return $this->removeNulls([
            'chat_group_id' => $dto->chatGroupId,
            'user_id' => $dto->userId,
            'role' => $dto->role,
            'joined_at' => $dto->joinedAt,
            'active' => $dto->active,
        ]);
    }
}