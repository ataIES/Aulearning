<?php

namespace App\Traits;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

trait PaginationResponse
{
    protected function paginated(
        LengthAwarePaginator $paginator,
        callable $mapper
    ): array {
        return [
            'items' => collect(
                $paginator->items()
            )->map($mapper),

            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ];
    }
}