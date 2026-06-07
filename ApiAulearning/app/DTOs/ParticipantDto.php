<?php

namespace App\DTOs;

use App\DTOs\Interfaces\IBaseDto;

class ParticipantDto implements IBaseDto
{
    public function __construct(
        public ?int $id,
        public int $chatGroupId,
        public int $userId,
        public string $role = 'member',
        public ?string $joinedAt = null,
        public bool $active = true,
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'chat_group_id' => $this->chatGroupId,
            'user_id' => $this->userId,
            'role' => $this->role,
            'joined_at' => $this->joinedAt,
            'active' => $this->active,
        ];
    }
}