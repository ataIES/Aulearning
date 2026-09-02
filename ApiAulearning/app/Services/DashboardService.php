<?php

namespace App\Services;

use App\Filters\DashboardFilter;
use App\Models\Course;
use App\Models\DeliveryTask;
use App\Models\Enrollment;
use App\Models\File;
use App\Models\Task;
use App\Models\User;
use App\Repositories\Interfaces\IChatGroupRepository;
use App\Repositories\Interfaces\ICourseRepository;
use App\Repositories\Interfaces\IFileRepository;
use App\Repositories\Interfaces\IGradeRepository;
use App\Repositories\Interfaces\IMessageRepository;
use App\Repositories\Interfaces\INotificationRepository;
use App\Repositories\Interfaces\IUserRepository;
use App\Services\Interfaces\IDashboardService;

class DashboardService implements IDashboardService
{

    public function __construct(
        private readonly IUserRepository $userRepository,
        private readonly ICourseRepository $courseRepository,
        private readonly IFileRepository $fileRepository,
        private readonly IGradeRepository $gradeRepository,
        private readonly INotificationRepository $notificationRepository,
        private readonly IChatGroupRepository $chatGroupRepository,
        private readonly IMessageRepository $messageRepository,
    ) {}

    public function getAdminDashboard(): array
{
    return $this->buildAdminDashboard();
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

                'tasks as tasks_count' => function ($query) {
                    $query->whereIn('type', [
                        'TAREA',
                        'EXAMEN',
                    ]);
                },
            ])
            ->latest()
            ->limit(4)
            ->get();

        $tasksCount = Task::query()
            ->whereIn('course_id', $courseIds)
            ->whereIn('type', [
                'TAREA',
                'EXAMEN',
            ])
            ->count();

        $studentsCount = Enrollment::query()
            ->whereIn('course_id', $courseIds)
            ->distinct('student_id')
            ->count('student_id');

        $pendingDeliveries = DeliveryTask::query()
            ->whereHas('task', function ($query) use ($courseIds) {
                $query
                    ->whereIn('course_id', $courseIds)
                    ->whereIn('type', [
                        'TAREA',
                        'EXAMEN',
                    ]);
            })
            ->whereNull('grade')
            ->count();

        $latestDeliveries = DeliveryTask::query()
            ->with([
                'student:id,name,last_name,email',
                'task:id,title,course_id,type',
                'task.course:id,name',
            ])
            ->whereHas('task', function ($query) use ($courseIds) {
                $query
                    ->whereIn('course_id', $courseIds)
                    ->whereIn('type', [
                        'TAREA',
                        'EXAMEN',
                    ]);
            })
            ->latest()
            ->limit(5)
            ->get();

        $upcomingTasks = Task::query()
            ->with('course:id,name')
            ->whereIn('course_id', $courseIds)
            ->whereIn('type', [
                'TAREA',
                'EXAMEN',
            ])
            ->whereNotNull('due_date')
            ->whereDate(
                'due_date',
                '>=',
                now()->toDateString()
            )
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

                'enrollments' => Enrollment::query()
                    ->whereBetween('created_at', [
                        $from,
                        $to,
                    ])
                    ->count(),

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
                    [
                        'id',
                        'name',
                        'last_name',
                        'email',
                        'type',
                        'created_at',
                    ]
                ),

                'courses' => $this->courseRepository->latest(
                    $filter,
                    5,
                    [],
                    [
                        'id',
                        'name',
                        'teacher_id',
                        'created_at',
                    ]
                ),

                'enrollments' => Enrollment::query()
                    ->with([
                        'student:id,name,last_name,email',
                        'course:id,name',
                    ])
                    ->whereBetween('created_at', [
                        $from,
                        $to,
                    ])
                    ->latest()
                    ->limit(5)
                    ->get([
                        'id',
                        'student_id',
                        'course_id',
                        'active',
                        'created_at',
                    ]),

                'files' => $this->fileRepository->latest(
                    $filter,
                    5,
                    [],
                    [
                        'id',
                        'name',
                        'path',
                        'mime_type',
                        'size',
                        'task_id',
                        'created_at',
                    ]
                ),

                'grades' => $this->gradeRepository->latest(
                    $filter,
                    5,
                    [],
                    [
                        'id',
                        'grade',
                        'student_id',
                        'course_id',
                        'created_at',
                    ]
                ),

                'notifications' => $this->notificationRepository->latest(
                    $filter,
                    5,
                    [],
                    [
                        'id',
                        'title',
                        'type',
                        'user_id',
                        'read_at',
                        'created_at',
                    ]
                ),

                'chat_groups' => $this->chatGroupRepository->latest(
                    $filter,
                    5,
                    [],
                    [
                        'id',
                        'name',
                        'owner_id',
                        'active',
                        'created_at',
                    ]
                ),

                'messages' => $this->messageRepository->latest(
                    $filter,
                    5,
                    [],
                    [
                        'id',
                        'content',
                        'user_id',
                        'chat_group_id',
                        'created_at',
                    ]
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

        $deliveredTaskIds = DeliveryTask::query()
            ->where('student_id', $student->id)
            ->pluck('task_id');

        return [
            'summary' => [
                'courses' => $courseIds->count(),

                'pending_tasks' => Task::query()
                    ->whereIn('course_id', $courseIds)
                    ->whereIn('type', [
                        'TAREA',
                        'EXAMEN',
                    ])
                    ->whereNotIn('id', $deliveredTaskIds)
                    ->count(),

                'deliveries' => DeliveryTask::query()
                    ->where('student_id', $student->id)
                    ->count(),

                'graded_deliveries' => DeliveryTask::query()
                    ->where('student_id', $student->id)
                    ->whereNotNull('grade')
                    ->count(),

                'materials' => File::query()
                    ->whereIn('task_id', $taskIds)
                    ->count(),
            ],

            'upcoming_tasks' => Task::query()
                ->with([
                    'course:id,name',
                ])
                ->whereIn('course_id', $courseIds)
                ->whereIn('type', [
                    'TAREA',
                    'EXAMEN',
                ])
                ->whereNotIn('id', $deliveredTaskIds)
                ->whereNotNull('due_date')
                ->whereDate(
                    'due_date',
                    '>=',
                    now()->toDateString()
                )
                ->orderBy('due_date')
                ->limit(5)
                ->get([
                    'id',
                    'title',
                    'course_id',
                    'type',
                    'due_date',
                    'created_at',
                ]),

            'latest_grades' => DeliveryTask::query()
                ->with([
                    'task:id,title,course_id',
                    'task.course:id,name',
                ])
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
                    'updated_date',
                    'updated_at',
                ]),

            'courses' => Course::query()
                ->with([
                    'teacher:id,name,last_name,email',
                ])
                ->withCount([
                    'tasks as tasks_count' => function ($query) {
                        $query->whereIn('type', [
                            'TAREA',
                            'EXAMEN',
                        ]);
                    },

                    'tasks as pending_tasks_count' => function ($query) use ($student) {
                        $query
                            ->whereIn('type', [
                                'TAREA',
                                'EXAMEN',
                            ])
                            ->whereDoesntHave(
                                'deliveries',
                                function ($query) use ($student) {
                                    $query->where(
                                        'student_id',
                                        $student->id
                                    );
                                }
                            );
                    },
                ])
                ->whereIn('id', $courseIds)
                ->orderByDesc('created_at')
                ->limit(5)
                ->get(),
        ];
    }
}