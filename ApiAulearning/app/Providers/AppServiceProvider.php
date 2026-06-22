<?php

namespace App\Providers;

use App\Mappers\DeliverTaskMapper;
use App\Mappers\FileMapper;
use App\Mappers\Interfaces\IDeliverTaskMapper;
use App\Mappers\Interfaces\IFileMapper;
use Illuminate\Support\ServiceProvider;

// Repositories
use App\Repositories\UserRepository;
use App\Repositories\CourseRepository;
use App\Repositories\EnrollmentRepository;
use App\Repositories\GradeRepository;
use App\Repositories\TaskRepository;
use App\Repositories\FileRepository;
use App\Repositories\ChatGroupRepository;
use App\Repositories\ParticipantRepository;
use App\Repositories\MessageRepository;
use App\Repositories\NotificationRepository;
use App\Mappers\Interfaces\INotificationMapper;
use App\Mappers\NotificationMapper;
use App\Repositories\DeliverTaskRepository;
// Repository interfaces
use App\Repositories\Interfaces\IUserRepository;
use App\Repositories\Interfaces\ICourseRepository;
use App\Repositories\Interfaces\IEnrollmentRepository;
use App\Repositories\Interfaces\IGradeRepository;
use App\Repositories\Interfaces\ITaskRepository;
use App\Repositories\Interfaces\IFileRepository;
use App\Repositories\Interfaces\IChatGroupRepository;
use App\Repositories\Interfaces\IDeliverTaskRepository;
use App\Repositories\Interfaces\IParticipantRepository;
use App\Repositories\Interfaces\IMessageRepository;
use App\Repositories\Interfaces\INotificationRepository;
use App\Repositories\Interfaces\IRoleRepository;
use App\Repositories\RoleRepository;
// Services
use App\Services\AuthService;
use App\Services\UserService;
use App\Services\CourseService;
use App\Services\EnrollmentService;
use App\Services\GradeService;
use App\Services\TaskService;
use App\Services\FileService;
use App\Services\ChatGroupService;
use App\Services\DashBoardService;
use App\Services\DeliverTaskService;
use App\Services\ParticipantService;
use App\Services\MessageService;
use App\Services\NotificationService;

// Service interfaces
use App\Services\Interfaces\IAuthService;
use App\Services\Interfaces\IUserService;
use App\Services\Interfaces\ICourseService;
use App\Services\Interfaces\IEnrollmentService;
use App\Services\Interfaces\IGradeService;
use App\Services\Interfaces\ITaskService;
use App\Services\Interfaces\IFileService;
use App\Services\Interfaces\IChatGroupService;
use App\Services\Interfaces\IDashboardService;
use App\Services\Interfaces\IDeliverTaskService;
use App\Services\Interfaces\IParticipantService;
use App\Services\Interfaces\IMessageService;
use App\Services\Interfaces\INotificationService;
use App\Services\Interfaces\IRoleService;
use App\Services\RoleService;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Repository bindings
        |--------------------------------------------------------------------------
        */

        $this->app->bind(IUserRepository::class, UserRepository::class);
        $this->app->bind(ICourseRepository::class, CourseRepository::class);
        $this->app->bind(IEnrollmentRepository::class, EnrollmentRepository::class);
        $this->app->bind(IGradeRepository::class, GradeRepository::class);
        $this->app->bind(ITaskRepository::class, TaskRepository::class);
        $this->app->bind(IFileRepository::class, FileRepository::class);
        $this->app->bind(IChatGroupRepository::class, ChatGroupRepository::class);
        $this->app->bind(IParticipantRepository::class, ParticipantRepository::class);
        $this->app->bind(IMessageRepository::class, MessageRepository::class);
        $this->app->bind(INotificationRepository::class, NotificationRepository::class);
        $this->app->bind(IRoleRepository::class, RoleRepository::class);
        $this->app->bind(
            NotificationRepository::class
        );

        $this->app->bind(IDeliverTaskRepository::class, DeliverTaskRepository::class);
        $this->app->bind(IDeliverTaskMapper::class, DeliverTaskMapper::class);
        /*
        |--------------------------------------------------------------------------
        | Service bindings
        |--------------------------------------------------------------------------
        */

        $this->app->bind(IAuthService::class, AuthService::class);
        $this->app->bind(IUserService::class, UserService::class);
        $this->app->bind(ICourseService::class, CourseService::class);
        $this->app->bind(IEnrollmentService::class, EnrollmentService::class);
        $this->app->bind(IGradeService::class, GradeService::class);
        $this->app->bind(ITaskService::class, TaskService::class);
        $this->app->bind(IFileService::class, FileService::class);
        $this->app->bind(IChatGroupService::class, ChatGroupService::class);
        $this->app->bind(IParticipantService::class, ParticipantService::class);
        $this->app->bind(IMessageService::class, MessageService::class);
        $this->app->bind(
            INotificationService::class,
            NotificationService::class
        );
        $this->app->bind(IRoleService::class, RoleService::class);
        $this->app->bind(
            IDashboardService::class,
            DashBoardService::class
        );
        $this->app->bind(
            INotificationMapper::class,
            NotificationMapper::class
        );
        $this->app->bind(IDeliverTaskService::class, DeliverTaskService::class);

        $this->app->bind(IFileMapper::class, FileMapper::class);
    }

    public function boot(): void
    {
        //
    }
}
