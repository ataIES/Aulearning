<?php

namespace App\Http\Controllers\Api;

use App\Filters\EnrollmentFilter;
use App\Http\Requests\Enrollment\StoreEnrollmentRequest;
use App\Models\Enrollment;
use App\Services\Interfaces\INotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class EnrollmentController extends BaseApiController
{
    public function __construct(
        private readonly INotificationService $notificationService
    ) {}

    #[OA\Get(
        path: '/enrollments',
        summary: 'Listar matrículas',
        description: 'Obtiene una lista paginada de matrículas. Permite filtrar por curso, alumno, profesor y búsqueda general.',
        security: [['sanctum' => []]],
        tags: ['Enrollments']
    )]
    #[OA\Parameter(name: 'course_id', in: 'query', required: false, schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'student_id', in: 'query', required: false, schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'teacher_id', in: 'query', required: false, schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'search', in: 'query', required: false, schema: new OA\Schema(type: 'string'))]
    #[OA\Parameter(name: 'per_page', in: 'query', required: false, schema: new OA\Schema(type: 'integer', default: 15))]
    #[OA\Parameter(name: 'page', in: 'query', required: false, schema: new OA\Schema(type: 'integer', default: 1))]
    #[OA\Response(response: 200, description: 'Matrículas obtenidas correctamente')]
    #[OA\Response(response: 401, description: 'No autenticado')]
    #[OA\Response(response: 403, description: 'No autorizado')]
    public function index(Request $request): JsonResponse
    {
        $filter = new EnrollmentFilter(
            courseId: $request->query('course_id')
                ? (int) $request->query('course_id')
                : null,
            studentId: $request->query('student_id')
                ? (int) $request->query('student_id')
                : null,
            teacherId: $request->query('teacher_id')
                ? (int) $request->query('teacher_id')
                : null,
            search: $request->query('search'),
            perPage: (int) $request->query('per_page', 15),
            sortBy: $request->query('sort_by', 'id'),
            sortDirection: $request->query('sort_direction', 'desc'),
        );

        $query = Enrollment::query()
            ->with([
                'student:id,name,last_name,email,type,active',
                'course:id,name,teacher_id',
                'course.teacher:id,name,last_name,email',
            ]);

        $query = $filter->apply($query);

        return $this->success(
            $this->paginated(
                $query->paginate($filter->perPage)
            ),
            'Matrículas obtenidas correctamente.'
        );
    }

    #[OA\Post(
        path: '/enrollments',
        summary: 'Crear matrícula',
        description: 'Matricula un alumno en un curso.',
        security: [['sanctum' => []]],
        tags: ['Enrollments']
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['student_id', 'course_id'],
            properties: [
                new OA\Property(property: 'student_id', type: 'integer', example: 12),
                new OA\Property(property: 'course_id', type: 'integer', example: 3),
            ]
        )
    )]
    #[OA\Response(response: 201, description: 'Alumno matriculado correctamente')]
    #[OA\Response(response: 422, description: 'Error de validación')]
    public function store(StoreEnrollmentRequest $request): JsonResponse
    {
        $enrollment = Enrollment::query()->create([
            'student_id' => $request->integer('student_id'),
            'course_id' => $request->integer('course_id'),
            'enrollment_date' => now(),
            'active' => true,
        ]);

        $enrollment->load([
            'student:id,name,last_name,email,type,active',
            'course:id,name,teacher_id',
            'course.teacher:id,name,last_name,email',
        ]);

        $this->notificationService->createForUser(
            $enrollment->student,
            'Nueva matrícula',
            "Has sido matriculado en el curso {$enrollment->course->name}.",
            'info'
        );

        if ($enrollment->course->teacher) {
            $this->notificationService->createForUser(
                $enrollment->course->teacher,
                'Nuevo alumno matriculado',
                "{$enrollment->student->name} {$enrollment->student->last_name} ha sido matriculado en {$enrollment->course->name}.",
                'info'
            );
        }

        return $this->success(
            $enrollment,
            'Alumno matriculado correctamente.',
            201
        );
    }

    #[OA\Delete(
        path: '/enrollments/{id}',
        summary: 'Eliminar matrícula',
        description: 'Elimina una matrícula existente.',
        security: [['sanctum' => []]],
        tags: ['Enrollments']
    )]
    #[OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Matrícula eliminada correctamente')]
    #[OA\Response(response: 404, description: 'Matrícula no encontrada')]
    public function destroy(int $id): JsonResponse
    {
        $enrollment = Enrollment::query()
            ->with([
                'student:id,name,last_name,email',
                'course:id,name,teacher_id',
                'course.teacher:id,name,last_name,email',
            ])
            ->find($id);

        if (!$enrollment) {
            return $this->error(
                'Matrícula no encontrada.',
                404
            );
        }

        $student = $enrollment->student;
        $course = $enrollment->course;

        $enrollment->delete();

        if ($student && $course) {
            $this->notificationService->createForUser(
                $student,
                'Matrícula eliminada',
                "Tu matrícula en el curso {$course->name} ha sido eliminada.",
                'warning'
            );
        }

        return $this->success(
            null,
            'Matrícula eliminada correctamente.'
        );
    }
}
