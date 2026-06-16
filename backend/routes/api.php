<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [\App\Http\Controllers\Auth\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\Auth\AuthController::class, 'login']);
Route::post('/verify-token', [\App\Http\Controllers\Auth\AuthController::class, 'verifyToken']);

Route::middleware('auth:api')->group(function () {
    Route::get('/user', function (Request $request) {
        $user = $request->user()->load('roles');
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'active' => $user->active,
            'created_at' => $user->created_at,
            'roles' => $user->getRoleNames(),
        ];
    });
    Route::post('/logout', [\App\Http\Controllers\Auth\AuthController::class, 'logout']);

    // Gestion de usuarios
    Route::apiResource('users', \App\Http\Controllers\UserController::class);

    // Gestion de status
    Route::apiResource('status', \App\Http\Controllers\StatusController::class);

    // Gestion de tareas
    Route::apiResource('tasks', \App\Http\Controllers\TaskController::class);
    Route::patch('tasks/{task}/request-review', [\App\Http\Controllers\TaskController::class, 'requestReview']);

    // Gestion de subtareas
    Route::get('tasks/{task}/subtasks', [\App\Http\Controllers\SubTaskController::class, 'index']);
    Route::post('tasks/{task}/subtasks', [\App\Http\Controllers\SubTaskController::class, 'store']);
    Route::get('subtasks/{subtask}', [\App\Http\Controllers\SubTaskController::class, 'show']);
    Route::put('subtasks/{subtask}', [\App\Http\Controllers\SubTaskController::class, 'update']);
    Route::delete('subtasks/{subtask}', [\App\Http\Controllers\SubTaskController::class, 'destroy']);
});
