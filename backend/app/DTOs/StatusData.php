<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;
use Illuminate\Validation\Rule;

class StatusData extends Data
{
    public function __construct(
        public ?string $name = null,
        public ?string $color = null,
        public ?bool $active = null,
    ) {}


    public static function rules(?int $statusId = null): array
    {
        return [
            'name' => [
                $statusId ? 'nullable' : 'required',
                'string',
                'max:255',
                Rule::unique('status', 'name')->ignore($statusId),
            ],
            'color' => ['nullable', 'string', 'max:50', Rule::unique('status', 'color')->ignore($statusId)],
            'active' => ['nullable', 'boolean'],
        ];
    }

    public static function messages(): array
    {
        return [
            'name.string' => 'El nombre debe ser un texto válido.',
            'name.unique' => 'El estado ya está registrado.',
            'color.string' => 'El color debe ser un texto valido.',
            'color.unique' => 'El color ya está registrado.',
            'active.boolean' => 'El estado debe ser activo o inactivo.',];
    }
}
