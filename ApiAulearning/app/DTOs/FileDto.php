<?php

namespace App\DTOs;

use App\DTOs\Interfaces\IBaseDto;

class FileDto implements IBaseDto
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $name,
        public readonly string $path,
        public readonly string $disk,
        public readonly ?string $mimeType,
        public readonly ?int $size,
        public readonly int $taskId,
        public readonly ?string $url = null,
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'path' => $this->path,
            'disk' => $this->disk,
            'mime_type' => $this->mimeType,
            'size' => $this->size,
            'task_id' => $this->taskId,
            'url' => $this->url,
        ];
    }
}