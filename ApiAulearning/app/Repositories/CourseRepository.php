<?php

namespace App\Repositories;

use App\Filters\BaseFilter;
use App\Models\Course;
use App\Repositories\Interfaces\ICourseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class CourseRepository extends BaseRepository implements ICourseRepository
{
    public function __construct(Course $model)
    {
        parent::__construct($model);
    }

    public function getByTeacher(int $teacherId): Collection
    {
        return Course::query()
            ->where('teacher_id', $teacherId)
            ->with(['teacher'])
            ->get();
    }

    public function paginate(
        ?BaseFilter $filter = null,
        array $relations = []
    ): LengthAwarePaginator {
        $query = $this->model
            ->newQuery()
            ->with(['teacher'])
            ->withCount(['enrollments', 'tasks']);

        if ($filter) {
            $query = $filter->apply($query);
        }

        return $query->paginate($filter?->perPage ?? 15);
    }

    public function getTeacherCourseDetail(
        int $courseId,
        int $teacherId
    ): mixed {
        return $this->model
            ->query()
            ->where('id', $courseId)
            ->where('teacher_id', $teacherId)
            ->with([
                'teacher:id,name,last_name,email',

                'enrollments' => fn($query) => $query
                    ->latest()
                    ->limit(8),

                'enrollments.student:id,name,last_name,email,type',

                'tasks' => fn($query) => $query
                    ->latest()
                    ->limit(8),
            ])
            ->withCount([
                'enrollments',
                'tasks',
            ])
            ->first();
    }
}
