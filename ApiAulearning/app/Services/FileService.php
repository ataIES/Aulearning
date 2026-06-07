<?php

namespace App\Services;

use App\DTOs\FileDto;
use App\Mappers\FileMapper;
use App\Repositories\Interfaces\IFileRepository;
use App\Services\Interfaces\IFileService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class FileService extends BaseService implements IFileService
{
    public function __construct(
        private readonly IFileRepository $fileRepository,
        FileMapper $mapper,
    ) {
        parent::__construct($fileRepository, $mapper);
    }

    public function upload(
        UploadedFile $uploadedFile,
        int $taskId,
        string $directory = 'tasks'
    ): FileDto {

        $path = $uploadedFile->store(
            $directory,
            'public'
        );

        $dto = new FileDto(
            id: null,
            name: $uploadedFile->getClientOriginalName(),
            path: $path,
            disk: 'public',
            mimeType: $uploadedFile->getMimeType(),
            size: $uploadedFile->getSize(),
            taskId: $taskId,
        );

        /** @var FileDto $file */
        $file = $this->create($dto);

        return $file;
    }

    public function delete(int $id): bool
    {
        $file = $this->fileRepository->find($id);

        if (!$file) {
            return false;
        }

        Storage::disk($file->disk)
            ->delete($file->path);

        return $this->fileRepository->delete($id);
    }

    public function getByTask(int $taskId): Collection
    {
        return $this->fileRepository
            ->getByTask($taskId)
            ->map(
                fn ($file) =>
                $this->mapper->toDto($file)
            );
    }
}