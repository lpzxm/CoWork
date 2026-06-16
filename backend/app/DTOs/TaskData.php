<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class TaskData extends Data
{
    public function __construct(
        public string $title,
        public ?string $description  = null,
        public ?int $status_id = null,
        public int $created_by,
        public ?int $accepted_by = null,
        public ?int $declined_by = null,
        public ?int $updated_by = null,
        public ?int $deleted_by = null,
        public ?Carbon $dt_delivery_limit = null,
    ) {}


    public static function rules(?int $taskId = null): array
    {
        return [
            'title' => [
                $taskId ? 'nullable' : 'required',
                'string',
                'max:255',
            ],
            'description' => [
                'nullable|string',
                'max:5000',
            ],
            'status_id' => [
                'nullable',
                'integer',
                Rule::exists('status', 'id'),
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
            'status_id.exists' => 'El status no existe.',
            'dt_delivery_limit.date' => 'La fecha de entrega debe ser una fecha valida.',
        ];
    }
}
