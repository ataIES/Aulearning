<?php

namespace App\Docs;

use OpenApi\Attributes as OA;

#[OA\Parameter(
    parameter: 'PerPage',
    name: 'per_page',
    in: 'query',
    required: false,
    description: 'Número de elementos por página',
    schema: new OA\Schema(
        type: 'integer',
        default: 15,
        minimum: 1
    )
)]

#[OA\Parameter(
    parameter: 'SortBy',
    name: 'sort_by',
    in: 'query',
    required: false,
    description: 'Campo por el que ordenar',
    schema: new OA\Schema(
        type: 'string',
        default: 'id'
    )
)]

#[OA\Parameter(
    parameter: 'SortDirection',
    name: 'sort_direction',
    in: 'query',
    required: false,
    description: 'Dirección de ordenación',
    schema: new OA\Schema(
        type: 'string',
        enum: ['asc', 'desc'],
        default: 'desc'
    )
)]

class SwaggerParameters
{
}