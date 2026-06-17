<?php

namespace App\Services;

use App\Filters\DashboardFilter;
use App\Repositories\Interfaces\IChatGroupRepository;
use App\Repositories\Interfaces\ICourseRepository;
use App\Repositories\Interfaces\IFileRepository;
use App\Repositories\Interfaces\IGradeRepository;
use App\Repositories\Interfaces\IMessageRepository;
use App\Repositories\Interfaces\INotificationRepository;
use App\Repositories\Interfaces\ITaskRepository;
use App\Repositories\Interfaces\IUserRepository;
use App\Services\Interfaces\IDashboardService;
use Illuminate\Support\Facades\Cache;
use App\Models\Course;
use App\Models\DeliveryTask;
use App\Models\Task;
use App\Models\User;
use App\Models\Enrollment;
use App\Models\File;

class DashBoardService implements IDashBoardService
{
    private const CACHE_KEY = 'dashboard_admin_last_3_days';
    private const CACHE_TTL_SECONDS = 300;

    public function __construct(
        private readonly IUserRepository $userRepository,
        private readonly ICourseRepository $courseRepository,
        private readonly ITaskRepository $taskRepository,
        private readonly IFileRepository $fileRepository,
        private readonly IGradeRepository $gradeRepository,
        private readonly INotificationRepository $notificationRepository,
        private readonly IChatGroupRepository $chatGroupRepository,
        private readonly IMessageRepository $messageRepository,
    ) {}

    public function getAdminDashboard(): array
    {
        return Cache::remember(
            self::CACHE_KEY,
            self::CACHE_TTL_SECONDS,
            fn() => $this->buildAdminDashboard()
        );
    }

    public function teacherDashboard(int $teacherId): array
    {
        $courseIds = Course::query()
            ->where('teacher_id', $teacherId)
            ->pluck('id');

        $courses = Course::query()
            ->where('teacher_id', $teacherId)
            ->withCount([
                'enrollments',
                'tasks',
            ])
            ->latest()
            ->limit(4)
            ->get();

        $tasksCount = Task::query()
            ->whereIn('course_id', $courseIds)
            ->count();

        $studentsCount = Enrollment::query()
            ->whereIn('course_id', $courseIds)
            ->distinct('student_id')
            ->count('student_id');

        $pendingDeliveries = DeliveryTask::query()
            ->whereHas('task', function ($query) use ($courseIds) {
                $query->whereIn('course_id', $courseIds);
            })
            ->whereNull('grade')
            ->count();

        $latestDeliveries = DeliveryTask::query()
            ->with([
                'student:id,name,last_name,email',
                'task:id,title,course_id',
                'task.course:id,name',
            ])
            ->whereHas('task', function ($query) use ($courseIds) {
                $query->whereIn('course_id', $courseIds);
            })
            ->latest()
            ->limit(5)
            ->get();

        $upcomingTasks = Task::query()
            ->with('course:id,name')
            ->whereIn('course_id', $courseIds)
            ->whereNotNull('due_date')
            ->whereDate('due_date', '>=', now())
            ->orderBy('due_date')
            ->limit(5)
            ->get();

        return [
            'summary' => [
                'courses' => $courseIds->count(),
                'students' => $studentsCount,
                'tasks' => $tasksCount,
                'pending_deliveries' => $pendingDeliveries,
            ],
            'courses' => $courses,
            'latest_deliveries' => $latestDeliveries,
            'upcoming_tasks' => $upcomingTasks,
        ];
    }

    private function buildAdminDashboard(): array
    {
        $from = now()
            ->subDays(3)
            ->startOfDay()
            ->toDateTimeString();

        $to = now()
            ->endOfDay()
            ->toDateTimeString();

        $filter = new DashboardFilter(
            createdFrom: $from,
            createdTo: $to
        );

        return [
            'period' => [
                'from' => $from,
                'to' => $to,
            ],

            'summary' => [
                'users' => $this->userRepository->count($filter),
                'courses' => $this->courseRepository->count($filter),
                'tasks' => $this->taskRepository->count($filter),
                'files' => $this->fileRepository->count($filter),
                'grades' => $this->gradeRepository->count($filter),
                'notifications' => $this->notificationRepository->count($filter),
                'chat_groups' => $this->chatGroupRepository->count($filter),
                'messages' => $this->messageRepository->count($filter),
            ],

            'latest' => [
                'users' => $this->userRepository->latest(
                    $filter,
                    5,
                    [],
                    ['id', 'name', 'last_name', 'email', 'type', 'created_at']
                ),

                'courses' => $this->courseRepository->latest(
                    $filter,
                    5,
                    [],
                    ['id', 'name', 'teacher_id', 'created_at']
                ),

                'tasks' => $this->taskRepository->latest(
                    $filter,
                    5,
                    [],
                    ['id', 'title', 'course_id', 'type', 'status', 'created_at']
                ),

                'files' => $this->fileRepository->latest(
                    $filter,
                    5,
                    [],
                    ['id', 'name', 'path', 'mime_type', 'size', 'task_id', 'created_at']
                ),

                'grades' => $this->gradeRepository->latest(
                    $filter,
                    5,
                    [],
                    ['id', 'grade', 'student_id', 'course_id', 'created_at']
                ),

                'notifications' => $this->notificationRepository->latest(
                    $filter,
                    5,
                    [],
                    ['id', 'title', 'type', 'user_id', 'read_at', 'created_at']
                ),

                'chat_groups' => $this->chatGroupRepository->latest(
                    $filter,
                    5,
                    [],
                    ['id', 'name', 'owner_id', 'active', 'created_at']
                ),

                'messages' => $this->messageRepository->latest(
                    $filter,
                    5,
                    [],
                    ['id', 'content', 'user_id', 'chat_group_id', 'created_at']
                ),
            ],
        ];
    }

    public function getStudentDashboard(User $student): array
    {
        $courseIds = Enrollment::query()
            ->where('student_id', $student->id)
            ->pluck('course_id');

        $taskIds = Task::query()
            ->whereIn('course_id', $courseIds)
            ->pluck('id');

        return [
            'summary' => [
                'courses' => $courseIds->count(),

                'pending_tasks' => Task::query()
                    ->whereIn('course_id', $courseIds)
                    ->whereNotIn('id', function ($query) use ($student) {
                        $query->select('task_id')
                            ->from('entrega_tareas')
                            ->where('student_id', $student->id);
                    })
                    ->count(),

                'materials' => File::query()
                    ->whereIn('task_id', $taskIds)
                    ->count(),

                'grades' => DeliveryTask::query()
                    ->where('student_id', $student->id)
                    ->whereNotNull('grade')
                    ->count(),
            ],

            'upcoming_tasks' => Task::query()
                ->whereIn('course_id', $courseIds)
                ->latest()
                ->limit(5)
                ->get([
                    'id',
                    'title',
                    'course_id',
                    'type',
                    'created_at',
                ]),

            'latest_grades' => DeliveryTask::query()
                ->with(['task:id,title'])
                ->where('student_id', $student->id)
                ->whereNotNull('grade')
                ->latest()
                ->limit(5)
                ->get([
                    'id',
                    'task_id',
                    'grade',
                    'comment',
                    'created_at',
                ]),

            'courses' => Course::query()
                ->whereIn('id', $courseIds)
                ->latest()
                ->limit(5)
                ->get([
                    'id',
                    'name',
                    'created_at',
                ]),
        ];
    }

    public function clearAdminDashboardCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}
