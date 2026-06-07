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
use App\Http\Controllers\Api\ParticipantController;
use App\Http\Controllers\Api\MessageController;

Route::prefix('v1')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | AUTH
    |--------------------------------------------------------------------------
    */

    Route::prefix('auth')->group(function () {

        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function () {

            Route::get('/me', [AuthController::class, 'me']);

            Route::post('/logout', [AuthController::class, 'logout']);

            Route::post('/logout-all', [AuthController::class, 'logoutAll']);
        });
    });

    /*
    |--------------------------------------------------------------------------
    | PROTECTED ROUTES
    |--------------------------------------------------------------------------
    */

    Route::middleware([
        'auth:sanctum',
        'role.exists'
    ])->group(function () {

        /*
        |--------------------------------------------------------------------------
        | USERS
        |--------------------------------------------------------------------------
        */

        Route::apiResource(
            'users',
            UserController::class
        );

        /*
        |--------------------------------------------------------------------------
        | COURSES
        |--------------------------------------------------------------------------
        */

        Route::apiResource(
            'courses',
            CourseController::class
        );

        /*
        |--------------------------------------------------------------------------
        | ENROLLMENTS
        |--------------------------------------------------------------------------
        */

        Route::apiResource(
            'enrollments',
            EnrollmentController::class
        )->except([
            'update'
        ]);

        /*
        |--------------------------------------------------------------------------
        | GRADES
        |--------------------------------------------------------------------------
        */

        Route::apiResource(
            'grades',
            GradeController::class
        );

        /*
        |--------------------------------------------------------------------------
        | TASKS
        |--------------------------------------------------------------------------
        */

        Route::apiResource(
            'tasks',
            TaskController::class
        );

        /*
        |--------------------------------------------------------------------------
        | FILES
        |--------------------------------------------------------------------------
        */

        Route::apiResource(
            'files',
            FileController::class
        )->except([
            'update'
        ]);

        /*
        |--------------------------------------------------------------------------
        | NOTIFICATIONS
        |--------------------------------------------------------------------------
        */

        Route::apiResource(
            'notifications',
            NotificationController::class
        )->except([
            'update'
        ]);

        Route::patch(
            '/notifications/{id}/read',
            [NotificationController::class, 'markAsRead']
        );

        /*
        |--------------------------------------------------------------------------
        | CHAT GROUPS
        |--------------------------------------------------------------------------
        */

        Route::apiResource(
            'chat-groups',
            ChatGroupController::class
        );

        /*
        |--------------------------------------------------------------------------
        | PARTICIPANTS
        |--------------------------------------------------------------------------
        */

        Route::apiResource(
            'participants',
            ParticipantController::class
        )->except([
            'show',
            'update'
        ]);

        /*
        |--------------------------------------------------------------------------
        | MESSAGES
        |--------------------------------------------------------------------------
        */

        Route::apiResource(
            'messages',
            MessageController::class
        )->except([
            'update'
        ]);
    });
});
