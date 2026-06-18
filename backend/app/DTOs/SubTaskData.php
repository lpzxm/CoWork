<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class SubTaskData extends Data
{

    public function __construct(
        public string $title,
        public ?string $description  = null,
        public ?int $created_by = null,
        public ?int $accepted_by = null,
        public ?int $declined_by = null,
        public ?int $updated_by = null,
        public ?int $deleted_by = null,
        public ?int $task_id = null,
        public ?int $status_id = null,
        #[WithCast(DateTimeInterfaceCast::class, format: 'Y-m-d')]
        public ?Carbon $dt_delivery_limit = null,
    ) {}


    public static function rules(?int $subTaskId = null): array
    {
        return [
            'title' => [
                $subTaskId ? 'nullable' : 'required',
                'string',
                'max:255',
            ],
            'description' => [
                'nullable',
                'string',
                'max:5000',
            ],
            'created_by' => ['nullable', 'integer', Rule::exists('users', 'id')],
            'accepted_by' => ['nullable', 'integer', Rule::exists('users', 'id')],
            'declined_by' => ['nullable', 'integer', Rule::exists('users', 'id')],
            'updated_by' => ['nullable', 'integer', Rule::exists('users', 'id')],
            'deleted_by' => ['nullable', 'integer', Rule::exists('users', 'id')],
            'status_id' => [
                'nullable',
                'integer',
                Rule::exists('status', 'id'),
            ],
            'task_id' => [
                'nullable',
                'integer',
                Rule::exists('tasks', 'id'),
            ],
            'dt_delivery_limit' => ['nullable', 'date'],
        ];
    }

    public static function messages(): array
    {
        return [
            'title.required' => 'El titulo es obligatorio.',
            'title.string' => 'El titulo debe ser un texto válido.',
            'title.max' => 'El titulo debe tener menos de 255 caracteres.',
            'description.string' => 'La descripcion debe ser un texto valido.',
            'created_by.exists' => 'El creador no existe.',
            'accepted_by.exists' => 'El aceptador no existe.',
            'declined_by.exists' => 'El rechazador no existe.',
            'updated_by.exists' => 'El actualizador no existe.',
            'deleted_by.exists' => 'El eliminador no existe.',
            'task_id.exists' => 'La tarea no existe.',
            'status_id.exists' => 'El status no existe.',
            'dt_delivery_limit.date' => 'La fecha de entrega debe ser una fecha valida.',
        ];
    }

    public static function validateWithId(array $data, ?int $subTaskId = null): static
    {
        return static::from(Validator::validate($data, static::rules($subTaskId), static::messages()));
    }
}
