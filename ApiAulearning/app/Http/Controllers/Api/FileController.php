<?php

namespace App\Http\Controllers\Api;

use App\Filters\FileFilter;
use App\Http\Requests\File\StoreFileRequest;
use App\Models\File;
use App\Models\User;
use App\Services\Interfaces\IFileService;
use App\Services\Interfaces\INotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class FileController extends BaseApiController
{
    public function __construct(
        private readonly IFileService $fileService,
        private readonly INotificationService $notificationService
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
        $file = $this->fileService->uploadMaterial(
            $request->file('file'),
            (int) $request->validated('task_id')
        );

        $fileModel = File::query()
            ->with(['task', 'task.course'])
            ->find($file->id);

        if ($fileModel?->task?->course) {
            $this->notifyCourseStudents(
                courseId: $fileModel->task->course->id,
                title: 'Nuevo material disponible',
                content: "Se ha añadido el archivo \"{$fileModel->name}\" a la tarea \"{$fileModel->task->title}\" del curso \"{$fileModel->task->course->name}\".",
                type: 'file'
            );
        }

        return $this->success(
            $file,
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
        $file = File::query()
            ->with(['task', 'task.course'])
            ->find($id);

        $deleted = $this->fileService->delete($id);

        if (!$deleted) {
            return $this->error('Archivo no encontrado.', 404);
        }

        if ($file?->task?->course) {
            $this->notifyCourseStudents(
                courseId: $file->task->course->id,
                title: 'Material eliminado',
                content: "Se ha eliminado el archivo \"{$file->name}\" de la tarea \"{$file->task->title}\" del curso \"{$file->task->course->name}\".",
                type: 'file'
            );
        }

        return $this->success(
            null,
            'Archivo eliminado correctamente.'
        );
    }

    private function notifyCourseStudents(
        int $courseId,
        string $title,
        string $content,
        string $type = 'file'
    ): void {
        $students = User::query()
            ->whereHas('enrollments', function ($query) use ($courseId) {
                $query->where('course_id', $courseId);
            })
            ->get();

        foreach ($students as $student) {
            $this->notificationService->createForUser(
                $student,
                $title,
                $content,
                $type
            );
        }
    }
}