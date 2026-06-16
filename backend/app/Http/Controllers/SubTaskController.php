<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;

use App\Models\Task;
use App\Models\SubTask;
use App\DTOs\SubTaskData;
use App\Http\Resources\SubTaskResource;

class SubTaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(int $taskId)
    {
        $currentUser = auth()->user();
        try {
            $task = Task::find($taskId);
            if (!$task) return response()->json(['status' => 'error', 'message' => 'Tarea no encontrada.'], 404);

            $subTasksRaw = SubTask::with(['task', 'status', 'creator', 'acceptor', 'decliner', 'updater']);
            ($currentUser->hasRole(['super-admin', 'admin'])) ? $subTasks = $subTasksRaw->where('task_id', $taskId)->get() : $subTasks = $subTasksRaw->where('task_id', $taskId)->whereHas('task.coordinators', fn($q) => $q->where('user_id', $currentUser->id))->get();

            return SubTaskResource::collection($subTasks);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, int $taskId)
    {
        $currentUser = auth()->user();

        try {
            $task = Task::find($taskId);
            if (!$task) return response()->json(['status' => 'error', 'message' => 'Tarea no encontrada.'], 404);

            if (!$currentUser->hasRole(['super-admin', 'admin']) && !$task->coordinators()->where('user_id', $currentUser->id)->exists()) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);

            $data = SubTaskData::validateAndCreate($request->all());

            $subTask = SubTask::create([
                'task_id' => $task->id,
                'title' => $data->title,
                'description' => $data->description,
                'status_id' => $data->status_id,
                'dt_delivery_limit' => $data->dt_delivery_limit,
                'created_by' => $currentUser->id,
            ]);

            $subTask->load(['status', 'creator']);
            return response()->json(['status' => 'success', 'message' => 'Subtarea creada correctamente.', 'data' => new SubTaskResource($subTask)], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $currentUser = auth()->user();

        try {
            $subTask = SubTask::with(['task', 'status', 'creator', 'acceptor', 'decliner', 'updater'])->find($id);
            if (!$subTask) return response()->json(['status' => 'error', 'message' => 'Subtarea no encontrada.'], 404);

            if (!$currentUser->hasRole(['super-admin', 'admin']) && !$subTask->task->coordinators()->where('user_id', $currentUser->id)->exists()) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);

            return new SubTaskResource($subTask);
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

        try {
            $subTask = SubTask::with(['task', 'status', 'creator', 'acceptor', 'decliner', 'updater'])->find($id);
            if (!$subTask) return response()->json(['status' => 'error', 'message' => 'Subtarea no encontrada.'], 404);

            if (!$currentUser->hasRole(['super-admin', 'admin']) && !$subTask->task->coordinators()->where('user_id', $currentUser->id)->exists()) {
                return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);
            }

            $validator = Validator::make($request->all(), SubTaskData::rules($subTask->id), SubTaskData::messages());
            if ($validator->fails()) return response()->json(['status' => 'error', 'message' => 'Datos inválidos.', 'errors' => $validator->errors()], 400);

            $data = SubTaskData::from($validator->validated());

            $subTask->update([
                'title' => $data->title ?? $subTask->title,
                'description' => $data->description ?? $subTask->description,
                'status_id' => $data->status_id ?? $subTask->status_id,
                'dt_delivery_limit' => $data->dt_delivery_limit ?? $subTask->dt_delivery_limit,
                'updated_by' => $currentUser->id,
            ]);

            $subTask->load(['status', 'creator']);
            return response()->json(['status' => 'success', 'message' => 'Subtarea actualizada correctamente.', 'data' => new SubTaskResource($subTask)], 200);
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

        try {
            $subTask = SubTask::with(['task', 'status', 'creator', 'acceptor', 'decliner', 'updater'])->find($id);
            if (!$subTask) return response()->json(['status' => 'error', 'message' => 'Subtarea no encontrada.'], 404);

            if (!$currentUser->hasRole(['super-admin', 'admin']) && !$subTask->task->coordinators()->where('user_id', $currentUser->id)->exists()) {
                return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);
            }

            if ($subTask->files()->count() > 0) return response()->json(['status' => 'error', 'message' => 'No se puede eliminar la subtarea, debido a que contiene archivos. Elimínalos primero.'], 400);

            $subTask->delete();
            return response()->json(['status' => 'success', 'message' => 'Subtarea eliminada correctamente.'], 200);
        } catch (\Exception $e) {
            $errorCode = $e->errorInfo[1] ?? null;
            if ($errorCode === 1451 || $errorCode === 1217) {
                return response()->json(['status' => 'error', 'message' => 'No se puede eliminar la subtarea porque tiene registros asociados.'], 409);
            }

            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
