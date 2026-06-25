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

        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::post('/logout-all', [AuthController::class, 'logoutAll']);
        });
    });

    Route::middleware('auth:sanctum')->group(function () {
        /*
        |--------------------------------------------------------------------------
        | NOTIFICATIONS
        |--------------------------------------------------------------------------
        */

        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::get('/notifications/unread', [NotificationController::class, 'unread']);
        Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    });

    Route::middleware([
        'auth:sanctum',
        'role.exists',
    ])->group(function () {

        /*
        |--------------------------------------------------------------------------
        | DASHBOARDS
        |--------------------------------------------------------------------------
        */

        Route::middleware('role:admin')->get(
            '/dashboard/admin',
            [DashboardController::class, 'getAdminDashboard']
        );

        Route::middleware('role:teacher')->get(
            '/dashboard/teacher',
            [DashboardController::class, 'teacher']
        );

        Route::middleware('role:student')->get(
            '/dashboard/student',
            [DashboardController::class, 'getStudentDashBoard']
        );


        /*
        |--------------------------------------------------------------------------
        | TEACHER
        |--------------------------------------------------------------------------
        */

        Route::middleware('role:teacher')->group(function () {
            Route::get(
                '/teacher/courses/{id}',
                [CourseController::class, 'teacherCourseDetail']
            );
        });

        /*
        |--------------------------------------------------------------------------
        | ADMIN
        |--------------------------------------------------------------------------
        */

        Route::middleware('role:admin')->group(function () {

            Route::apiResource('users', UserController::class);
            Route::apiResource('roles', RoleController::class);

            Route::get('/permissions', [PermissionController::class, 'index']);

            Route::put(
                '/roles/{role}/permissions',
                [RoleController::class, 'syncPermissions']
            );
        });

        /*
        |--------------------------------------------------------------------------
        | ADMIN + TEACHER
        |--------------------------------------------------------------------------
        */

        Route::middleware('role:admin|teacher')->group(function () {

            Route::apiResource('courses', CourseController::class)
                ->except(['index', 'show']);

            Route::apiResource('tasks', TaskController::class)
                ->except(['index', 'show']);

            Route::apiResource('grades', GradeController::class)
                ->except(['index', 'show']);

            Route::get('/enrollments', [EnrollmentController::class, 'index']);
            Route::post('/enrollments', [EnrollmentController::class, 'store']);
            Route::delete('/enrollments/{id}', [EnrollmentController::class, 'destroy']);

            Route::post('/files', [FileController::class, 'store']);
            Route::delete('/files/{id}', [FileController::class, 'destroy']);
        });

        /*
        |--------------------------------------------------------------------------
        | ALL AUTHENTICATED
        |--------------------------------------------------------------------------
        */

        Route::apiResource('courses', CourseController::class)
            ->only(['index', 'show']);

        Route::apiResource('tasks', TaskController::class)
            ->only(['index', 'show']);

        Route::apiResource('grades', GradeController::class)
            ->only(['index', 'show']);

        Route::get('/files', [FileController::class, 'index']);

        Route::apiResource('deliveries', DeliverTaskController::class);

        Route::apiResource('chat-groups', ChatGroupController::class);

        Route::apiResource('participants', ParticipantController::class)
            ->except(['show', 'update']);

        Route::apiResource('messages', MessageController::class)
            ->except(['update']);
    });
});
