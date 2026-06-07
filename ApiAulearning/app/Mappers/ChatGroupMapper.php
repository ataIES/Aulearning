<?php

namespace App\Mappers;

use App\DTOs\ChatGroupDto;
use App\DTOs\Interfaces\IBaseDto;
use App\Models\ChatGroup;
use App\Mappers\Interfaces\IBaseMapper;
use Illuminate\Database\Eloquent\Model;

class ChatGroupMapper extends BaseMapper implements IBaseMapper
{
    public function toDto(Model $model): ChatGroupDto
    {
        /** @var ChatGroup $model */
        return new ChatGroupDto(
            id: $model->id,
            name: $model->name,
            description: $model->description,
            active: (bool) $model->active,
            ownerId: $model->owner_id,
        );
    }

    public function toArray(IBaseDto $dto): array
    {
        /** @var ChatGroupDto $dto */
        return $this->removeNulls([
            'name' => $dto->name,
            'description' => $dto->description,
            'active' => $dto->active,
            'owner_id' => $dto->ownerId,
        ]);
    }
}