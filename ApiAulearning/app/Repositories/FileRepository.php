<?php

namespace App\Repositories;

use App\Models\File;
use App\Repositories\Interfaces\IFileRepository;
use Illuminate\Database\Eloquent\Collection;

class FileRepository extends BaseRepository implements IFileRepository
{
    public function __construct(File $model)
    {
        parent::__construct($model);
    }

    public function getByTask(int $taskId): Collection
    {
        return File::query()
            ->where('task_id', $taskId)
            ->get();
    }
}