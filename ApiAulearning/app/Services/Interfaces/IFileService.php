<?php

namespace App\Services\Interfaces;

use App\DTOs\FileDto;
use App\Filters\FileFilter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;

interface IFileService extends IBaseService
{
    public function paginateFiles(
        FileFilter $filter,
        array $relations = []
    ): LengthAwarePaginator;

    public function uploadMaterial(
        UploadedFile $file,
        int $taskId
    ): FileDto;
}