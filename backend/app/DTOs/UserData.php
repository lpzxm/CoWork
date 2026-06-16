<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;
use Illuminate\Validation\Rule;

class UserData extends Data
{
    public function __construct(
        public ?string $name = null,
        public ?string $email = null,
        public ?string $password = null,
        public ?bool $active = null,
        public ?string $role = null,

    ) {}

    public static function rules(?int $userId = null): array
    {
        return [
            'name' => [
                $userId ? 'nullable' : 'required',
                'string',
                'max:255',
                Rule::unique('users', 'name')->ignore($userId),
            ],
            'email' => [
                $userId ? 'nullable' : 'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'password' => $userId
                ? ['nullable', 'string', 'min:8', 'regex:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/']
                : ['required', 'string', 'min:8', 'regex:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/'],
            'active' => ['nullable', 'boolean'],
            'role' => ['nullable', 'string', Rule::exists('roles', 'name')],
        ];
    }

    public static function messages(): array
    {
        return [
            'name.string' => 'El nombre debe ser un texto válido.',
            'name.unique' => 'El nombre ya está registrado.',
            'email.string' => 'El correo electrónico debe ser un texto válido.',
            'email.email' => 'El correo electrónico debe ser una dirección de correo válida.',
            'email.unique' => 'El correo electrónico ya está registrado.',
            'password.string' => 'La contraseña debe ser un texto válido.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.regex' => 'La contraseña debe contener al menos una letra minúscula, una letra mayúscula y un número y un carácter especial.',
            'role.string' => 'El rol debe ser un texto válido.',
            'role.exists' => 'El rol especificado no existe.',
        ];
    }
}
