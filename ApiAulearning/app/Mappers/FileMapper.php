<?php

namespace App\Mappers;

use App\DTOs\FileDto;
use App\Mappers\Interfaces\IFileMapper;
use App\Models\File;
class FileMapper extends BaseMapper implements IFileMapper
{
    public function toDto(mixed $model): FileDto
    {
        /** @var File $model */

        return new FileDto(
            id: $model->id,
            name: $model->name,
            path: $model->path,
            disk: $model->disk,
            mimeType: $model->mime_type,
            size: $model->size,
            taskId: $model->task_id,
            url: $model->url ?? null,
        );
    }

    public function toArray(mixed $dto): array
    {
        /** @var FileDto $dto */

        return $this->removeNulls([
            'name' => $dto->name,
            'path' => $dto->path,
            'disk' => $dto->disk,
            'mime_type' => $dto->mimeType,
            'size' => $dto->size,
            'task_id' => $dto->taskId,
        ]);
    }
}