<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class FileData extends Data
{
    public function __construct(
        public ?int $task_id = null,
        public ?int $sub_task_id = null,
        public ?string $file_type = null,
        public ?string $file_name = null,
        public ?string $url = null,
        public ?int $uploaded_by = null,
    ) {}

    private const ALLOWED_EXTENSIONS = ['pdf', 'pptx', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif', 'webp'];


    public static function validateData(array $data, ?int $fileId = null): static
    {
        $rules = [
            'file' =>[
                $fileId ? 'nullable' : 'required',
                'file',
                'mimes:' . implode(',', self::ALLOWED_EXTENSIONS),
                'max:51200',
            ],
            'task_id' => [
                'required_without:sub_task_id',
                'integer',
                Rule::exists('tasks', 'id'),
            ],
            'sub_task_id' => [
                'required_without:task_id',
                'integer',
                Rule::exists('sub_tasks', 'id'),
            ],
            'file_type' => [
                'nullable',
                'string',
                'max:50',
            ],
            'file_name' => [
                'nullable',
                'string',
                'max:255',
            ],
            'url' => [
                'nullable',
                'string',
            ],
            'uploaded_by' => [
                'nullable',
                'integer',
                Rule::exists('users', 'id'),
            ],
        ];

        $messages = [
            '*.required' => 'El campo :attribute es obligatorio.',
            '*.integer' => 'El campo :attribute debe ser un ID numérico válido.',
            '*.string' => 'El campo :attribute debe ser una cadena de texto válida.',
            '*.exists' => 'El :attribute seleccionado no es válido o no existe.',
            '*.max' => 'El campo :attribute no debe superar el límite permitido.',

            'file.file' => 'El recurso subido debe ser un archivo válido.',
            'file.mimes' => 'El archivo debe tener una extensión válida (' . implode(', ', self::ALLOWED_EXTENSIONS) . ').',
            'file.max' => 'El archivo es demasiado pesado. El tamaño máximo permitido es de 50 MB.',

            'task_id.required_without' => 'Debes asignar este archivo a una tarea si no se ha especificado una subtarea.',
            'sub_task_id.required_without' => 'Debes asignar este archivo a una subtarea si no se ha especificado una tarea.',
        ];

        $attributes = [
            'file' => 'archivo',
            'task_id' => 'tarea',
            'sub_task_id' => 'subtarea',
            'file_type' => 'tipo de archivo',
            'file_name' => 'nombre del archivo',
            'url' => 'url del archivo',
            'uploaded_by' => 'usuario que sube el archivo',
        ];

        return static::from(Validator::validate($data, $rules, $messages, $attributes));
    }
}
