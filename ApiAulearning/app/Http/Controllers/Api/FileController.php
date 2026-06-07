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

    #[OA\Parameter(name: 'search', in: 'query', schema: new OA\Schema(type: 'string'))]
    #[OA\Parameter(name: 'task_id', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'mime_type', in: 'query', schema: new OA\Schema(type: 'string'))]
    #[OA\Parameter(name: 'disk', in: 'query', schema: new OA\Schema(type: 'string'))]
    #[OA\Parameter(name: 'min_size', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'max_size', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(ref: '#/components/parameters/PerPage')]
    #[OA\Parameter(ref: '#/components/parameters/SortBy')]
    #[OA\Parameter(ref: '#/components/parameters/SortDirection')]
    #[OA\Get(
        path: '/files',
        summary: 'Listar archivos',
        security: [['sanctum' => []]],
        tags: ['Files']
    )]
    #[OA\Response(
        response: 200,
        description: 'Listado de archivos'
    )]
    public function index(Request $request): JsonResponse
    {
        $filter = new FileFilter(
            search: $request->query('search'),
            taskId: $request->query('task_id')
                ? (int) $request->query('task_id')
                : null,
            mimeType: $request->query('mime_type'),
            disk: $request->query('disk'),
            minSize: $request->query('min_size')
                ? (int) $request->query('min_size')
                : null,
            maxSize: $request->query('max_size')
                ? (int) $request->query('max_size')
                : null,
            perPage: (int) $request->query('per_page', 15),
            sortBy: $request->query('sort_by', 'id'),
            sortDirection: $request->query('sort_direction', 'desc'),
        );

        return $this->success(
            $this->paginated(
                $this->fileService->paginate($filter, ['task'])
            ),
            'Archivos obtenidos correctamente.'
        );
    }

    #[OA\Post(
        path: '/files',
        summary: 'Subir archivo',
        description: 'Sube un archivo y lo guarda en storage/app/public/tasks. Devuelve la ruta relativa y la URL pública.',
        security: [['sanctum' => []]],
        tags: ['Files']
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\MediaType(
            mediaType: 'multipart/form-data',
            schema: new OA\Schema(
                required: [
                    'file',
                    'task_id',
                ],
                properties: [
                    new OA\Property(
                        property: 'file',
                        description: 'Archivo a subir',
                        type: 'string',
                        format: 'binary'
                    ),
                    new OA\Property(
                        property: 'task_id',
                        description: 'ID de la tarea asociada',
                        type: 'integer',
                        example: 1
                    ),
                ]
            )
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Archivo subido correctamente',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(
                    property: 'success',
                    type: 'boolean',
                    example: true
                ),
                new OA\Property(
                    property: 'message',
                    type: 'string',
                    example: 'Archivo subido correctamente.'
                ),
                new OA\Property(
                    property: 'data',
                    properties: [
                        new OA\Property(
                            property: 'id',
                            type: 'integer',
                            example: 1
                        ),
                        new OA\Property(
                            property: 'name',
                            type: 'string',
                            example: 'tema1.pdf'
                        ),
                        new OA\Property(
                            property: 'path',
                            type: 'string',
                            example: 'tasks/abc123.pdf'
                        ),
                        new OA\Property(
                            property: 'disk',
                            type: 'string',
                            example: 'public'
                        ),
                        new OA\Property(
                            property: 'mime_type',
                            type: 'string',
                            example: 'application/pdf'
                        ),
                        new OA\Property(
                            property: 'size',
                            type: 'integer',
                            example: 152634
                        ),
                        new OA\Property(
                            property: 'task_id',
                            type: 'integer',
                            example: 1
                        ),
                        new OA\Property(
                            property: 'url',
                            type: 'string',
                            example: 'http://localhost:8000/storage/tasks/abc123.pdf'
                        ),
                    ],
                    type: 'object'
                ),
            ],
            type: 'object'
        )
    )]
    #[OA\Response(
        response: 422,
        description: 'Error de validación'
    )]
    #[OA\Response(
        response: 401,
        description: 'No autenticado'
    )]
    public function store(StoreFileRequest $request): JsonResponse
    {
        return $this->success(
            $this->fileService->upload(
                $request->file('file'),
                (int) $request->validated('task_id')
            ),
            'Archivo subido correctamente.',
            201
        );
    }

    #[OA\Get(
        path: '/files/{id}',
        summary: 'Ver archivo',
        security: [['sanctum' => []]],
        tags: ['Files']
    )]
    #[OA\Parameter(
        name: 'id',
        description: 'ID del archivo',
        in: 'path',
        required: true,
        schema: new OA\Schema(
            type: 'integer',
            example: 1
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Archivo encontrado'
    )]
    #[OA\Response(
        response: 404,
        description: 'Archivo no encontrado'
    )]
    public function show(int $id): JsonResponse
    {
        $file = $this->fileService->getById(
            $id,
            ['task']
        );

        return $file
            ? $this->success(
                $file,
                'Archivo obtenido correctamente.'
            )
            : $this->error(
                'Archivo no encontrado.',
                404
            );
    }

    #[OA\Delete(
        path: '/files/{id}',
        summary: 'Eliminar archivo',
        description: 'Elimina el archivo físico del storage y después elimina su registro en base de datos.',
        security: [['sanctum' => []]],
        tags: ['Files']
    )]
    #[OA\Parameter(
        name: 'id',
        description: 'ID del archivo',
        in: 'path',
        required: true,
        schema: new OA\Schema(
            type: 'integer',
            example: 1
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Archivo eliminado'
    )]
    #[OA\Response(
        response: 404,
        description: 'Archivo no encontrado'
    )]
    public function destroy(int $id): JsonResponse
    {
        return $this->fileService->delete($id)
            ? $this->success(
                null,
                'Archivo eliminado correctamente.'
            )
            : $this->error(
                'Archivo no encontrado.',
                404
            );
    }
}
