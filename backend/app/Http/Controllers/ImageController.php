<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Exception;

class ImageController extends Controller
{
    public function show(string $filename)
    {
        try {
            $path = 'images/general/' . $filename;

            if (!Storage::disk('public')->exists($path)) return response()->json(['status' => 'error', 'message' => 'Imagen no encontrada.'], 404);
            
            $file = Storage::disk('public')->get($path);
            $mime = Storage::disk('public')->mimeType($path);

            return response($file, 200)->header('Content-Type', $mime);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Error al obtener la imagen.'], 400);
        }
    }
}
