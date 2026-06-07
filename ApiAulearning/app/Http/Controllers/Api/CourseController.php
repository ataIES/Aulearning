<?php

namespace App\Http\Controllers\Api;

use App\DTOs\CourseDto;
use App\Filters\CourseFilter;
use App\Http\Requests\Course\StoreCourseRequest;
use App\Http\Requests\Course\UpdateCourseRequest;
use App\Services\Interfaces\ICourseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class CourseController extends BaseApiController
{
    public function __construct(
        private readonly ICourseService $courseService
    ) {}

    #[OA\Parameter(
        name: 'search',
        in: 'query',
        schema: new OA\Schema(type: 'string')
    )]
    #[OA\Parameter(
        name: 'teacher_id',
        in: 'query',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Parameter(
        name: 'start_date_from',
        in: 'query',
        schema: new OA\Schema(type: 'string', format: 'date')
    )]
    #[OA\Parameter(
        name: 'start_date_to',
        in: 'query',
        schema: new OA\Schema(type: 'string', format: 'date')
    )]
    #[OA\Parameter(
        name: 'end_date_from',
        in: 'query',
        schema: new OA\Schema(type: 'string', format: 'date')
    )]
    #[OA\Parameter(
        name: 'end_date_to',
        in: 'query',
        schema: new OA\Schema(type: 'string', format: 'date')
    )]
    #[OA\Parameter(ref: '#/components/parameters/PerPage')]
    #[OA\Parameter(ref: '#/components/parameters/SortBy')]
    #[OA\Parameter(ref: '#/components/parameters/SortDirection')]
    #[OA\Get(path: '/courses', summary: 'Listar cursos', security: [['sanctum' => []]], tags: ['Courses'])]
    #[OA\Response(response: 200, description: 'Listado de cursos')]
    public function index(Request $request): JsonResponse
    {
        $filter = new CourseFilter(
            search: $request->query('search'),
            teacherId: $request->query('teacher_id')
                ? (int) $request->query('teacher_id')
                : null,
            startDateFrom: $request->query('start_date_from'),
            startDateTo: $request->query('start_date_to'),
            endDateFrom: $request->query('end_date_from'),
            endDateTo: $request->query('end_date_to'),
            perPage: (int) $request->query('per_page', 15),
            sortBy: $request->query('sort_by', 'id'),
            sortDirection: $request->query('sort_direction', 'desc'),
        );

        return $this->success(
            $this->paginated(
                $this->courseService->paginate($filter, ['teacher'])
            ),
            'Cursos obtenidos correctamente.'
        );
    }
    #[OA\Post(path: '/courses', summary: 'Crear curso', security: [['sanctum' => []]], tags: ['Courses'])]
    #[OA\Response(response: 201, description: 'Curso creado')]
    public function store(StoreCourseRequest $request): JsonResponse
    {
        $data = $request->validated();

        return $this->success(
            $this->courseService->create(new CourseDto(
                id: null,
                name: $data['name'],
                description: $data['description'] ?? null,
                startDate: $data['start_date'],
                endDate: $data['end_date'],
                teacherId: $data['teacher_id'],
            )),
            'Curso creado correctamente.',
            201
        );
    }

    #[OA\Get(path: '/courses/{id}', summary: 'Ver curso', security: [['sanctum' => []]], tags: ['Courses'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Curso encontrado')]
    public function show(int $id): JsonResponse
    {
        $course = $this->courseService->getById($id, ['teacher']);

        return $course
            ? $this->success($course)
            : $this->error('Curso no encontrado.', 404);
    }

    #[OA\Put(path: '/courses/{id}', summary: 'Actualizar curso', security: [['sanctum' => []]], tags: ['Courses'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Curso actualizado')]
    public function update(UpdateCourseRequest $request, int $id): JsonResponse
    {
        $current = $this->courseService->getById($id);

        if (!$current) {
            return $this->error('Curso no encontrado.', 404);
        }

        $data = array_merge($current->toArray(), $request->validated());

        return $this->success(
            $this->courseService->update($id, new CourseDto(
                id: $id,
                name: $data['name'],
                description: $data['description'] ?? null,
                startDate: $data['start_date'],
                endDate: $data['end_date'],
                teacherId: $data['teacher_id'],
            )),
            'Curso actualizado correctamente.'
        );
    }

    #[OA\Delete(path: '/courses/{id}', summary: 'Eliminar curso', security: [['sanctum' => []]], tags: ['Courses'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Curso eliminado')]
    public function destroy(int $id): JsonResponse
    {
        return $this->courseService->delete($id)
            ? $this->success(null, 'Curso eliminado correctamente.')
            : $this->error('Curso no encontrado.', 404);
    }
}
