<?php

namespace App\Http\Controllers\Api;

use App\DTOs\GradeDto;
use App\Filters\GradeFilter;
use App\Models\Grade;
use App\Services\Interfaces\IGradeService;
use App\Services\Interfaces\INotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class GradeController extends BaseApiController
{
    public function __construct(
        private readonly IGradeService $gradeService,
        private readonly INotificationService $notificationService
    ) {}

    #[OA\Parameter(name: 'student_id', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'course_id', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'min_grade', in: 'query', schema: new OA\Schema(type: 'number'))]
    #[OA\Parameter(name: 'max_grade', in: 'query', schema: new OA\Schema(type: 'number'))]
    #[OA\Parameter(ref: '#/components/parameters/PerPage')]
    #[OA\Parameter(ref: '#/components/parameters/SortBy')]
    #[OA\Parameter(ref: '#/components/parameters/SortDirection')]
    #[OA\Get(path: '/grades', summary: 'Listar calificaciones', security: [['sanctum' => []]], tags: ['Grades'])]
    #[OA\Response(response: 200, description: 'Listado de calificaciones')]
    public function index(Request $request): JsonResponse
    {
        $filter = new GradeFilter(
            studentId: $request->query('student_id')
                ? (int) $request->query('student_id')
                : null,
            courseId: $request->query('course_id')
                ? (int) $request->query('course_id')
                : null,
            minGrade: $request->query('min_grade') !== null
                ? (float) $request->query('min_grade')
                : null,
            maxGrade: $request->query('max_grade') !== null
                ? (float) $request->query('max_grade')
                : null,
            perPage: (int) $request->query('per_page', 15),
            sortBy: $request->query('sort_by', 'id'),
            sortDirection: $request->query('sort_direction', 'desc'),
        );

        return $this->success(
            $this->paginated(
                $this->gradeService->paginate($filter, ['student', 'course'])
            ),
            'Calificaciones obtenidas correctamente.'
        );
    }

    #[OA\Post(path: '/grades', summary: 'Crear calificación', security: [['sanctum' => []]], tags: ['Grades'])]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['grade', 'student_id', 'course_id'],
            properties: [
                new OA\Property(property: 'grade', type: 'number', format: 'float', example: 8.5),
                new OA\Property(property: 'student_id', type: 'integer', example: 3),
                new OA\Property(property: 'course_id', type: 'integer', example: 1),
            ]
        )
    )]
    #[OA\Response(response: 201, description: 'Calificación creada')]
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'grade' => ['required', 'numeric', 'min:0', 'max:10'],
            'student_id' => ['required', 'exists:users,id'],
            'course_id' => ['required', 'exists:courses,id'],
        ]);

        $grade = $this->gradeService->create(new GradeDto(
            id: null,
            grade: (float) $data['grade'],
            studentId: $data['student_id'],
            courseId: $data['course_id'],
        ));

        $gradeModel = Grade::query()
            ->with(['student', 'course'])
            ->find($grade->id);

        if ($gradeModel?->student && $gradeModel?->course) {
            $this->notificationService->createForUser(
                $gradeModel->student,
                'Nueva calificación',
                "Has recibido una calificación de {$gradeModel->grade}/10 en el curso \"{$gradeModel->course->name}\".",
                'grade'
            );
        }

        return $this->success(
            $grade,
            'Calificación creada correctamente.',
            201
        );
    }

    #[OA\Get(path: '/grades/{id}', summary: 'Ver calificación', security: [['sanctum' => []]], tags: ['Grades'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Calificación encontrada')]
    public function show(int $id): JsonResponse
    {
        $grade = $this->gradeService->getById($id, ['student', 'course']);

        return $grade
            ? $this->success($grade)
            : $this->error('Calificación no encontrada.', 404);
    }

    #[OA\Put(path: '/grades/{id}', summary: 'Actualizar calificación', security: [['sanctum' => []]], tags: ['Grades'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Calificación actualizada')]
    public function update(Request $request, int $id): JsonResponse
    {
        $current = $this->gradeService->getById($id);

        if (!$current) {
            return $this->error('Calificación no encontrada.', 404);
        }

        $oldGrade = Grade::query()
            ->with(['student', 'course'])
            ->find($id);

        $data = array_merge($current->toArray(), $request->validate([
            'grade' => ['sometimes', 'numeric', 'min:0', 'max:10'],
            'student_id' => ['sometimes', 'exists:users,id'],
            'course_id' => ['sometimes', 'exists:courses,id'],
        ]));

        $grade = $this->gradeService->update($id, new GradeDto(
            id: $id,
            grade: (float) $data['grade'],
            studentId: $data['student_id'],
            courseId: $data['course_id'],
        ));

        $gradeModel = Grade::query()
            ->with(['student', 'course'])
            ->find($id);

        if (
            $gradeModel?->student &&
            $gradeModel?->course &&
            (!$oldGrade || (float) $oldGrade->grade !== (float) $gradeModel->grade)
        ) {
            $this->notificationService->createForUser(
                $gradeModel->student,
                'Calificación actualizada',
                "Tu calificación del curso \"{$gradeModel->course->name}\" ha sido actualizada a {$gradeModel->grade}/10.",
                'grade'
            );
        }

        return $this->success(
            $grade,
            'Calificación actualizada correctamente.'
        );
    }

    #[OA\Delete(path: '/grades/{id}', summary: 'Eliminar calificación', security: [['sanctum' => []]], tags: ['Grades'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Calificación eliminada')]
    public function destroy(int $id): JsonResponse
    {
        $grade = Grade::query()
            ->with(['student', 'course'])
            ->find($id);

        $deleted = $this->gradeService->delete($id);

        if (!$deleted) {
            return $this->error('Calificación no encontrada.', 404);
        }

        if ($grade?->student && $grade?->course) {
            $this->notificationService->createForUser(
                $grade->student,
                'Calificación eliminada',
                "Se ha eliminado una calificación del curso \"{$grade->course->name}\".",
                'grade'
            );
        }

        return $this->success(
            null,
            'Calificación eliminada correctamente.'
        );
    }
}