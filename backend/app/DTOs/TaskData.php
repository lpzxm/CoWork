<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class TaskData extends Data
{
    public function __construct(
        public ?string $title = null,
        public ?string $description = null,
        public ?int $status_id = null,
        #[WithCast(DateTimeInterfaceCast::class, format: 'Y-m-d')]
        public ?Carbon $dt_delivery_limit = null,
        public ?int $created_by = null,
        public ?int $accepted_by = null,
        public ?int $declined_by = null,
        public ?int $updated_by = null,
        public ?int $deleted_by = null,
        public ?string $observations = null
    ) {}

    public static function validateData(array $data, ?int $taskId = null): static
    {
        $rules = [
            'title' => [
                $taskId ? 'nullable' : 'required',
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
            'status_id' => [
                'nullable',
                'integer',
                Rule::exists('status', 'id'),
            ],
            'dt_delivery_limit' => ['nullable', 'date', 'after_or_equal:today'],
        ];

        $messages = [
            '*.string' => 'El :attribute debe ser un texto válido.',
            '*.exists' => 'El :attribute no existe.',

            'title.required' => 'El titulo es obligatorio.',
            'title.max' => 'El titulo debe tener menos de 255 caracteres.',
            'description.max' => 'La descripcion debe tener menos de 5000 caracteres.',
            'dt_delivery_limit.date' => 'La fecha de entrega debe ser una fecha valida.',
        ];

        $attributes = [
            'title' => 'titulo',
            'description' => 'descripcion',
            'status_id' => 'estado',
            'created_by' => 'creador',
            'accepted_by' => 'aceptador',
            'declined_by' => 'rechazador',
            'updated_by' => 'actualizador',
            'dt_delivery_limit' => 'fecha de entrega',
        ];

        return static::from(Validator::validate($data, $rules, $messages, $attributes));
    }
}
