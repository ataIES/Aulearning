<?php

namespace App\Mappers;

use App\DTOs\Interfaces\IBaseDto;
use App\DTOs\UserDto;
use App\Mappers\Interfaces\IBaseMapper;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class UserMapper extends BaseMapper implements IBaseMapper
{
    public function toDto(Model $model): UserDto
    {
        /** @var User $model */
        return new UserDto(
            id: $model->id,
            name: $model->name,
            lastName: $model->last_name,
            email: $model->email,
            type: $model->type,
            active: (bool) $model->active,
            password: null,
        );
    }

    public function toArray(IBaseDto $dto): array
    {
        /** @var UserDto $dto */
        return $this->removeNulls([
            'name' => $dto->name,
            'last_name' => $dto->lastName,
            'email' => $dto->email,
            'password' => $dto->password,
            'type' => $dto->type,
            'active' => $dto->active,
        ]);
    }
}