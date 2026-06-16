<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('coordinator_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->comment('FK del coordinador');
            $table->foreignId('task_id')->constrained('tasks')->onDelete('cascade')->comment('FK de la tarea');
            $table->dateTime('assigned_at')->nullable()->comment('Fecha límite de entrega');
            $table->foreignId('assigned_by')->constrained('users')->onDelete('cascade')->comment('FK del administrador que asignó la tarea');
            $table->timestamps();
            $table->unique(['user_id', 'task_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('coordinator_tasks');
        Schema::enableForeignKeyConstraints();
    }
};
