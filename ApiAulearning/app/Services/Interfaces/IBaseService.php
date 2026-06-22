<?php

namespace App\Services\Interfaces;

use App\DTOs\Interfaces\IBaseDto;
use App\Filters\BaseFilter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface IBaseService
{
    public function getAll(array $relations = []): Collection;

    public function paginate(
        ?BaseFilter $filter = null,
        array $relations = []
    ): LengthAwarePaginator;

    public function getById(
        int $id,
        array $relations = []
    ): ?IBaseDto;

    public function create(IBaseDto $dto): IBaseDto;

    public function update(
        int $id,
        IBaseDto $dto
    ): ?IBaseDto;

    public function delete(int $id): bool;
}