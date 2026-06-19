<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\UserResource;
use Mail;

// Models
use App\Models\User;
use App\Models\VerifyCode;
use App\Mail\User\UserVerificationCodeMail;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        try {
            // mensajes de validacion personalizados para cada campo
            $messages = [
                'name.required' => 'El nombre es obligatorio.',
                'name.unique' => 'El nombre ya está registrado.',
                'email.required' => 'El correo electrónico es obligatorio.',
                'email.email' => 'El correo electrónico debe ser una dirección de correo válida.',
                'email.unique' => 'El correo electrónico ya está registrado.',
                'password.required' => 'La contraseña es obligatoria.',
                'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
                'password.regex' => 'La contraseña debe contener al menos una letra minúscula, una letra mayúscula y un número y un carácter especial.',
                'role.string' => 'El rol debe ser un texto válido.',
                'role.exists' => 'El rol especificado no existe.',
            ];

            // validacion de campos recibidos en request para registro de usuario
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255|unique:users',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|regex:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/',
                'role' => 'nullable|string|exists:roles,name',
            ], $messages);

            if ($validator->fails()) {
                return response()->json(['status' => 'error', 'message' => $validator->errors()->first()], 400);
            }

            // crear nuevo usuario mediante datos recibidos en request
            $user = \App\Models\User::factory()->create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password,
                'active' => $request->has('active') ? $request->active : true,
            ]);
            $role = $request->has('role') ? $request->role : 'super-admin';
            $user->assignRole($role); // asignar rol validado o super-admin a usuario registrado

            return response()->json(['status' => 'success', 'message' => 'Usuario registrado correctamente.', 'data' => new UserResource($user)], 200);
        } catch (QueryException $qe) {
            return response()->json(['status' => 'error', 'message' => 'Error de base de datos.', 'error' => $qe->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function login(Request $request): JsonResponse
    {
        try {
            $rules = [
                'email' => 'required|email',
                'password' => 'required|string|min:8',
            ];

            $messages = [
                'email.required' => 'El correo électronico es obligatorio.',
                'email.email' => 'El correo électronico debe ser una direccion de correo electronico valida.',
                'password.required' => 'La contraseña es obligatoria.',
                'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            ];

            $validator = Validator::make($request->all(), $rules, $messages);
            if ($validator->fails()) return response()->json(['status' => 'error', 'message' => $validator->errors()->first()], 400);

            $user = User::where('email', $request->email)->first();
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['status' => 'error', 'message' => 'Credenciales inválidas.'], 401);
            }

            if (!$user->active) {
                return response()->json(['status' => 'error', 'message' => 'El usuario se encuentra desactivado.'], 401);
            }

            VerifyCode::where(['user_id' => $user->id, 'type' => 'login', 'used_at' => null])->update(['used_at' => now()]);
            $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            VerifyCode::create([
                'user_id' => $user->id,
                'code' => $code,
                'type' => 'login',
                'expires_at' => now()->addMinutes(10),
            ]);

            Mail::to($user->email)->send(new UserVerificationCodeMail(name: $user->name, code: $code));
            $user->auditRequestToken('2fa_code');

            return response()->json(['status' => 'success', 'message' => 'Codigo de verificación enviado, revisa tu email.', 'step' => 'verify', 'email' => $user->email], 200);
        } catch (QueryException $qe) {
            return response()->json(['status' => 'error', 'message' => 'Error de base de datos.', 'error' => $qe->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }



    public function verifyToken(Request $request): JsonResponse
    {
        try {
            $rules = [
                'email' => 'required|email|exists:users,email',
                'code' => 'required|string|size:6',
            ];

            $messages = [
                'email.required' => 'El correo electrónico es obligatorio.',
                'email.email' => 'El correo electrónico debe ser una dirección de correo electrónico válida.',
                'email.exists' => 'El correo electrónico especificado no existe.',
                'code.required' => 'El código de verificación es obligatorio.',
                'code.size' => 'El código de verificación debe tener 6 caracteres.',
            ];

            $validator = Validator::make($request->all(), $rules, $messages);
            if ($validator->fails()) return response()->json(['status' => 'error', 'message' => 'Datos inválidos.', 'errors' => $validator->errors()], 400);

            $user = User::where(['email' => $request->email])->first();
            if (!$user || !$user->active) return response()->json(['status' => 'error', 'message' => 'El usuario se encuentra desactivado.'], 400);

            $code = VerifyCode::where(['user_id' => $user->id, 'type' => 'login', 'code' => $request->code, 'used_at' => null])->latest()->first();
            if (!$code || !$code->isValid()) return response()->json(['status' => 'error', 'message' => 'El codigo de verificación es incorrecto.'], 400);

            $token = $user->createToken('auth_token')->accessToken;
            $user->email_verified_at = now();
            $user->save();
            $user->auditLogin();

            return response()->json(['status' => 'success', 'message' => 'Verificado correctamente.', 'token' => $token, 'data' => new UserResource($user)], 200);
        } catch (QueryException $qe) {
            return response()->json(['status' => 'error', 'message' => $qe->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function sendTwoFactorExpiresAt(Request $request): JsonResponse
    {
        try {
            $tk = $request->input('tk');
            $email = $tk ?: $request->input('email');

            if (!$email) {
                return response()->json(['status' => 'error', 'message' => 'Identificador requerido.'], 400);
            }

            $user = User::where('email', $email)->first();
            if (!$user) return response()->json(['status' => 'error', 'message' => 'Usuario no encontrado.'], 404);

            $code = VerifyCode::where(['user_id' => $user->id, 'type' => 'login', 'used_at' => null])->latest()->first();

            if (!$code) {
                return response()->json(['status' => 'error', 'message' => 'No hay un código de verificación activo.'], 404);
            }

            return response()->json([
                'expires_at' => $code->expires_at->toISOString(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $user->tokens()->delete();
            $user->auditLogout();

            return response()->json(['status' => 'success', 'message' => 'Usuario deslogueado correctamente.'], 200);
        } catch (QueryException $qe) {
            return response()->json(['status' => 'error', 'message' => 'Error de base de datos.', 'error' => $qe->getMessage()], 400);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}
