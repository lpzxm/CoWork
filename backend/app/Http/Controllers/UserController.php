<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;
use Exception;

// models
use App\Models\User;
use App\Models\Task;
use App\Models\SubTask;
use App\Models\CoordinatorTask;

// DTOs
use App\DTOs\UserData;

// Resources
use App\Http\Resources\UserResource;

// Mails
use Mail;
use App\Mail\User\UserCredentialsMail;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $currentUser = auth()->user();
        if (!$currentUser->hasRole(['super-admin', 'admin'])) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);

        try {
            $query = User::with('roles');

            if ($currentUser->hasRole('admin')) {
                $query->whereDoesntHave('roles', function ($q) {
                    $q->where('name', 'super-admin');
                });
            }

            return UserResource::collection($query->get());
        } catch (Exception $e) {
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
            $plainPassword = User::makeRandomPassword();
            $request->merge(['password' => $plainPassword]);

            $data = UserData::validateData($request->all());

            $role = $data->role ?? 'coordinador';
            if ($currentUser->hasRole('admin') && $role !== 'coordinador') return response()->json(['status' => 'error', 'message' => 'Solo puedes asignar rol de coordinador, selecciona uno correcto.'], 403);

            DB::beginTransaction();

            // crear nuevo usuario mediante datos recibidos en request
            $user = User::create([
                'name' => $data->name,
                'email' => $data->email,
                'password' => $plainPassword,
                'active' => $data->active ?? true,
            ]);

            Mail::to($user->email)->send(new UserCredentialsMail(name: $user->name, email: $user->email, plainPassword: $plainPassword));

            $user->assignRole($role); // asignar rol validado o super-admin a usuario registrado

            DB::commit();

            return response()->json(['status' => 'success', 'message' => 'Usuario registrado correctamente.', 'data' => new UserResource($user)], 200);
        } catch (ValidationException $ve) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Datos inválidos.', 'errors' => $ve->errors()], 400);
        } catch (QueryException $qe) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Error de base de datos.', 'error' => $qe->getMessage()], 400);
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
        try {
            $currentUser = auth()->user();
            $user = null;
            if (!$currentUser->hasRole(['super-admin', 'admin'])) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);
            $query = User::with('roles');
            if ($currentUser->hasRole('admin')) {
                $user = $query->where('id', $id)->whereDoesntHave('roles', function ($q) {
                    $q->where('name', 'super-admin');
                })->first();
            } else if ($currentUser->hasRole('super-admin')) {
                $user = $query->find($id);
            }

            if (!$user) return response()->json(['status' => 'error', 'message' => 'Usuario no encontrado.'], 404);
            return new UserResource($user);
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
        if (!$currentUser->hasRole(['super-admin', 'admin'])) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);
        try {
            $user = User::find($id);
            if (!$user) return response()->json(['status' => 'error', 'message' => 'Usuario no encontrado.'], 404);
            if ($currentUser->hasRole('admin') && $user->hasRole('super-admin')) return response()->json(['status' => 'error', 'message' => 'No autorizado para modificar este usuario.'], 403);

            $plainPassword = User::makeRandomPassword();
            $request->merge(['password' => $plainPassword]);
            $data = UserData::validateData($request->all(), $user->id);

            $role = $data->role ?? $user->getRoleNames()->first();
            if ($currentUser->hasRole('admin') && $role !== 'coordinador') return response()->json(['status' => 'error', 'message' => 'Solo puedes asignar rol de coordinador, selecciona uno correcto.'], 403);


            DB::beginTransaction();
            // actualizar usuario con los datos recibidos en la request
            $user->name = $data->name ?? $user->name;
            $user->email = $data->email ?? $user->email;
            $user->active = $data->active ?? $user->active;

            // checar si se cambio algun dato y no se realizo ninguna modificacion
            $roleChanged = $user->getRoleNames()->first() !== $role;
            if (!$user->isDirty() && !$roleChanged) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No se realizó ninguna modificación ya que los datos enviados son idénticos a los actuales.'
                ], 409);
            }

            // checar si se ha cambiado el email y enviar nuevas credenciales de seguridad
            if ($user->isDirty('email')) {
                $user->password = $plainPassword;
                Mail::to($user->email)->send(new UserCredentialsMail(name: $user->name, email: $user->email, plainPassword: $plainPassword));
                $user->tokens()->delete();
            }

            if ($user->isDirty('active') && !$user->active) $user->tokens()->delete();

            $user->save();
            DB::commit();

            $user->syncRoles($role); // asignar rol en base a update

            return response()->json(['status' => 'success', 'message' => 'Usuario actualizado correctamente.', 'data' => new UserResource($user)], 200);
        } catch (ValidationException $ve) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Datos inválidos.', 'errors' => $ve->errors()], 400);
        } catch (QueryException $qe) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => 'Error de base de datos.', 'error' => $qe->getMessage()], 400);
        } catch (Exception $e) {
            DB::rollBack();
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
            $user = User::find($id);
            if (!$user) return response()->json(['status' => 'error', 'message' => 'Usuario no encontrado.'], 404);
            if ($user->id === $currentUser->id) return response()->json(['status' => 'error', 'message' => 'No puedes eliminar tu propio usuario.'], 403);
            if ($currentUser->hasRole('admin') && $user->getRoleNames()->first() !== 'coordinador') return response()->json(['status' => 'error', 'message' => 'No autorizado para eliminar este usuario.'], 403);


            if ($user->createdTasks()->count() > 0) {
                return response()->json(['status' => 'error', 'message' => 'No se puede eliminar el usuario porque creó tareas. Reasígnelas primero.'], 409);
            }
            if (SubTask::where('created_by', $user->id)->count() > 0) {
                return response()->json(['status' => 'error', 'message' => 'No se puede eliminar el usuario porque creó subtareas. Reasígnelas primero.'], 409);
            }
            if ($user->uploadedFiles()->count() > 0) {
                return response()->json(['status' => 'error', 'message' => 'No se puede eliminar el usuario porque subió archivos. Elimínelos primero.'], 409);
            }

            DB::beginTransaction();

            // Limpiar referencias anulables
            Task::where('accepted_by', $user->id)->update(['accepted_by' => null]);
            Task::where('declined_by', $user->id)->update(['declined_by' => null]);
            Task::where('updated_by', $user->id)->update(['updated_by' => null]);
            Task::where('deleted_by', $user->id)->update(['deleted_by' => null]);

            SubTask::where('accepted_by', $user->id)->update(['accepted_by' => null]);
            SubTask::where('declined_by', $user->id)->update(['declined_by' => null]);
            SubTask::where('updated_by', $user->id)->update(['updated_by' => null]);
            SubTask::where('deleted_by', $user->id)->update(['deleted_by' => null]);

            CoordinatorTask::where('assigned_by', $user->id)->delete();
            $user->assignedTasks()->detach();

            $user->roles()->detach();
            $user->tokens()->delete();
            $user->delete();

            DB::commit();
            return response()->json(['status' => 'success', 'message' => 'Usuario eliminado correctamente.'], 200);
        } catch (QueryException $qe) {
            DB::rollBack();            
            $errorCode = $qe->errorInfo[1] ?? null;
            if ($errorCode === 1451 || $errorCode === 1217) {
                return response()->json(['status' => 'error', 'message' => 'No se puede eliminar el usuario porque tiene registros asociados. Elimínalos primero.'], 409);
            }

            return response()->json(['status' => 'error', 'message' => $qe->getMessage()], 400);
        } catch (Exception $e) {
            DB::rollBack();
            $errorCode = $e->errorInfo[1] ?? null;
            if ($errorCode === 1451 || $errorCode === 1217) {
                return response()->json(['status' => 'error', 'message' => 'No se puede eliminar el usuario porque tiene registros asociados. Elimínalos primero.'], 409);
            }

            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
