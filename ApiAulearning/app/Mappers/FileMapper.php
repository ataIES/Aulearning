<?php

namespace App\Mappers;

use App\DTOs\FileDto;
use App\DTOs\Interfaces\IBaseDto;
use App\Models\File;
use App\Mappers\Interfaces\IBaseMapper;
use Illuminate\Database\Eloquent\Model;

class FileMapper extends BaseMapper implements IBaseMapper
{
    public function toDto(Model $model): IBaseDto
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
        );
    }

    public function toArray(IBaseDto $dto): array
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