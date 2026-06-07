<?php

namespace App\Services;

use App\DTOs\Interfaces\IBaseDto;
use App\Filters\BaseFilter;
use App\Mappers\Interfaces\IBaseMapper;
use App\Repositories\Interfaces\IBaseRepository;
use App\Services\Interfaces\IBaseService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

abstract class BaseService implements IBaseService
{
    public function __construct(
        protected readonly IBaseRepository $repository,
        protected readonly IBaseMapper $mapper,
    ) {}

    public function getAll(
        array $relations = []
    ): Collection {
        return $this->repository
            ->all($relations)
            ->map(
                fn ($model) => $this->mapper->toDto($model)
            );
    }

    public function paginate(
        ?BaseFilter $filter = null,
        array $relations = []
    ): LengthAwarePaginator {
        return $this->repository->paginate(
            $filter,
            $relations
        );
    }

    public function getById(
        int $id,
        array $relations = []
    ): ?IBaseDto {
        $model = $this->repository->find(
            $id,
            $relations
        );

        return $model
            ? $this->mapper->toDto($model)
            : null;
    }

    public function create(
        IBaseDto $dto
    ): IBaseDto {
        $model = $this->repository->create(
            $this->mapper->toArray($dto)
        );

        return $this->mapper->toDto($model);
    }

    public function update(
        int $id,
        IBaseDto $dto
    ): ?IBaseDto {
        $model = $this->repository->update(
            $id,
            $this->mapper->toArray($dto)
        );

        return $model
            ? $this->mapper->toDto($model)
            : null;
    }

    public function delete(
        int $id
    ): bool {
        return $this->repository->delete($id);
    }
}