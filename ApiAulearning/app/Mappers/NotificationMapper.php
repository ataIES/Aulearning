<?php

namespace App\Mappers;

use App\DTOs\Interfaces\IBaseDto;
use App\DTOs\NotificationDto;
use App\Models\Notification;
use App\Mappers\Interfaces\IBaseMapper;
use Illuminate\Database\Eloquent\Model;

class NotificationMapper extends BaseMapper implements IBaseMapper
{
    public function toDto(Model $model): NotificationDto
    {
        /** @var Notification $model */
        return new NotificationDto(
            id: $model->id,
            title: $model->title,
            content: $model->content,
            userId: $model->user_id,
            type: $model->type,
            readAt: $model->read_at ? (string) $model->read_at : null,
        );
    }

    public function toArray(IBaseDto $dto): array
    {
        /** @var NotificationDto $dto */
        return $this->removeNulls([
            'title' => $dto->title,
            'content' => $dto->content,
            'user_id' => $dto->userId,
            'type' => $dto->type,
            'read_at' => $dto->readAt,
        ]);
    }
}