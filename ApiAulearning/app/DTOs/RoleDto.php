<?php

namespace App\DTOs;

use App\DTOs\Interfaces\IBaseDto;

class RoleDto implements IBaseDto
{
    public function __construct(
        public ?int $id,
        public string $name,
        public string $guardName = 'web',
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'guard_name' => $this->guardName,
        ];
    }
}