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

    public function clearAdminDashboardCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}
