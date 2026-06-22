<?php

namespace App\Mappers;

use App\DTOs\Interfaces\IBaseDto;
use App\DTOs\MessageDto;
use App\Models\Message;
use App\Mappers\Interfaces\IBaseMapper;
use Illuminate\Database\Eloquent\Model;

class MessageMapper extends BaseMapper implements IBaseMapper
{
    public function toDto(Model $model): MessageDto
    {
        /** @var Message $model */
        return new MessageDto(
            id: $model->id,
            content: $model->content,
            userId: $model->user_id,
            chatGroupId: $model->chat_group_id,
        );
    }

    public function toArray(IBaseDto $dto): array
    {
        /** @var MessageDto $dto */
        return $this->removeNulls([
            'content' => $dto->content,
            'user_id' => $dto->userId,
            'chat_group_id' => $dto->chatGroupId,
        ]);
    }
}