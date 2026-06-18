<?php

namespace App\Services;

use App\DTOs\FileDto;
use App\Filters\FileFilter;
use App\Mappers\Interfaces\IFileMapper;
use App\Repositories\Interfaces\IFileRepository;
use App\Services\Interfaces\IFileService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileService extends BaseService implements IFileService
{
    public function __construct(
        private readonly IFileRepository $fileRepository,
        IFileMapper $fileMapper,
    ) {
        parent::__construct(
            $fileRepository,
            $fileMapper
        );
    }

    public function paginateFiles(
        FileFilter $filter,
        array $relations = []
    ): LengthAwarePaginator {
        return $this->fileRepository->paginate(
            $filter,
            $relations
        );
    }

    public function uploadMaterial(
        UploadedFile $file,
        int $taskId
    ): FileDto {
        $path = $file->store(
            "uploads/course-materials/{$taskId}",
            'public'
        );

        $model = $this->fileRepository->create([
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'disk' => 'public',
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'task_id' => $taskId,
        ]);

        return $this->mapper->toDto($model);
    }

    public function delete(int $id): bool
    {
        $file = $this->fileRepository->find($id);

        if (!$file) {
            return false;
        }

        Storage::disk($file->disk)->delete($file->path);

        return $this->fileRepository->delete($id);
    }
}