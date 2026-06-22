<?php

namespace App\DTOs;

use App\DTOs\Interfaces\IBaseDto;

class MessageDto implements IBaseDto
{
    public function __construct(
        public ?int $id,
        public string $content,
        public int $userId,
        public int $chatGroupId,
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'content' => $this->content,
            'user_id' => $this->userId,
            'chat_group_id' => $this->chatGroupId,
        ];
    }
}