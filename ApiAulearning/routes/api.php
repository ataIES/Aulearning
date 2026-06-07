<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\GradeController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\FileController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ChatGroupController;
use App\Http\Controllers\Api\DashBoardController;
use App\Http\Controllers\Api\ParticipantController;
use App\Http\Controllers\Api\MessageController;

Route::prefix('v1')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::post('/logout-all', [AuthController::class, 'logoutAll']);
        });
    });

    Route::middleware([
        'auth:sanctum',
        'role.exists',
        'role:admin',
    ])->get('/dashboard/admin', [DashBoardController::class, 'getAdminDashboard']);

    Route::middleware([
        'auth:sanctum',
        'role.exists',
    ])->group(function () {

        /*
        |--------------------------------------------------------------------------
        | ADMIN ONLY
        |--------------------------------------------------------------------------
        */

        Route::middleware('role:admin')->group(function () {
            Route::apiResource('users', UserController::class);
            Route::apiResource('enrollments', EnrollmentController::class)->except(['update']);
        });

        /*
        |--------------------------------------------------------------------------
        | ADMIN + TEACHER
        |--------------------------------------------------------------------------
        */

        Route::middleware('role:admin|teacher')->group(function () {
            Route::apiResource('courses', CourseController::class)->except(['index', 'show']);
            Route::apiResource('grades', GradeController::class)->except(['index', 'show']);
            Route::apiResource('tasks', TaskController::class)->except(['index', 'show']);
            Route::apiResource('notifications', NotificationController::class)->except(['index', 'show', 'update']);
        });

        /*
        |--------------------------------------------------------------------------
        | ADMIN + TEACHER + STUDENT
        |--------------------------------------------------------------------------
        */

        Route::apiResource('courses', CourseController::class)->only(['index', 'show']);
        Route::apiResource('tasks', TaskController::class)->only(['index', 'show']);
        Route::apiResource('grades', GradeController::class)->only(['index', 'show']);
        Route::apiResource('files', FileController::class)->except(['update']);
        Route::apiResource('notifications', NotificationController::class)->only(['index', 'show', 'destroy']);

        Route::patch(
            '/notifications/{id}/read',
            [NotificationController::class, 'markAsRead']
        );

        Route::apiResource('chat-groups', ChatGroupController::class);
        Route::apiResource('participants', ParticipantController::class)->except(['show', 'update']);
        Route::apiResource('messages', MessageController::class)->except(['update']);
    });
});
