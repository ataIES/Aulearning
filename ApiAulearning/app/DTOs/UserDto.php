<?php

namespace App\DTOs;

use App\DTOs\Interfaces\IBaseDto;

class UserDto implements IBaseDto
{
    public function __construct(
        public ?int $id,
        public string $name,
        public string $lastName,
        public string $email,
        public string $type,
        public bool $active = true,
        public ?string $password = null,
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'last_name' => $this->lastName,
            'email' => $this->email,
            'type' => $this->type,
            'active' => $this->active,
            'password' => $this->password,
        ];
    }
}