<?php

namespace Database\Seeders;

use App\Models\Status;
use Illuminate\Database\Seeder;

class StatusSeeder extends Seeder
{
    public function run(): void
    { 
        // Creacion de multiples estados para las tasks y subtasks
        Status::create(['name' => 'Creado','color' => '#00000', 'active' => true]);
        Status::create(['name' => 'Pendiente','color' => '#00000', 'active' => true]);
        Status::create(['name' => 'En Progreso','color' => '#00000', 'active' => true]);
        Status::create(['name' => 'Completado','color' => '#00000', 'active' => true]);
        Status::create(['name' => 'En Revisión','color' => '#00000', 'active' => true]);
        Status::create(['name' => 'Aprobado','color' => '#00000', 'active' => true]);
        Status::create(['name' => 'Rechazado','color' => '#00000', 'active' => true]);
    }
}
