<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatGroupController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DeliverTaskController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\FileController;
use App\Http\Controllers\Api\GradeController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ParticipantController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\UserController;

Route::prefix('v1')->group(function () {

    Route::prefix('auth')->group(function () {

        Route::post(
            '/login',
            [AuthController::class, 'login']
        );

        Route::middleware('auth:sanctum')->group(function () {

            Route::get(
                '/me',
                [AuthController::class, 'me']
            );

            Route::post(
                '/logout',
                [AuthController::class, 'logout']
            );

            Route::post(
                '/logout-all',
                [AuthController::class, 'logoutAll']
            );
        });
    });

    Route::middleware([
        'auth:sanctum',
        'role.exists',
    ])->group(function () {

        Route::get(
            '/dashboard/admin',
            [DashboardController::class, 'getAdminDashboard']
        )->middleware([
            'role:admin',
            'permission:admin.panel',
        ]);

        Route::get(
            '/dashboard/teacher',
            [DashboardController::class, 'teacher']
        )->middleware(
            'role:teacher'
        );

        Route::get(
            '/dashboard/student',
            [DashboardController::class, 'getStudentDashBoard']
        )->middleware(
            'role:student'
        );

        Route::middleware(
            'permission:notifications.view'
        )->group(function () {

            Route::get(
                '/notifications',
                [NotificationController::class, 'index']
            );

            Route::get(
                '/notifications/unread',
                [NotificationController::class, 'unread']
            );

            Route::patch(
                '/notifications/read-all',
                [NotificationController::class, 'markAllAsRead']
            );

            Route::patch(
                '/notifications/{id}/read',
                [NotificationController::class, 'markAsRead']
            );
        });

        Route::middleware('role:admin')->group(function () {

            Route::get(
                '/users',
                [UserController::class, 'index']
            )->middleware(
                'permission:users.view'
            );

            Route::get(
                '/users/{user}',
                [UserController::class, 'show']
            )->middleware(
                'permission:users.view'
            );

            Route::post(
                '/users',
                [UserController::class, 'store']
            )->middleware(
                'permission:users.create'
            );

            Route::match(
                ['put', 'patch'],
                '/users/{user}',
                [UserController::class, 'update']
            )->middleware(
                'permission:users.update'
            );

            Route::delete(
                '/users/{user}',
                [UserController::class, 'destroy']
            )->middleware(
                'permission:users.delete'
            );
        });

        Route::middleware([
            'role:admin',
            'permission:admin.panel',
        ])->group(function () {

            Route::apiResource(
                'roles',
                RoleController::class
            );

            Route::get(
                '/permissions',
                [PermissionController::class, 'index']
            );

            Route::put(
                '/roles/{role}/permissions',
                [RoleController::class, 'syncPermissions']
            );
        });

        Route::get(
            '/courses',
            [CourseController::class, 'index']
        )->middleware(
            'permission:courses.view'
        );

        Route::get(
            '/courses/{course}',
            [CourseController::class, 'show']
        )->middleware(
            'permission:courses.view'
        );

        Route::middleware(
            'role:admin|teacher'
        )->group(function () {

            Route::post(
                '/courses',
                [CourseController::class, 'store']
            )->middleware(
                'permission:courses.create'
            );

            Route::match(
                ['put', 'patch'],
                '/courses/{course}',
                [CourseController::class, 'update']
            )->middleware(
                'permission:courses.update'
            );

            Route::delete(
                '/courses/{course}',
                [CourseController::class, 'destroy']
            )->middleware(
                'permission:courses.delete'
            );
        });

        Route::get(
            '/teacher/courses/{id}',
            [CourseController::class, 'teacherCourseDetail']
        )->middleware([
            'role:teacher',
            'permission:courses.view',
        ]);

        Route::get(
            '/tasks',
            [TaskController::class, 'index']
        )->middleware(
            'permission:tasks.view'
        );

        Route::get(
            '/tasks/{task}',
            [TaskController::class, 'show']
        )->middleware(
            'permission:tasks.view'
        );

        Route::middleware(
            'role:admin|teacher'
        )->group(function () {

            Route::post(
                '/tasks',
                [TaskController::class, 'store']
            )->middleware(
                'permission:tasks.create'
            );

            Route::match(
                ['put', 'patch'],
                '/tasks/{task}',
                [TaskController::class, 'update']
            )->middleware(
                'permission:tasks.update'
            );

            Route::delete(
                '/tasks/{task}',
                [TaskController::class, 'destroy']
            )->middleware(
                'permission:tasks.delete'
            );
        });

        Route::middleware(
            'role:admin|teacher'
        )->group(function () {

            Route::get(
                '/enrollments',
                [EnrollmentController::class, 'index']
            )->middleware(
                'permission:enrollments.view'
            );

            Route::post(
                '/enrollments',
                [EnrollmentController::class, 'store']
            )->middleware(
                'permission:enrollments.create'
            );

            Route::delete(
                '/enrollments/{id}',
                [EnrollmentController::class, 'destroy']
            )->middleware(
                'permission:enrollments.delete'
            );
        });

        Route::get(
            '/files',
            [FileController::class, 'index']
        )->middleware(
            'permission:files.view'
        );

        Route::post(
            '/files',
            [FileController::class, 'store']
        )->middleware([
            'role:admin|teacher',
            'permission:files.upload',
        ]);

        Route::delete(
            '/files/{id}',
            [FileController::class, 'destroy']
        )->middleware([
            'role:admin|teacher',
            'permission:files.delete',
        ]);

        Route::get(
            '/grades',
            [GradeController::class, 'index']
        )->middleware(
            'permission:grades.view'
        );

        Route::get(
            '/grades/{grade}',
            [GradeController::class, 'show']
        )->middleware(
            'permission:grades.view'
        );

        Route::post(
            '/grades',
            [GradeController::class, 'store']
        )->middleware([
            'role:admin|teacher',
            'permission:grades.create',
        ]);

        Route::match(
            ['put', 'patch'],
            '/grades/{grade}',
            [GradeController::class, 'update']
        )->middleware([
            'role:admin|teacher',
            'permission:grades.update',
        ]);

        Route::get(
            '/deliveries',
            [DeliverTaskController::class, 'index']
        );

        Route::get(
            '/deliveries/{delivery}',
            [DeliverTaskController::class, 'show']
        );

        Route::post(
            '/deliveries',
            [DeliverTaskController::class, 'store']
        )->middleware(
            'role:student'
        );

        Route::match(
            ['put', 'patch'],
            '/deliveries/{delivery}',
            [DeliverTaskController::class, 'update']
        )->middleware(
            'role:admin|teacher|student'
        );

        Route::delete(
            '/deliveries/{delivery}',
            [DeliverTaskController::class, 'destroy']
        )->middleware(
            'role:admin|student'
        );

        Route::get(
            '/chat-groups',
            [ChatGroupController::class, 'index']
        )->middleware(
            'permission:chats.view'
        );

        Route::get(
            '/chat-groups/{chat_group}',
            [ChatGroupController::class, 'show']
        )->middleware(
            'permission:chats.view'
        );

        Route::post(
            '/chat-groups',
            [ChatGroupController::class, 'store']
        )->middleware(
            'permission:chats.create'
        );

        Route::match(
            ['put', 'patch'],
            '/chat-groups/{chat_group}',
            [ChatGroupController::class, 'update']
        )->middleware(
            'permission:chats.update'
        );

        Route::delete(
            '/chat-groups/{chat_group}',
            [ChatGroupController::class, 'destroy']
        )->middleware(
            'permission:chats.delete'
        );

        Route::get(
            '/participants',
            [ParticipantController::class, 'index']
        )->middleware(
            'permission:chats.view'
        );

        Route::post(
            '/participants',
            [ParticipantController::class, 'store']
        )->middleware(
            'permission:chats.update'
        );

        Route::delete(
            '/participants/{participant}',
            [ParticipantController::class, 'destroy']
        )->middleware(
            'permission:chats.update'
        );

        Route::get(
            '/messages',
            [MessageController::class, 'index']
        )->middleware(
            'permission:messages.view'
        );

        Route::get(
            '/messages/{message}',
            [MessageController::class, 'show']
        )->middleware(
            'permission:messages.view'
        );

        Route::post(
            '/messages',
            [MessageController::class, 'store']
        )->middleware(
            'permission:messages.create'
        );

        Route::delete(
            '/messages/{message}',
            [MessageController::class, 'destroy']
        )->middleware(
            'permission:messages.delete'
        );
    });
});