<?php

namespace App\Mappers\Interfaces;

use App\DTOs\Interfaces\IBaseDto;
use Illuminate\Database\Eloquent\Model;

interface IBaseMapper
{
    public function toDto(Model $model): IBaseDto;

    public function toArray(IBaseDto $dto): array;
}