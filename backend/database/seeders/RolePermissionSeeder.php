<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Creacion de permisos para usuarios
        Permission::create(['name' => 'users.create']);
        Permission::create(['name' => 'users.read']);
        Permission::create(['name' => 'users.update']);
        Permission::create(['name' => 'users.delete']);

        // Creacion de permisos para tareas
        Permission::create(['name' => 'tasks.create']);
        Permission::create(['name' => 'tasks.read']);
        Permission::create(['name' => 'tasks.update']);
        Permission::create(['name' => 'tasks.delete']);
        Permission::create(['name' => 'tasks.assign']);

        // Creacion de permisos para subtareas
        Permission::create(['name' => 'subtasks.create']);
        Permission::create(['name' => 'subtasks.read']);
        Permission::create(['name' => 'subtasks.update']);
        Permission::create(['name' => 'subtasks.approve']);
        Permission::create(['name' => 'subtasks.delete']);

        // Creacion de permisos para archivos
        Permission::create(['name' => 'subtasks.files.upload']);
        Permission::create(['name' => 'subtasks.files.delete']);

        $superAdmin = Role::create(['name' => 'super-admin']); // Creacion de rol de super admin
        $superAdmin->givePermissionTo(Permission::all()); // asignar todos los permisos al rol de super admin

        $admin = Role::create(['name' => 'admin']); // Creacion de rol de admin
        $admin->givePermissionTo([
            'users.create', 'users.read', 'users.update', 'users.delete',
            'tasks.create', 'tasks.read', 'tasks.update', 'tasks.assign', 'tasks.delete',
            'subtasks.create', 'subtasks.read', 'subtasks.update', 'subtasks.approve', 'subtasks.delete',
            'subtasks.files.upload', 'subtasks.files.delete',
        ]); // asignar todos los permisos al rol de admin

        $coordinator = Role::create(['name' => 'coordinador']); // Creacion de rol de coordinador
        $coordinator->givePermissionTo([
            'tasks.read',
            'subtasks.create', 'subtasks.read', 'subtasks.update', 'subtasks.delete',
            'subtasks.files.upload', 'subtasks.files.delete',
        ]); // asignar permisos al rol de coordinador
    }
}
