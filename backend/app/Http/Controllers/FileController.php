<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\QueryException;

use App\Models\Task;
use App\Models\SubTask;
use App\Models\File;
use App\DTOs\FileData;
use App\Http\Resources\FileResource;

class FileController extends Controller
{
    private const MIME_MAP = [
        'pdf' => 'application/pdf',
        'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'doc' => 'application/msword',
        'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls' => 'application/vnd.ms-excel',
        'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'gif' => 'image/gif',
        'webp' => 'image/webp',
    ];

    private const ALLOWED_EXTENSIONS = ['pdf', 'pptx', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif', 'webp'];

    public function store(Request $request)
    {
        $currentUser = auth()->user();
        if (!$currentUser->hasRole(['super-admin', 'admin', 'coordinador'])) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);

        try {
            $request->validate([
                'file' => 'required|file|mimes:' . implode(',', self::ALLOWED_EXTENSIONS) . '|max:51200',
                'task_id' => 'required_without:sub_task_id|integer|exists:tasks,id',
                'sub_task_id' => 'required_without:task_id|integer|exists:sub_tasks,id',
            ]);

            $taskId = $request->input('task_id');
            $subTaskId = $request->input('sub_task_id') ?? null;

            if ($taskId) {
                $task = Task::find($taskId);
                if (!$task) return response()->json(['status' => 'error', 'message' => 'Tarea no encontrada.'], 404);

                if (!$currentUser->hasRole(['super-admin', 'admin']) && !$task->coordinators->contains('id', $currentUser->id)) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);
            }

            if ($subTaskId) {
                $subTask = SubTask::with('task')->find($subTaskId);
                if (!$subTask) return response()->json(['status' => 'error', 'message' => 'Subtarea no encontrada.'], 404);

                if (!$currentUser->hasRole(['super-admin', 'admin']) && !$subTask->task->coordinators->contains('id', $currentUser->id)) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);

                if (!$taskId) {
                    $taskId = $subTask->task_id;
                }
            }

            $uploaded = $request->file('file');
            $originalName = $uploaded->getClientOriginalName();
            $extension = $uploaded->getClientOriginalExtension();
            $storedName = time() . '_' . uniqid() . '.' . $extension;

            $path = $uploaded->storeAs('files', $storedName, 'public');

            $data = FileData::validateWithId([
                'task_id' => $taskId,
                'sub_task_id' => $subTaskId ?? null,
                'file_type' => $extension,
                'file_name' => $originalName,
                'url' => $path,
                'uploaded_by' => $currentUser->id,
            ]);

            $file = File::create($data->toArray());
            $file->load('uploader');

            return response()->json(['status' => 'success', 'message' => 'Archivo subido correctamente.', 'data' => new FileResource($file)], 200);
        } catch (ValidationException $ve) {
            return response()->json(['status' => 'error', 'message' => 'Datos inválidos.', 'errors' => $ve->errors()], 400);
        } catch (QueryException $qe) {
            return response()->json(['status' => 'error', 'message' => 'Error de base de datos.', 'error' => $qe->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function show(int $id)
    {
        try {
            $file = File::with('uploader', 'task', 'task.coordinators')->find($id);
            if (!$file) return response()->json(['status' => 'error', 'message' => 'Archivo no encontrado.'], 404);

            $currentUser = auth()->user();
            $task = $file->task;

            if (!$currentUser->hasRole(['super-admin', 'admin']) && !$task->coordinators->contains('id', $currentUser->id)) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);
            

            if (!Storage::disk('public')->exists($file->url)) 
                return response()->json(['status' => 'error', 'message' => 'El archivo no existe en el servidor.'], 404);
            

            $mimeType = self::MIME_MAP[$file->file_type] ?? 'application/octet-stream';

            return Storage::disk('public')->download($file->url, $file->file_name, [
                'Content-Type' => $mimeType,
                'Content-Disposition' => in_array($file->file_type, ['jpg', 'jpeg', 'png', 'gif', 'webp'])
                    ? 'inline'
                    : 'attachment',
            ]);
        } catch (QueryException $qe) {
            return response()->json(['status' => 'error', 'message' => 'Error de base de datos.', 'error' => $qe->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function destroy(int $id)
    {
        $currentUser = auth()->user();
        if (!$currentUser->hasRole(['super-admin', 'admin', 'coordinador'])) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);
        
        try {
            $file = File::with('task')->find($id);
            if (!$file) return response()->json(['status' => 'error', 'message' => 'Archivo no encontrado.'], 404);

            $task = $file->task;

            if (!$currentUser->hasRole(['super-admin', 'admin']) && !$task->coordinators()->where('user_id', $currentUser->id)->exists()) return response()->json(['status' => 'error', 'message' => 'No autorizado.'], 403);
            

            if (Storage::disk('public')->exists($file->url)) { Storage::disk('public')->delete($file->url); }

            $file->delete();

            return response()->json(['status' => 'success', 'message' => 'Archivo eliminado correctamente.'], 200);
        } catch (QueryException $qe) {
            return response()->json(['status' => 'error', 'message' => 'Error de base de datos.', 'error' => $qe->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
