<?php

namespace App\DTOs;

use Spatie\LaravelData\Data;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class UserData extends Data
{
    public function __construct(
        public ?string $name = null,
        public ?string $email = null,
        public ?string $password = null,
        public ?bool $active = null,
        public ?string $role = null,

    ) {}

    public static function validateData(array $data, ?int $userId = null): static
    {
        $rules = [
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
                ? ['nullable', 'string', 'min:8', 'regex:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/']
                : ['required', 'string', 'min:8', 'regex:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/'],
            'active' => ['nullable', 'boolean'],
            'role' => ['nullable', 'string', Rule::exists('roles', 'name')],
        ];

        $messages = [
            '*.string' => 'El :attribute debe ser un texto válido.',
            '*.unique' => 'El :attribute ya está registrado.',
            'email.email' => 'El correo electrónico debe ser una dirección de correo válida.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.regex' => 'La contraseña debe contener al menos una letra minúscula, una letra mayúscula y un número y un carácter especial.',
            'role.exists' => 'El rol especificado no existe.',
        ];

        $attributes = [
            'name' => 'nombre',
            'email' => 'correo electronico',
            'password' => 'contraseña',
            'active' => 'estado',
            'role' => 'rol',
        ];

        return static::from(Validator::validate($data, $rules, $messages, $attributes));
    }
}
