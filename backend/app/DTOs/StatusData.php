<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class StatusData extends Data
{
    public function __construct(
        public ?string $name = null,
        public ?string $color = null,
        public ?bool $active = null,
    ) {}

    public static function validateData(array $data, ?int $statusId = null): static
    {
        $rules = [
            'name' => [
                $statusId ? 'nullable' : 'required',
                'string',
                'max:255',
                Rule::unique('status', 'name')->ignore($statusId),
            ],
            'color' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('status', 'color')->ignore($statusId)
            ],
            'active' => ['nullable', 'boolean'],
        ];

        $messages = [
            '*.string' => 'El :attribute debe ser un texto válido.',
            '*.unique' => 'El :attribute ya está registrado.',
            'active.boolean' => 'El estado debe ser activo o inactivo.',
        ];

        $attributes = [
            'name' => 'nombre',
            'color' => 'color',
            'active' => 'activo',
        ];

        return static::from(Validator::validate($data, $rules, $messages, $attributes));
    }
}
