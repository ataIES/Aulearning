<?php

namespace App\Http\Controllers\Api;

use App\Filters\EnrollmentFilter;
use App\Http\Requests\Enrollment\StoreEnrollmentRequest;
use App\Models\Enrollment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;
use App\Services\Interfaces\INotificationService;

class EnrollmentController extends BaseApiController
{
    public function __construct(private readonly INotificationService $notificationService) {}
    
    #[OA\Get(
        path: '/enrollments',
        summary: 'Listar matrículas',
        description: 'Obtiene una lista paginada de matrículas. Permite filtrar por curso, alumno y búsqueda por datos del alumno.',
        security: [['sanctum' => []]],
        tags: ['Enrollments']
    )]
    #[OA\Parameter(
        name: 'course_id',
        description: 'ID del curso',
        in: 'query',
        required: false,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Parameter(
        name: 'student_id',
        description: 'ID del alumno',
        in: 'query',
        required: false,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Parameter(
        name: 'search',
        description: 'Buscar por nombre, apellidos o email del alumno',
        in: 'query',
        required: false,
        schema: new OA\Schema(type: 'string')
    )]
    #[OA\Parameter(
        name: 'per_page',
        description: 'Número de registros por página',
        in: 'query',
        required: false,
        schema: new OA\Schema(type: 'integer', default: 15)
    )]
    #[OA\Parameter(
        name: 'page',
        description: 'Número de página',
        in: 'query',
        required: false,
        schema: new OA\Schema(type: 'integer', default: 1)
    )]
    #[OA\Parameter(
        name: 'sortBy',
        description: 'Campo por el que ordenar',
        in: 'query',
        required: false,
        schema: new OA\Schema(type: 'string', default: 'id')
    )]
    #[OA\Parameter(
        name: 'sortDirection',
        description: 'Dirección de ordenación',
        in: 'query',
        required: false,
        schema: new OA\Schema(type: 'string', enum: ['asc', 'desc'], default: 'desc')
    )]
    #[OA\Response(
        response: 200,
        description: 'Matrículas obtenidas correctamente'
    )]
    #[OA\Response(response: 401, description: 'No autenticado')]
    #[OA\Response(response: 403, description: 'No autorizado')]
    public function index(Request $request): JsonResponse
    {
        $filter = new EnrollmentFilter(
            courseId: $request->query('course_id'),
            studentId: $request->query('student_id'),
            search: $request->query('search'),
            perPage: (int) $request->query('per_page', 15),
            sortBy: $request->query('sortBy', 'id'),
            sortDirection: $request->query('sortDirection', 'desc'),
        );

        $query = Enrollment::query()
            ->with([
                'student:id,name,last_name,email,type,active',
                'course:id,name',
            ]);

        $query = $filter->apply($query);

        return $this->success(
            $query->paginate($filter->perPage),
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
                new OA\Property(
                    property: 'student_id',
                    type: 'integer',
                    example: 12
                ),
                new OA\Property(
                    property: 'course_id',
                    type: 'integer',
                    example: 3
                ),
                new OA\Property(
                    property: 'enrollment_date',
                    type: 'string',
                    format: 'date-time',
                    nullable: true,
                    example: '2026-06-14 10:30:00'
                ),
                new OA\Property(
                    property: 'active',
                    type: 'boolean',
                    nullable: true,
                    example: true
                ),
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Alumno matriculado correctamente'
    )]
    #[OA\Response(response: 401, description: 'No autenticado')]
    #[OA\Response(response: 403, description: 'No autorizado')]
    #[OA\Response(response: 422, description: 'Error de validación')]
    public function store(StoreEnrollmentRequest $request): JsonResponse
    {
        $enrollment = Enrollment::query()->create([
            'student_id' => $request->integer('student_id'),
            'course_id' => $request->integer('course_id'),
            'enrollment_date' => $request->input('enrollment_date', now()),
            'active' => $request->boolean('active', true),
        ]);

        $enrollment->load([
            'student:id,name,last_name,email,type,active',
            'course:id,name',
        ]);

        $enrollment->load(['student', 'course.teacher']);

        $this->notificationService->createForUser(
            $enrollment->student,
            'Nueva matrícula',
            "Has sido matriculado en el curso {$enrollment->course->name}.",
            'enrollment_created'
        );

        if ($enrollment->course->teacher) {
            $this->notificationService->createForUser(
                $enrollment->course->teacher,
                'Nuevo alumno matriculado',
                "{$enrollment->student->name} {$enrollment->student->last_name} ha sido matriculado en {$enrollment->course->name}.",
                'enrollment_created'
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
    #[OA\Parameter(
        name: 'id',
        description: 'ID de la matrícula',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Response(
        response: 200,
        description: 'Matrícula eliminada correctamente'
    )]
    #[OA\Response(response: 401, description: 'No autenticado')]
    #[OA\Response(response: 403, description: 'No autorizado')]
    #[OA\Response(response: 404, description: 'Matrícula no encontrada')]
    public function destroy(int $id): JsonResponse
    {
        $enrollment = Enrollment::query()->find($id);

        if (!$enrollment) {
            return $this->error(
                'Matrícula no encontrada.',
                404
            );
        }

        $enrollment->delete();

        return $this->success(
            null,
            'Matrícula eliminada correctamente.'
        );
    }
}
