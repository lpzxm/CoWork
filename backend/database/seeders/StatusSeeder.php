<?php

namespace Database\Seeders;

use App\Models\Status;
use Illuminate\Database\Seeder;

class StatusSeeder extends Seeder
{
    public function run(): void
    { 
        // Creacion de multiples estados para las tasks y subtasks
        Status::create(['name' => 'Creado', 'active' => true]);
        Status::create(['name' => 'Pendiente', 'active' => true]);
        Status::create(['name' => 'En Progreso', 'active' => true]);
        Status::create(['name' => 'Completado', 'active' => true]);
        Status::create(['name' => 'En Revisión', 'active' => true]);
        Status::create(['name' => 'Aprobado', 'active' => true]);
        Status::create(['name' => 'Rechazado', 'active' => true]);
    }
}
