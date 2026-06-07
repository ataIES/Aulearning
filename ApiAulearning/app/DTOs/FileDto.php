<?php

namespace App\DTOs;

use App\DTOs\Interfaces\IBaseDto;

class FileDto implements IBaseDto
{
    public function __construct(
        public ?int $id,
        public string $name,
        public string $path,
        public string $disk,
        public ?string $mimeType,
        public ?int $size,
        public int $taskId,
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
        ];
    }
}