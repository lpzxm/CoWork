<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Llamado a los seeder de status y roles/permissions
        $this->call([
            StatusSeeder::class,
            RolePermissionSeeder::class,
        ]);

        $superAdmin = User::factory()->create([
            'name' => 'Super admin',
            'email' => 'superadmin123@cowork.com',
            'password' => env('DF_SECRET_PS') ?? Hash::make('secret'), // llamado a clave por defecto desde .env
            'active' => true
        ]);


        $superAdmin->assignRole('super-admin');
    }
}
