<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use \Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;

use App\Models\Task;
use App\Models\User;
use App\Models\Status;
use App\DTOs\TaskData;
use App\Http\Resources\TaskResource;

// envio de correos a usuarios por tareas asignadas y desasignadas
use Illuminate\Support\Facades\Mail;
use App\Mail\Task\TaskAssignmentMail;
use App\Mail\Task\TaskReviewRequestMail;
use App\Mail\Task\TaskStatusChangedMail;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $currentUser = auth()->user();

        try {
            $tasksRaw = Task::with(['status', 'creator', 'acceptor', 'decliner', 'updater', 'coordinators', 'files']);
            if ($currentUser->hasRole(['super-admin', 'admin'])) {
                $tasks = $tasksRaw->get();
            } else {
                $tasks = $tasksRaw->whereHas('coordinators', fn($q) => $q->where('user_id', $currentUser->id))->get();
            }
            return TaskResource::collection($tasks);
        } catch (QueryException $qe) {
            return response()->json(['status' => 'error', 'message' => 'Error de base de datos.', 'error' => $qe->getMessage()], 400);
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
            $request->merge(['created_by' => $currentUser->id]);
            $data = TaskData::validateWithId($request->all());

            $hasCoordinators = $request->has('coordinators_ids');
            $ids = $hasCoordinators
                ? collect((array) $request->input('coordinators_ids'))->filter()->map(fn($v) => (int) $v)->values()
                : collect();

            $this->validateCoordinators($ids);

            $task = Task::create([
                'title' => $data->title,
                'description' => $data->description,
                'status_id' => $data->status_id ?? Status::CREATED,
                'dt_delivery_limit' => $data->dt_delivery_limit,
                'created_by' => $currentUser->id,
            ]);

            if ($hasCoordinators) {

                $coordinatorsIds = $task->coordinators()->sync(
                    $ids->mapWithKeys(fn($id) => [
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

            $task->load(['status', 'creator', 'coordinators', 'files']);
            return response()->json(['status' => 'success', 'message' => 'Tarea creada correctamente.', 'data' => new TaskResource($task)], 200);
        } catch (ValidationException $ve) {
            return response()->json(['status' => 'error', 'message' => 'Datos inválidos.', 'errors' => $ve->errors()], 400);
        } catch (QueryException $qe) {
            return response()->json(['status' => 'error', 'message' => 'Error de base de datos.', 'error' => $qe->getMessage()], 400);
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
            $task = Task::with(['status', 'creator', 'acceptor', 'decliner', 'updater', 'coordinators', 'files'])->find($id);
            if (!$task) return response()->json(['status' => 'error', 'message' => 'Tarea no encontrada.'], 404);

            if (!$currentUser->hasRole(['super-admin', 'admin']) && !$task->coordinators->contains('id', $currentUser->id)) {
                return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);
            }
            return new TaskResource($task);
        } catch (QueryException $qe) {
            return response()->json(['status' => 'error', 'message' => 'Error de base de datos.', 'error' => $qe->getMessage()], 400);
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
            $task = Task::with(['status', 'creator', 'acceptor', 'decliner', 'updater', 'coordinators'])->find($id);
            if (!$task) return response()->json(['status' => 'error', 'message' => 'Tarea no encontrada.'], 404);

            $oldStatusId = $task->status_id;
            $oldStatusName = $task->status?->name;

            $data = TaskData::validateWithId($request->all(), $task->id);

            $hasCoordinators = $request->has('coordinators_ids');
            $ids = $hasCoordinators ? collect((array) $request->input('coordinators_ids'))->filter()->map(fn($v) => (int) $v)->values() : collect();

            $this->validateCoordinators($ids);

            $task->update([
                'title' => $data->title ?? $task->title,
                'description' => $data->description ?? $task->description,
                'status_id' => $data->status_id ?? $task->status_id,
                'dt_delivery_limit' => $data->dt_delivery_limit ?? $task->dt_delivery_limit,
                'updated_by' => $currentUser->id,
            ]);

            // notificar cambio de estado
            if ($oldStatusId !== $task->status_id) {
                $task->load('status');

                $superAdmins = User::role('super-admin')->get();
                $creator = $task->creator;
                $coordinators = $task->coordinators;

                $recipients = collect();
                if ($creator) $recipients->push($creator);
                $recipients = $recipients->concat($superAdmins)->concat($coordinators)->unique('id');

                foreach ($recipients as $recipient) {
                    Mail::to($recipient->email)->send(new TaskStatusChangedMail(
                        recipient: $recipient,
                        task: $task,
                        changedBy: $currentUser,
                        oldStatus: $oldStatusName ?? 'Desconocido',
                        newStatus: $task->status?->name ?? 'Desconocido',
                    ));
                }
            }

            if ($hasCoordinators) {
                $coordinatorsIds = $task->coordinators()->sync(
                    $ids->mapWithKeys(fn($id) => [
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

            $task->load(['status', 'creator', 'coordinators', 'files']);
            return response()->json(['status' => 'success', 'message' => 'Tarea actualizada correctamente.', 'data' => new TaskResource($task)], 200);
        } catch (ValidationException $ve) {
            return response()->json(['status' => 'error', 'message' => 'Datos inválidos.', 'errors' => $ve->errors()], 400);
        } catch (QueryException $qe) {
            return response()->json(['status' => 'error', 'message' => 'Error de base de datos.', 'error' => $qe->getMessage()], 400);
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

            if ($task->subtasks()->count() > 0) return response()->json(['status' => 'error', 'message' => 'No se puede eliminar la tarea porque tiene subtareas asociadas. Elimínalas primero.'], 409);

            if (in_array($task->status_id, [Status::IN_PROGRESS, Status::IN_REVIEW, Status::COMPLETED, Status::APPROVED])) return response()->json(['status' => 'error', 'message' => "No se puede eliminar ya que el estado: {$task->status->name}, no lo permite."], 409);

            $coordinators = $task->coordinators;
            $task->coordinators()->detach();
            $task->delete();

            foreach ($coordinators as $user) {
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

            // if ($task->status_id !== Status::COMPLETED) return response()->json(['status' => 'error', 'message' => 'La tarea debe estar completada para solicitar revisión.'], 400);

            $allCompleted = $task->subtasks()->where('status_id', '!=', Status::COMPLETED)->count() === 0;
            if (!$allCompleted) return response()->json(['status' => 'error', 'message' => 'Todas las subtareas deben estar completadas.'], 400);

            $task->status_id = Status::IN_REVIEW;
            $task->updated_by = $currentUser->id;
            $task->save();

            $task->load(['status', 'creator']);

            // notificar a super-admins, admin que asignó y coordinadores asignados
            $superAdmins = User::role('super-admin')->get();
            $assignedByUserIds = $task->coordinators()->withPivot('assigned_by')->get()->pluck('pivot.assigned_by')->unique();
            $assigners = User::whereIn('id', $assignedByUserIds)->get();
            $coordinators = $task->coordinators;
            $recipients = $superAdmins->concat($assigners)->concat($coordinators)->unique('id');

            foreach ($recipients as $recipient) {
                Mail::to($recipient->email)->send(new TaskReviewRequestMail(
                    requester: $currentUser,
                    recipient: $recipient,
                    task: $task,
                    action: 'requested',
                ));
            }

            return response()->json(['status' => 'success', 'message' => 'Solicitud de revisión enviada correctamente.'], 200);
        } catch (QueryException $qe) {
            return response()->json(['status' => 'error', 'message' => 'Error de base de datos.', 'error' => $qe->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    private function validateCoordinators(Collection $ids): void
    {
        if ($ids->isEmpty()) return;

        $users = User::whereIn('id', $ids)->get();

        $existingIds = $users->pluck('id');
        $notFound = $ids->diff($existingIds);
        if ($notFound->isNotEmpty()) {
            throw ValidationException::withMessages([
                'coordinators_ids' => 'Algunos de los coordinadores no fueron encontrados, intenta de nuevo. '
            ]);
        }

        $inactive = $users->where('active', false)->pluck('id');
        if ($inactive->isNotEmpty()) {
            throw ValidationException::withMessages([
                'coordinators_ids' => 'El o los coordinadores están inactivos.'
            ]);
        }

        $noRole = $users->reject(fn($u) => $u->hasRole('coordinador'))->pluck('id');
        if ($noRole->isNotEmpty()) {
            throw ValidationException::withMessages([
                'coordinators_ids' => 'Los siguientes usuarios no tienen el rol de coordinador.'
            ]);
        }
    }

    public function approveReview(Request $request, int $id)
    {
        $currentUser = auth()->user();
        if (!$currentUser->hasRole(['super-admin', 'admin'])) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);

        try {
            $request->validate([
                'action' => 'required|in:approved,rejected',
                'observation' => 'nullable|string|max:1000',
            ]);

            $task = Task::with('status')->find($id);
            if (!$task) return response()->json(['status' => 'error', 'message' => 'Tarea no encontrada.'], 404);

            if ($task->status_id !== Status::IN_REVIEW) return response()->json(['status' => 'error', 'message' => 'La tarea no está en proceso de revisión.'], 400);

            $task->status_id = $request->action === 'approved' ? Status::APPROVED : Status::REJECTED;
            if ($request->action === 'approved') {
                $task->accepted_by = $currentUser->id;
            } else {
                $task->declined_by = $currentUser->id;
            }
            $task->updated_by = $currentUser->id;
            if ($request->filled('observation')) {
                $task->observations = $request->observation;
            }
            $task->save();
            $task->load('status');

            // notificar a super-admins y coordinadores asignados
            $superAdmins = User::role('super-admin')->get();
            $coordinators = $task->coordinators;
            $recipients = $superAdmins->concat($coordinators)->unique('id');

            foreach ($recipients as $recipient) {
                Mail::to($recipient->email)->send(new TaskReviewRequestMail(
                    requester: $currentUser,
                    recipient: $recipient,
                    task: $task,
                    action: $request->action,
                ));
            }

            $mensaje = $request->action === 'approved' ? 'Revisión aprobada correctamente.' : 'Revisión rechazada correctamente.';
            return response()->json(['status' => 'success', 'message' => $mensaje], 200);
        } catch (QueryException $qe) {
            return response()->json(['status' => 'error', 'message' => 'Error de base de datos.', 'error' => $qe->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
