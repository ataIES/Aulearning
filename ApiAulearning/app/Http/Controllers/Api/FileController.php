<?php

namespace App\Http\Controllers\Api;

use App\Filters\FileFilter;
use App\Http\Requests\File\StoreFileRequest;
use App\Services\Interfaces\IFileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class FileController extends BaseApiController
{
    public function __construct(
        private readonly IFileService $fileService
    ) {}

    #[OA\Get(
        path: '/files',
        summary: 'Listar archivos',
        security: [['sanctum' => []]],
        tags: ['Files']
    )]
    #[OA\Response(response: 200, description: 'Archivos obtenidos correctamente')]
    public function index(Request $request): JsonResponse
    {
        $filter = new FileFilter(
            taskId: $request->query('task_id')
                ? (int) $request->query('task_id')
                : null,
            courseId: $request->query('course_id')
                ? (int) $request->query('course_id')
                : null,
            search: $request->query('search'),
            perPage: (int) $request->query('per_page', 15),
            sortBy: $request->query('sort_by', 'id'),
            sortDirection: $request->query('sort_direction', 'desc'),
        );

        return $this->success(
            $this->paginated(
                $this->fileService->paginateFiles(
                    $filter,
                    ['task', 'task.course']
                )
            ),
            'Archivos obtenidos correctamente.'
        );
    }

    #[OA\Post(
        path: '/files',
        summary: 'Subir archivo',
        security: [['sanctum' => []]],
        tags: ['Files']
    )]
    #[OA\Response(response: 201, description: 'Archivo subido correctamente')]
    public function store(StoreFileRequest $request): JsonResponse
    {
        return $this->success(
            $this->fileService->uploadMaterial(
                $request->file('file'),
                (int) $request->validated('task_id')
            ),
            'Archivo subido correctamente.',
            201
        );
    }

    #[OA\Delete(
        path: '/files/{id}',
        summary: 'Eliminar archivo',
        security: [['sanctum' => []]],
        tags: ['Files']
    )]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Archivo eliminado correctamente')]
    public function destroy(int $id): JsonResponse
    {
        return $this->fileService->delete($id)
            ? $this->success(null, 'Archivo eliminado correctamente.')
            : $this->error('Archivo no encontrado.', 404);
    }
}