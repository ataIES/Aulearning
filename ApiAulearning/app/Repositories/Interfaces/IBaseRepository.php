<?php

namespace App\Repositories\Interfaces;

use App\Filters\BaseFilter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface IBaseRepository
{
     public function all(array $relations = []): Collection;

    public function paginate(
        ?BaseFilter $filter = null,
        array $relations = []
    ): LengthAwarePaginator;

    public function find(int $id, array $relations = []): ?Model;

    public function create(array $data): Model;

    public function update(int $id, array $data): ?Model;

    public function delete(int $id): bool;
}