<?php

namespace App\Services\Interfaces;

use App\DTOs\FileDto;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;

interface IFileService extends IBaseService
{
    public function upload(
        UploadedFile $uploadedFile,
        int $taskId,
        string $directory = 'tasks'
    ): FileDto;

    public function getByTask(
        int $taskId
    ): Collection;
}