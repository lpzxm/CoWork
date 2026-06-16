<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

use App\Models\Status;
use App\DTOs\StatusData;
use App\Http\Resources\StatusResource;

class StatusController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $currentUser = auth()->user();
        
        return StatusResource::collection(Status::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $currentUser = auth()->user();
        if (!$currentUser->hasRole(['super-admin', 'admin'])) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);

        try {
            $data = StatusData::validateAndCreate($request->all());

            $status = Status::create([
                'name' => $data->name,
                'color' => $data->color,
                'active' => $data->active ?? true,
            ]);

            return response()->json(['status' => 'success', 'message' => 'Status creado correctamente.', 'data' => new StatusResource($status)], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'Error al crear el nuevo status. ', 'message' => $e->getMessage()], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $currentUser = auth()->user();
        try {
            $status = Status::find($id);
            if (!$status) return response()->json(['status' => 'error', 'message' => 'Status no encontrado.'], 404);
            return new StatusResource($status);
        } catch (\Exception $e) {
            return response()->json(['status' => 'Error al obtener el status. ', 'message' => $e->getMessage()], 400);
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
            $status = Status::find($id);
            if (!$status) return response()->json(['status' => 'error', 'message' => 'Status no encontrado.'], 404);

            $validator = Validator::make($request->all(), StatusData::rules($status->id), StatusData::messages());
            if ($validator->fails()) return response()->json(['status' => 'error', 'message' => 'Datos inválidos.', 'errors' => $validator->errors()], 400);

            $data = StatusData::from($validator->validated());

            $status->update([
                'name' => $data->name ?? $status->name,
                'color' => $data->color ?? $status->color,
                'active' => $data->active ?? $status->active,
            ]);
            return response()->json(['status' => 'success', 'message' => 'Status actualizado correctamente.', 'data' => new StatusResource($status)], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'Error al actualizar el status. ', 'message' => $e->getMessage()], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $currentUser = auth()->user();
        if (!$currentUser->hasRole('super-admin')) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);
        try {
            $status = Status::find($id);
            if (!$status) return response()->json(['status' => 'error', 'message' => 'Status no encontrado.'], 404);

            if($status->tasks()->count() > 0 || $status->subtasks()->count() > 0) {
                return response()->json(['status' => 'error', 'message' => 'No se puede eliminar el status porque tiene tareas o subtareas asociadas. Elimínalas primero.'], 409);
            }

            $status->delete();
            return response()->json(['status' => 'success', 'message' => 'Status eliminado correctamente.'], 200);
        } catch (\Exception $e) {
            $errorCode = $e->errorInfo[1] ?? null;
            if ($errorCode === 1451 || $errorCode === 1217) {
                return response()->json(['status' => 'error', 'message' => 'No se puede eliminar la tarea porque tiene registros asociados. Elimínalos primero.'], 409);
            }
            
            return response()->json(['status' => 'Error al eliminar el status. ', 'message' => $e->getMessage()], 400);
        }
    }
}
