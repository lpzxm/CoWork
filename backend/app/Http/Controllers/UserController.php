<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

// models y DTO
use App\Models\User;
use App\Http\Resources\UserResource;
use App\DTOs\UserData;

// Mails y service
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
            // validacion de campos recibidos en request para registro de usuario
            $plainPassword = User::makeRandomPassword();
            $request->merge(['password' => $plainPassword]);
            $data = UserData::validateWithId($request->all());

            $role = $data->role ?? 'coordinador';
            if ($currentUser->hasRole('admin') && $role !== 'coordinador') return response()->json(['status' => 'error', 'message' => 'Solo puedes asignar rol de coordinador, selecciona uno correcto.'], 403);

            // crear nuevo usuario mediante datos recibidos en request
            $user = \App\Models\User::create([
                'name' => $data->name,
                'email' => $data->email,
                'password' => $plainPassword,
                'active' => $data->active ?? true,
            ]);

            Mail::to($user->email)->send(new UserCredentialsMail(name: $user->name, email: $user->email, plainPassword: $plainPassword));

            $user->assignRole($role); // asignar rol validado o super-admin a usuario registrado

            return response()->json(['status' => 'success', 'message' => 'Usuario registrado correctamente.', 'data' => new UserResource($user)], 200);
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
            $user = User::find($id);
            if (!$user) return response()->json(['status' => 'error', 'message' => 'Usuario no encontrado.'], 404);
            if ($currentUser->hasRole('admin') && $user->hasRole('super-admin')) return response()->json(['status' => 'error', 'message' => 'No autorizado para modificar este usuario.'], 403);

            $data = UserData::validateWithId($request->all(), $user->id);

            $role = $data->role ?? $user->getRoleNames()->first();
            if ($currentUser->hasRole('admin') && $role !== 'coordinador') return response()->json(['status' => 'error', 'message' => 'Solo puedes asignar rol de coordinador, selecciona uno correcto.'], 403);

            $user->updateOrFail([
                'name' => $data->name ?? $user->name,
                'email' => $data->email ?? $user->email,
                'password' => $data->password ? Hash::make($data->password) : $user->password,
                'active' => $data->active ?? $user->active,
            ]);

            if ($user->wasChanged('active') && !$user->active) $user->tokens()->delete();

            $user->syncRoles($role); // asignar rol en base a update
            return response()->json(['status' => 'success', 'message' => 'Usuario actualizado correctamente.', 'data' => new UserResource($user)], 200);
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
            $user = User::find($id);
            if (!$user) return response()->json(['status' => 'error', 'message' => 'Usuario no encontrado.'], 404);
            if ($user->id === $currentUser->id) return response()->json(['status' => 'error', 'message' => 'No puedes eliminar tu propio usuario.'], 403);
            if ($currentUser->hasRole('admin') && $user->getRoleNames()->first() !== 'coordinador') return response()->json(['status' => 'error', 'message' => 'No autorizado para eliminar este usuario.'], 403);


            if ($user->createdTasks()->count() > 0 || $user->assignedTasks()->count() > 0) {
                return response()->json(['status' => 'error', 'message' => 'No se puede eliminar el usuario porque tiene tareas o subtareas asociadas. Elimínalas primero.'], 409);
            }

            $user->roles()->detach(); // eliminar roles asignados al usuario antes de eliminarlo
            $user->tokens()->delete(); // eliminar tokens de acceso del usuario para revocar sesiones activas
            $user->delete();

            return response()->json(['status' => 'success', 'message' => 'Usuario eliminado correctamente.'], 200);
        } catch (QueryException $qe) {
            $errorCode = $qe->errorInfo[1] ?? null;
            if ($errorCode === 1451 || $errorCode === 1217) {
                return response()->json(['status' => 'error', 'message' => 'No se puede eliminar el usuario porque tiene registros asociados. Elimínalos primero.'], 409);
            }

            return response()->json(['status' => 'error', 'message' => $qe->getMessage()], 400);
        } catch (\Exception $e) {
            $errorCode = $e->errorInfo[1] ?? null;
            if ($errorCode === 1451 || $errorCode === 1217) {
                return response()->json(['status' => 'error', 'message' => 'No se puede eliminar el usuario porque tiene registros asociados. Elimínalos primero.'], 409);
            }

            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
