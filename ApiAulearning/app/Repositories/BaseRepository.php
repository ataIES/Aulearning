<?php

namespace App\Repositories;

use App\Filters\BaseFilter;
use App\Repositories\Interfaces\IBaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository implements IBaseRepository
{
    public function __construct(
        protected Model $model
    ) {}

     public function all(array $relations = []): Collection
    {
        return $this->model->newQuery()
            ->with($relations)
            ->get();
    }

    public function paginate(
        ?BaseFilter $filter = null,
        array $relations = []
    ): LengthAwarePaginator {
        $query = $this->model->newQuery()
            ->with($relations);

        if ($filter) {
            $query = $filter->apply($query);
        }

        return $query->paginate($filter?->perPage ?? 15);
    }

    public function find(int $id, array $relations = []): ?Model
    {
        return $this->model->newQuery()
            ->with($relations)
            ->find($id);
    }

    public function create(array $data): Model
    {
        return $this->model->newQuery()->create($data);
    }

    public function update(int $id, array $data): ?Model
    {
        $model = $this->find($id);

        if (!$model) {
            return null;
        }

        $model->update($data);

        return $model->fresh();
    }

    public function delete(int $id): bool
    {
        $model = $this->find($id);

        if (!$model) {
            return false;
        }

        return (bool) $model->delete();
    }
}