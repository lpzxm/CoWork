<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Resources\UserResource;

// Route::post('/register', [\App\Http\Controllers\Auth\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\Auth\AuthController::class, 'login'])->middleware('throttle:login');
Route::post('/verify-token', [\App\Http\Controllers\Auth\AuthController::class, 'verifyToken'])->middleware('throttle:verify');

Route::middleware('auth:api')->group(function () {
    Route::get('/user', function (Request $request) {
        $user = $request->user()->load('roles');
        return new UserResource($user);
    });
    Route::post('/logout', [\App\Http\Controllers\Auth\AuthController::class, 'logout']);

    // Gestion de usuarios
    Route::apiResource('users', \App\Http\Controllers\UserController::class);

    // Gestion de status
    Route::apiResource('status', \App\Http\Controllers\StatusController::class);

    // Gestion de tareas
    Route::apiResource('tasks', \App\Http\Controllers\TaskController::class);
    Route::patch('tasks/{task}/request-review', [\App\Http\Controllers\TaskController::class, 'requestReview']);
    Route::patch('tasks/{task}/review', [\App\Http\Controllers\TaskController::class, 'approveReview']);

    // Gestion de subtareas
    Route::controller(\App\Http\Controllers\SubTaskController::class)->group(function () {
        Route::get('tasks/{task}/subtasks', 'index');
        Route::post('tasks/{task}/subtasks', 'store');
        Route::get('subtasks/{subtask}', 'show');
        Route::put('subtasks/{subtask}', 'update');
        Route::delete('subtasks/{subtask}', 'destroy');
    });

    // Gestion de archivos
    Route::controller(\App\Http\Controllers\FileController::class)->group(function () {
        Route::post('files', 'store');
        Route::get('files/{file}', 'show');
        Route::delete('files/{file}', 'destroy');
    });
});
