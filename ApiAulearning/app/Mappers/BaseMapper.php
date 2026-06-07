<?php

namespace App\Mappers;

use App\Mappers\Interfaces\IBaseMapper;

abstract class BaseMapper implements IBaseMapper
{
    protected function removeNulls(array $data): array
    {
        return array_filter(
            $data,
            fn ($value) => $value !== null
        );
    }
}