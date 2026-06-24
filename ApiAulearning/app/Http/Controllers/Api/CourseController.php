<?php

namespace App\Http\Controllers\Api;

use App\DTOs\CourseDto;
use App\Filters\CourseFilter;
use App\Http\Requests\Course\StoreCourseRequest;
use App\Http\Requests\Course\UpdateCourseRequest;
use App\Models\Course;
use App\Services\Interfaces\ICourseService;
use App\Services\Interfaces\INotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;
use App\Models\DeliveryTask;

class CourseController extends BaseApiController
{
    public function __construct(
        private readonly ICourseService $courseService,
        private readonly INotificationService $notificationService
    ) {}

    #[OA\Parameter(name: 'search', in: 'query', schema: new OA\Schema(type: 'string'))]
    #[OA\Parameter(name: 'teacher_id', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'student_id', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'start_date_from', in: 'query', schema: new OA\Schema(type: 'string', format: 'date'))]
    #[OA\Parameter(name: 'start_date_to', in: 'query', schema: new OA\Schema(type: 'string', format: 'date'))]
    #[OA\Parameter(name: 'end_date_from', in: 'query', schema: new OA\Schema(type: 'string', format: 'date'))]
    #[OA\Parameter(name: 'end_date_to', in: 'query', schema: new OA\Schema(type: 'string', format: 'date'))]
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
            studentId: $request->query('student_id')
                ? (int) $request->query('student_id')
                : null,
            startDateFrom: $request->query('start_date_from'),
            startDateTo: $request->query('start_date_to'),
            endDateFrom: $request->query('end_date_from'),
            endDateTo: $request->query('end_date_to'),
            perPage: (int) $request->query('per_page', 15),
            sortBy: $request->query('sort_by', 'id'),
            sortDirection: $request->query('sort_direction', 'desc'),
        );

        if ($request->query('student_id')) {
            $studentId = (int) $request->query('student_id');

            $courses = Course::query()
                ->with(['teacher:id,name,last_name,email'])
                ->withCount([
                    'tasks',
                    'tasks as pending_tasks_count' => function ($query) use ($studentId) {
                        $query
                            ->where('type', '!=', 'APUNTES')
                            ->whereDoesntHave('deliveries', function ($query) use ($studentId) {
                                $query->where('student_id', $studentId);
                            });
                    },
                ])
                ->whereHas('enrollments', function ($query) use ($studentId) {
                    $query->where('student_id', $studentId);
                })
                ->orderBy('name')
                ->paginate((int) $request->query('per_page', 15));

            return $this->success(
                $this->paginated($courses),
                'Cursos obtenidos correctamente.'
            );
        }

        return $this->success(
            $this->paginated(
                $this->courseService->paginate($filter, ['teacher', 'tasks'])
            ),
            'Cursos obtenidos correctamente.'
        );
    }

    #[OA\Post(path: '/courses', summary: 'Crear curso', security: [['sanctum' => []]], tags: ['Courses'])]
    #[OA\Response(response: 201, description: 'Curso creado')]
    public function store(StoreCourseRequest $request): JsonResponse
    {
        $data = $request->validated();

        $course = $this->courseService->create(new CourseDto(
            id: null,
            name: $data['name'],
            description: $data['description'] ?? null,
            startDate: $data['start_date'],
            endDate: $data['end_date'],
            teacherId: $data['teacher_id'] ?? null,
        ));

        $courseModel = Course::query()
            ->with('teacher')
            ->find($course->id);

        $this->notificationService->createGlobal(
            'Nuevo curso creado',
            "Se ha creado el curso \"{$course->name}\".",
            'course'
        );

        if ($courseModel?->teacher) {
            $this->notificationService->createForUser(
                $courseModel->teacher,
                'Nuevo curso asignado',
                "Se te ha asignado el curso \"{$courseModel->name}\".",
                'course'
            );
        }

        return $this->success(
            $course,
            'Curso creado correctamente.',
            201
        );
    }

    #[OA\Get(
        path: '/courses/{id}',
        summary: 'Obtener curso',
        description: 'Obtiene el detalle de un curso con profesor, últimos alumnos matriculados, últimas tareas y contadores.',
        security: [['sanctum' => []]],
        tags: ['Courses']
    )]
    #[OA\Parameter(name: 'id', description: 'ID del curso', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Curso obtenido correctamente')]
    #[OA\Response(response: 401, description: 'No autenticado')]
    #[OA\Response(response: 403, description: 'No autorizado')]
    #[OA\Response(response: 404, description: 'Curso no encontrado')]
    public function show(int $id): JsonResponse
    {
        $course = Course::query()
            ->with([
                'teacher:id,name,last_name,email',
                'tasks' => fn($query) => $query
                    ->select('id', 'course_id', 'title', 'type', 'due_date', 'created_at')
                    ->latest()
                    ->limit(5),

                'enrollments' => fn($query) => $query
                    ->select('id', 'course_id', 'student_id', 'enrollment_date')
                    ->latest()
                    ->limit(5),

                'enrollments.student:id,name,last_name,email,type,active',
            ])
            ->withCount([
                'tasks',
                'enrollments',
            ])
            ->find($id);

        if (!$course) {
            return $this->error(
                'Curso no encontrado.',
                404
            );
        }

        return $this->success(
            $course,
            'Curso obtenido correctamente.'
        );
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

        $oldCourse = Course::query()
            ->with('teacher')
            ->find($id);

        $data = array_merge($current->toArray(), $request->validated());

        $updatedCourse = $this->courseService->update($id, new CourseDto(
            id: $id,
            name: $data['name'],
            description: $data['description'] ?? null,
            startDate: $data['start_date'],
            endDate: $data['end_date'],
            teacherId: $data['teacher_id'],
        ));

        $newCourse = Course::query()
            ->with('teacher')
            ->find($id);

        if ($updatedCourse && $newCourse) {
            $this->notificationService->createGlobal(
                'Curso actualizado',
                "Se ha actualizado el curso \"{$newCourse->name}\".",
                'course'
            );

            if (
                $oldCourse &&
                $newCourse->teacher_id &&
                (int) $oldCourse->teacher_id !== (int) $newCourse->teacher_id
            ) {
                if ($oldCourse->teacher) {
                    $this->notificationService->createForUser(
                        $oldCourse->teacher,
                        'Curso reasignado',
                        "Ya no eres responsable del curso \"{$newCourse->name}\".",
                        'course'
                    );
                }

                if ($newCourse->teacher) {
                    $this->notificationService->createForUser(
                        $newCourse->teacher,
                        'Nuevo curso asignado',
                        "Se te ha asignado el curso \"{$newCourse->name}\".",
                        'course'
                    );
                }
            } elseif ($newCourse->teacher) {
                $this->notificationService->createForUser(
                    $newCourse->teacher,
                    'Curso actualizado',
                    "Se ha actualizado la información del curso \"{$newCourse->name}\".",
                    'course'
                );
            }
        }

        return $this->success(
            $updatedCourse,
            'Curso actualizado correctamente.'
        );
    }

    #[OA\Delete(path: '/courses/{id}', summary: 'Eliminar curso', security: [['sanctum' => []]], tags: ['Courses'])]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Curso eliminado')]
    public function destroy(int $id): JsonResponse
    {
        $course = Course::query()
            ->with('teacher')
            ->find($id);

        $deleted = $this->courseService->delete($id);

        if (!$deleted) {
            return $this->error('Curso no encontrado.', 404);
        }

        if ($course) {
            $this->notificationService->createGlobal(
                'Curso eliminado',
                "Se ha eliminado el curso \"{$course->name}\".",
                'course'
            );

            if ($course->teacher) {
                $this->notificationService->createForUser(
                    $course->teacher,
                    'Curso eliminado',
                    "El curso \"{$course->name}\" ha sido eliminado.",
                    'course'
                );
            }
        }

        return $this->success(
            null,
            'Curso eliminado correctamente.'
        );
    }

    #[OA\Get(
        path: '/teacher/courses/{id}',
        summary: 'Detalle de curso del profesor',
        description: 'Obtiene el detalle de un curso asignado al profesor autenticado.',
        security: [['sanctum' => []]],
        tags: ['Courses']
    )]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Curso obtenido correctamente')]
    #[OA\Response(response: 401, description: 'No autenticado')]
    #[OA\Response(response: 403, description: 'No autorizado')]
    #[OA\Response(response: 404, description: 'Curso no encontrado')]
    public function teacherCourseDetail(Request $request, int $id): JsonResponse
    {
        $course = $this->courseService->getTeacherCourseDetail(
            $id,
            $request->user()->id
        );

        if (!$course) {
            return $this->error(
                'Curso no encontrado o no asignado a este profesor.',
                404
            );
        }

        return $this->success(
            $course,
            'Curso obtenido correctamente.'
        );
    }
}
