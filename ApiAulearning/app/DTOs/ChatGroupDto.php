<?php

namespace App\DTOs;

use App\DTOs\Interfaces\IBaseDto;

class ChatGroupDto implements IBaseDto
{
    public function __construct(
        public ?int $id,
        public string $name,
        public ?string $description,
        public bool $active,
        public int $ownerId,
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'active' => $this->active,
            'owner_id' => $this->ownerId,
        ];
    }
}