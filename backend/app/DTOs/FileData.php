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

    public static function rules(?int $fileId = null): array
    {
        return [
            'task_id' => ['nullable', 'integer', Rule::exists('tasks', 'id')],
            'sub_task_id' => ['nullable', 'integer', Rule::exists('sub_tasks', 'id')],
            'file_type' => [
                $fileId ? 'nullable' : 'required',
                'string',
                'max:50',
            ],
            'file_name' => [
                $fileId ? 'nullable' : 'required',
                'string',
                'max:255',
            ],
            'url' => [
                $fileId ? 'nullable' : 'required',
                'string',
            ],
            'uploaded_by' => [
                $fileId ? 'nullable' : 'required',
                'integer',
                Rule::exists('users', 'id'),
            ],
        ];
    }

    public static function messages(): array
    {
        return [
            'task_id.required' => 'La tarea es requerida.',
            'task_id.integer' => 'La tarea debe ser un ID válido.',
            'task_id.exists' => 'La tarea no existe.',
            'sub_task_id.integer' => 'La subtarea debe ser un ID válido.',
            'sub_task_id.exists' => 'La subtarea no existe.',
            'file_type.required' => 'El tipo de archivo es requerido.',
            'file_name.required' => 'El nombre del archivo es requerido.',
            'url.required' => 'La URL del archivo es requerida.',
            'uploaded_by.required' => 'El usuario que sube el archivo es requerido.',
            'uploaded_by.integer' => 'El usuario debe ser un ID válido.',
            'uploaded_by.exists' => 'El usuario no existe.',
        ];
    }

    public static function validateWithId(array $data, ?int $fileId = null): static
    {
        return static::from(Validator::validate($data, static::rules($fileId), static::messages()));
    }
}
