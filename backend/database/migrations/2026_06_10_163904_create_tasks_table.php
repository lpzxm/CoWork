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
        
            Schema::create('tasks', function (Blueprint $table) {
                $table->id();
                $table->string('title')->comment('Título de la tarea');
                $table->text('description')->nullable()->comment('Descripción de la tarea');
                $table->foreignId('status_id')->nullable()->constrained('status')->comment('Estado de la tarea');
                $table->foreignId('created_by')->constrained('users')->comment('Usuario que creó la tarea');
                $table->foreignId('accepted_by')->nullable()->constrained('users')->comment('Usuario que aceptó la tarea');
                $table->foreignId('declined_by')->nullable()->constrained('users')->comment('Usuario que rechazó la tarea');
                $table->foreignId('updated_by')->nullable()->constrained('users')->comment('Usuario que actualizó la tarea');
                $table->foreignId('deleted_by')->nullable()->constrained('users')->comment('Usuario que eliminó la tarea');
                $table->dateTime('dt_delivery_limit')->nullable()->comment('Fecha límite de entrega');
                $table->timestamps();
                $table->softDeletes();
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
