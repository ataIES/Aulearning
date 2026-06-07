<?php

namespace App\Mappers;

use App\DTOs\Interfaces\IBaseDto;
use App\DTOs\RoleDto;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role;

class RoleMapper extends BaseMapper
{
    public function toDto(Model $model): IBaseDto
    {
        /** @var Role $model */

        return new RoleDto(
            id: $model->id,
            name: $model->name,
            guardName: $model->guard_name,
        );
    }

    public function toArray(IBaseDto $dto): array
    {
        /** @var RoleDto $dto */

        return $this->removeNulls([
            'name' => $dto->name,
            'guard_name' => $dto->guardName,
        ]);
    }
}