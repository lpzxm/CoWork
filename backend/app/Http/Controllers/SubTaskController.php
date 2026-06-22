<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Exception;

// Models
use App\Models\Status;
use App\Models\Task;
use App\Models\SubTask;
use App\Models\User;

// DTOs
use App\DTOs\SubTaskData;

// Resources
use App\Http\Resources\SubTaskResource;

// Mail
use Mail;
use App\Mail\Task\SubTaskCreatedMail;

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

            $subTasksRaw = SubTask::with(['task', 'status', 'creator', 'acceptor', 'decliner', 'updater', 'files', 'files.uploader']);

            if ($currentUser->hasRole(['super-admin', 'admin'])) {
                $subTasks = $subTasksRaw->where('task_id', $taskId)->get();
            } else {
                $subTasks = $subTasksRaw->where('task_id', $taskId)->whereHas('task.coordinators', fn($q) => $q->where('user_id', $currentUser->id))->get();
            }

            return SubTaskResource::collection($subTasks);
        } catch (QueryException $qe) {
            return response()->json(['status' => 'error', 'message' => $qe->getMessage()], 400);
        } catch (Exception $e) {
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

            if ($task->dt_delivery_limit && $task->dt_delivery_limit->isBefore(now()->startOfDay())) {
                return response()->json(['status' => 'error', 'message' => 'No se puede crear subtareas en una tarea vencida.'], 400);
            }

            if (!$currentUser->hasRole(['super-admin', 'admin']) && !$task->coordinators->contains('id', $currentUser->id)) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);

            if (in_array($task->status_id, [Status::APPROVED, Status::REJECTED])) return response()->json(['status' => 'error', 'message' => "No se puede crear subtareas en el estado: {$task->status->name}, no lo permite."], 409);

            $data = SubTaskData::validateData($request->all());

            DB::beginTransaction();
            $subTask = SubTask::create([
                'task_id' => $task->id,
                'title' => $data->title,
                'description' => $data->description,
                'status_id' => $data->status_id ?? 1,
                'dt_delivery_limit' => $data->dt_delivery_limit,
                'created_by' => $currentUser->id,
            ]);

            $subTask->load(['status', 'creator', 'task.status']);

            $superAdmins = User::role('super-admin')->get();
            $admins = User::role('admin')->get();
            $coordinators = $task->coordinators;
            $recipients = $superAdmins->concat($admins)->concat($coordinators)->unique('id')->reject(fn($u) => $u->id === $currentUser->id);

            foreach ($recipients as $recipient) {
                Mail::to($recipient->email)->send(new SubTaskCreatedMail(
                    recipient: $recipient,
                    task: $task,
                    subTask: $subTask,
                    creator: $currentUser,
                ));
            }

            DB::commit();

            return response()->json(['status' => 'success', 'message' => 'Subtarea creada correctamente.', 'data' => new SubTaskResource($subTask)], 200);
        } catch (ValidationException $ve) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Datos inválidos.', 'errors' => $ve->errors()], 400);
        } catch (QueryException $qe) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $qe->getMessage()], 400);
        } catch (Exception $e) {
            DB::rollBack();
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
            $subTask = SubTask::with(['task', 'status', 'creator', 'acceptor', 'decliner', 'updater', 'files', 'files.uploader'])->find($id);
            if (!$subTask) return response()->json(['status' => 'error', 'message' => 'Subtarea no encontrada.'], 404);

            if (!$currentUser->hasRole(['super-admin', 'admin']) && !$subTask->task->coordinators->contains('id', $currentUser->id)) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);

            return new SubTaskResource($subTask);
        } catch (QueryException $qe) {
            return response()->json(['status' => 'error', 'message' => 'Error de base de datos.', 'error' => $qe->getMessage()], 400);
        } catch (Exception $e) {
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
            $subTask = SubTask::with(['task', 'status', 'creator', 'acceptor', 'decliner', 'updater', 'files', 'files.uploader'])->find($id);
            if (!$subTask) return response()->json(['status' => 'error', 'message' => 'Subtarea no encontrada.'], 404);

            $task = Task::find($subTask->task_id);
            if (!$task) return response()->json(['status' => 'error', 'message' => 'Tarea no encontrada.'], 404);

            if ($subTask->dt_delivery_limit && $task->dt_delivery_limit->isBefore(now()->startOfDay()) && !$currentUser->hasRole(['super-admin'])) {
                return response()->json(['status' => 'error', 'message' => 'No se puede modificar una subtarea vencida.'], 400);
            }

            if (!$currentUser->hasRole(['super-admin', 'admin']) && !$subTask->task->coordinators->contains('id', $currentUser->id)) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);

            $data = SubTaskData::validateData($request->all(), $subTask->id);

            $subTask->title = $data->title ?? $subTask->title;
            $subTask->description = $data->description ?? $subTask->description;
            $subTask->status_id = $data->status_id ?? $subTask->status_id;
            $subTask->dt_delivery_limit = $data->dt_delivery_limit ?? $subTask->dt_delivery_limit;
            $subTask->updated_by = $currentUser->id;

            if (!$subTask->isDirty()) return response()->json(['status' => 'error', 'message' => 'No se realizaron cambios.'], 400);

            $subTask->save();

            $subTask->load(['status', 'creator', 'files.uploader']);
            return response()->json(['status' => 'success', 'message' => 'Subtarea actualizada correctamente.', 'data' => new SubTaskResource($subTask)], 200);
        } catch (ValidationException $ve) {
            return response()->json(['status' => 'error', 'message' => 'Datos inválidos.', 'errors' => $ve->errors()], 400);
        } catch (QueryException $qe) {
            return response()->json(['status' => 'error', 'message' => $qe->getMessage()], 400);
        } catch (Exception $e) {
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
            $subTask = SubTask::with(['task', 'files'])->find($id);
            if (!$subTask) return response()->json(['status' => 'error', 'message' => 'Subtarea no encontrada.'], 404);

            if (!$currentUser->hasRole(['super-admin', 'admin']) && !$subTask->task->coordinators->contains('id', $currentUser->id)) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);

            if ($subTask->files()->count() > 0) return response()->json(['status' => 'error', 'message' => 'No se puede eliminar la subtarea, debido a que contiene archivos. Elimínalos primero.'], 400);

            $subTask->delete();

            return response()->json(['status' => 'success', 'message' => 'Subtarea eliminada correctamente.'], 200);
        } catch (QueryException $qe) {
            $errorCode = $qe->errorInfo[1] ?? null;
            if ($errorCode === 1451 || $errorCode === 1217) {
                return response()->json(['status' => 'error', 'message' => 'No se puede eliminar la subtarea porque tiene registros asociados.'], 409);
            }

            return response()->json(['status' => 'error', 'message' => $qe->getMessage()], 400);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
