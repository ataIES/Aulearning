<?php

namespace App\DTOs;

use App\DTOs\Interfaces\IBaseDto;

class NotificationDto implements IBaseDto
{
    public function __construct(
        public ?int $id,
        public string $title,
        public string $content,
        public int $userId,
        public string $type,
        public ?string $readAt = null,
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'user_id' => $this->userId,
            'type' => $this->type,
            'read_at' => $this->readAt,
        ];
    }
}