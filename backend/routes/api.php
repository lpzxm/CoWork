<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Resources\UserResource;

// Route::post('/register', [\App\Http\Controllers\Auth\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\Auth\AuthController::class, 'login'])->middleware('throttle:login');
Route::post('/verify-token', [\App\Http\Controllers\Auth\AuthController::class, 'verifyToken'])->middleware('throttle:verify');
Route::post('/auth/send-two-factor-expires-at', [\App\Http\Controllers\Auth\AuthController::class, 'sendTwoFactorExpiresAt']);

// Imagenes publicas (logo, escudo)
Route::get('images/general/{filename}', [\App\Http\Controllers\ImageController::class, 'show']);

Route::middleware('auth:api')->group(function () {
    Route::get('/user', function (Request $request) {
        $user = $request->user()->load('roles');
        return new UserResource($user);
    });
    Route::post('/logout', [\App\Http\Controllers\Auth\AuthController::class, 'logout']);

    // Gestion de usuarios — solo super-admin y admin
    Route::apiResource('users', \App\Http\Controllers\UserController::class)->middleware('rol:super-admin|admin');

    // Gestion de status
    Route::get('status', [\App\Http\Controllers\StatusController::class, 'index']);
    Route::post('status', [\App\Http\Controllers\StatusController::class, 'store'])
        ->middleware('rol:super-admin|admin');
    Route::get('status/{status}', [\App\Http\Controllers\StatusController::class, 'show']);
    Route::put('status/{status}', [\App\Http\Controllers\StatusController::class, 'update'])
        ->middleware('rol:super-admin|admin');
    Route::delete('status/{status}', [\App\Http\Controllers\StatusController::class, 'destroy'])
        ->middleware('rol:super-admin');

    // Gestion de tareas
    Route::get('tasks', [\App\Http\Controllers\TaskController::class, 'index']);
    Route::post('tasks', [\App\Http\Controllers\TaskController::class, 'store'])
        ->middleware('rol:super-admin|admin');
    Route::get('tasks/{task}', [\App\Http\Controllers\TaskController::class, 'show'])
        ->middleware('rol:super-admin|admin|coordinador');
    Route::put('tasks/{task}', [\App\Http\Controllers\TaskController::class, 'update'])
        ->middleware('rol:super-admin|admin');
    Route::delete('tasks/{task}', [\App\Http\Controllers\TaskController::class, 'destroy'])
        ->middleware('rol:super-admin|admin');
    Route::patch('tasks/{task}/request-review', [\App\Http\Controllers\TaskController::class, 'requestReview'])
        ->middleware('rol:super-admin|admin|coordinador');
    Route::patch('tasks/{task}/review', [\App\Http\Controllers\TaskController::class, 'approveReview'])
        ->middleware('rol:super-admin|admin');

    // Gestion de subtareas
    Route::controller(\App\Http\Controllers\SubTaskController::class)->group(function () {
        Route::get('tasks/{task}/subtasks', 'index');
        Route::post('tasks/{task}/subtasks', 'store')
            ->middleware('rol:super-admin|admin|coordinador');
        Route::get('subtasks/{subtask}', 'show')
            ->middleware('rol:super-admin|admin|coordinador');
        Route::put('subtasks/{subtask}', 'update')
            ->middleware('rol:super-admin|admin|coordinador');
        Route::delete('subtasks/{subtask}', 'destroy')
            ->middleware('rol:super-admin|admin|coordinador');
    });

    // Gestion de archivos
    Route::controller(\App\Http\Controllers\FileController::class)->group(function () {
        Route::post('files', 'store')
            ->middleware('rol:super-admin|admin|coordinador');
        Route::get('files/{file}', 'show')
            ->middleware('rol:super-admin|admin|coordinador');
        Route::delete('files/{file}', 'destroy')
            ->middleware('rol:super-admin|admin|coordinador');
    });
});
