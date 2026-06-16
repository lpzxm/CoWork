<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;

use App\Models\Task;
use App\DTOs\TaskData;
use App\Http\Resources\TaskResource;

// envio de correos a usuarios por tareas asignadas y desasignadas
use App\Mail\Task\TaskAssignmentMail;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $currentUser = auth()->user();

        try {
            $tasksRaw = Task::with(['status', 'creator', 'acceptor', 'decliner', 'updater']);
            ($currentUser->hasRole(['super-admin', 'admin'])) ? $tasks = $tasksRaw->get() : $tasks = $tasksRaw->whereHas('coordinators', fn($q) => $q->where('user_id', $currentUser->id))->get();

            return TaskResource::collection($tasks);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $currentUser = auth()->user();
        if (!$currentUser->hasRole(['super-admin', 'admin'])) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);

        try {
            $data = TaskData::validateAndCreate($request->all());

            $task = Task::create([
                'title' => $data->title,
                'description' => $data->description,
                'status_id' => $data->status_id,
                'dt_delivery_limit' => $data->dt_delivery_limit,
                'created_by' => $currentUser->id,
            ]);

            if ($request->has('coordinators_ids')) {
                $coordinatorsIds = $task->coordinators()->sync(
                    collect($request->coordinators_ids)->mapWithKeys(fn($id) => [
                        $id => ['assigned_by' => $currentUser->id, 'assigned_at' => now()]
                    ])
                );

                if (!empty($coordinatorsIds['attached'])) {
                    $users = User::whereIn('id', $coordinatorsIds['attached'])->get();

                    foreach ($users as $user) {
                        Mail::to($user->email)->send(new TaskAssignmentMail(user: $user, task: $task, action: 'assigned'));
                    }
                }
            }

            $task->load(['status', 'creator']);
            return response()->json(['status' => 'success', 'message' => 'Tarea creada correctamente.', 'data' => new TaskResource($task)], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        try {
            $currentUser = auth()->user();
            $task = Task::with(['status', 'creator', 'acceptor', 'decliner', 'updater', 'coordinators'])->find($id);
            if (!$task) return response()->json(['status' => 'error', 'message' => 'Tarea no encontrada.'], 404);

            if (!$currentUser->hasRole(['super-admin', 'admin']) && !$task->coordinators()->where('user_id', $currentUser->id)->exists()) {
                return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);
            }
            return new TaskResource($task);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $currentUser = auth()->user();
        if (!$currentUser->hasRole(['super-admin', 'admin'])) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);

        try {
            $task = Task::with(['status', 'creator', 'acceptor', 'decliner', 'updater'])->find($id);
            if (!$task) return response()->json(['status' => 'error', 'message' => 'Tarea no encontrada.'], 404);

            $validator = Validator::make($request->all(), TaskData::rules($task->id), TaskData::messages());
            if ($validator->fails()) return response()->json(['status' => 'error', 'message' => 'Datos inválidos.', 'errors' => $validator->errors()], 400);

            $data = TaskData::from($validator->validated());

            $task->update([
                'title' => $data->title ?? $task->title,
                'description' => $data->description ?? $task->description,
                'status_id' => $data->status_id ?? $task->status_id,
                'dt_delivery_limit' => $data->dt_delivery_limit ?? $task->dt_delivery_limit,
                'updated_by' => $currentUser->id,
            ]);

            if ($request->has('coordinators_ids')) {
                $coordinatorsIds = $task->coordinators()->sync(
                    collect($request->coordinators_ids)->mapWithKeys(fn($id) => [
                        $id => ['assigned_by' => $currentUser->id, 'assigned_at' => now()]
                    ])
                );

                if (!empty($coordinatorsIds['attached'])) {
                    $users = User::whereIn('id', $coordinatorsIds['attached'])->get();

                    foreach ($users as $user) {
                        Mail::to($user->email)->send(new TaskAssignmentMail(user: $user, task: $task, action: 'assigned'));
                    }
                }

                if (!empty($coordinatorsIds['detached'])) {
                    $users = User::whereIn('id', $coordinatorsIds['detached'])->get();

                    foreach ($users as $user) {
                        Mail::to($user->email)->send(new TaskAssignmentMail(user: $user, task: $task, action: 'unassigned'));
                    }
                }
            }

            $task->load(['status', 'creator', 'coordinators']);
            return response()->json(['status' => 'success', 'message' => 'Tarea actualizada correctamente.', 'data' => new TaskResource($task)], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $currentUser = auth()->user();
        if (!$currentUser->hasRole(['super-admin', 'admin'])) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);

        try {
            $task = Task::find($id);
            if (!$task) return response()->json(['status' => 'error', 'message' => 'Tarea no encontrada.'], 404);

            if ($task->subtasks()->count() > 0) {
                return response()->json(['status' => 'error', 'message' => 'No se puede eliminar la tarea porque tiene subtareas asociadas. Elimínalas primero.'], 409);
            }

            $task->delete();

            $users = $task->coordinators()->get();
            foreach ($users as $user) {
                Mail::to($user->email)->send(new TaskAssignmentMail(user: $user, task: $task, action: 'unassigned'));
            }

            return response()->json(['status' => 'success', 'message' => 'Tarea eliminada correctamente.'], 200);
        } catch (QueryException $e) {
            $errorCode = $e->errorInfo[1] ?? null;
            if ($errorCode === 1451 || $errorCode === 1217) {
                return response()->json(['status' => 'error', 'message' => 'No se puede eliminar la tarea porque tiene registros asociados. Elimínalos primero.'], 409);
            }
            return response()->json(['status' => 'error', 'message' => 'Error al eliminar la tarea.'], 400);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Error al eliminar la tarea.'], 400);
        }
    }

    public function requestReview(int $id)
    {
        $currentUser = auth()->user();

        try {
            $task = Task::find($id);
            if (!$task) return response()->json(['status' => 'error', 'message' => 'Tarea no encontrada.'], 404);

            if (!$currentUser->hasRole(['super-admin', 'admin']) && !$task->coordinators()->where('user_id', $currentUser->id)->exists()) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);

            $allCompleted = $task->subtasks()->exists() && $task->subtasks()->where('status_id', '!=', 4)->count() === 0;

            if (!$allCompleted) return response()->json(['status' => 'error', 'message' => 'Todas las subtareas deben estar completadas.'], 400);

            $task->status_id = 5;
            $task->updated_by = $currentUser->id;
            $task->save();

            $task->load(['status', 'creator']);

            return response()->json(['status' => 'success', 'message' => 'Solicitud de revisión enviada correctamente.'], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
