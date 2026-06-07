<?php

namespace App\Http\Controllers\Api;

use App\DTOs\EnrollmentDto;
use App\Filters\EnrollmentFilter;
use App\Services\Interfaces\IEnrollmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class EnrollmentController extends BaseApiController
{
    public function __construct(
        private readonly IEnrollmentService $enrollmentService
    ) {}

    #[OA\Parameter(
        name: 'student_id',
        in: 'query',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Parameter(
        name: 'course_id',
        in: 'query',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Parameter(
        name: 'active',
        in: 'query',
        schema: new OA\Schema(type: 'boolean')
    )]
    #[OA\Parameter(
        name: 'enrollment_date_from',
        in: 'query',
        schema: new OA\Schema(type: 'string', format: 'date')
    )]
    #[OA\Parameter(
        name: 'enrollment_date_to',
        in: 'query',
        schema: new OA\Schema(type: 'string', format: 'date')
    )]
    #[OA\Parameter(ref: '#/components/parameters/PerPage')]
    #[OA\Parameter(ref: '#/components/parameters/SortBy')]
    #[OA\Parameter(ref: '#/components/parameters/SortDirection')]
    #[OA\Get(path: '/enrollments', summary: 'Listar inscripciones', security: [['sanctum' => []]], tags: ['Enrollments'])]
    #[OA\Response(response: 200, description: 'Listado de inscripciones')]
    public function index(Request $request): JsonResponse
    {
        $filter = new EnrollmentFilter(
            studentId: $request->query('student_id')
                ? (int) $request->query('student_id')
                : null,
            courseId: $request->query('course_id')
                ? (int) $request->query('course_id')
                : null,
            active: $request->has('active')
                ? $request->boolean('active')
                : null,
            enrollmentDateFrom: $request->query('enrollment_date_from'),
            enrollmentDateTo: $request->query('enrollment_date_to'),
            perPage: (int) $request->query('per_page', 15),
            sortBy: $request->query('sort_by', 'id'),
            sortDirection: $request->query('sort_direction', 'desc'),
        );

        return $this->success(
            $this->paginated(
                $this->enrollmentService->paginate($filter, ['student', 'course'])
            ),
            'Inscripciones obtenidas correctamente.'
        );
    }

    #[OA\Post(path: '/enrollments', summary: 'Crear inscripción', security: [['sanctum' => []]], tags: ['Enrollments'])]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['student_id', 'course_id'],
            properties: [
                new OA\Property(property: 'student_id', type: 'integer', example: 3),
                new OA\Property(property: 'course_id', type: 'integer', example: 1),
            ]
        )
    )]
    #[OA\Response(response: 201, description: 'Inscripción creada')]
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'student_id' => ['required', 'exists:users,id'],
            'course_id' => ['required', 'exists:courses,id'],
        ]);

        return $this->success(
            $this->enrollmentService->enroll(new EnrollmentDto(
                id: null,
                studentId: $data['student_id'],
                courseId: $data['course_id'],
                enrollmentDate: now()->toDateTimeString(),
                active: true,
            )),
            'Inscripción creada correctamente.',
            201
        );
    }

    #[OA\Get(path: '/enrollments/{id}', summary: 'Ver inscripción', security: [['sanctum' => []]], tags: ['Enrollments'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Inscripción encontrada')]
    public function show(int $id): JsonResponse
    {
        $enrollment = $this->enrollmentService->getById($id, ['student', 'course']);

        return $enrollment
            ? $this->success($enrollment)
            : $this->error('Inscripción no encontrada.', 404);
    }

    #[OA\Delete(path: '/enrollments/{id}', summary: 'Eliminar inscripción', security: [['sanctum' => []]], tags: ['Enrollments'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Inscripción eliminada')]
    public function destroy(int $id): JsonResponse
    {
        return $this->enrollmentService->delete($id)
            ? $this->success(null, 'Inscripción eliminada correctamente.')
            : $this->error('Inscripción no encontrada.', 404);
    }
}
