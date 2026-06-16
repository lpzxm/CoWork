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
        Schema::create('sub_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('tasks')->restrictOnDelete()->comment('FK de la task padre');
            $table->string('title')->comment('Título de la subtarea');
            $table->text('description')->nullable()->comment('Descripción de la subtarea');
            $table->foreignId('status_id')->nullable()->constrained('status')->comment('Estado de la subtarea');
            $table->foreignId('created_by')->constrained('users')->comment('Usuario que creó la subtarea');
            $table->foreignId('accepted_by')->nullable()->constrained('users')->comment('Usuario que aceptó la subtarea');
            $table->foreignId('declined_by')->nullable()->constrained('users')->comment('Usuario que rechazó la subtarea');
            $table->foreignId('updated_by')->nullable()->constrained('users')->comment('Usuario que actualizó la subtarea');
            $table->foreignId('deleted_by')->nullable()->constrained('users')->comment('Usuario que eliminó la subtarea');
            $table->timestamps();
            $table->dateTime('dt_delivery_limit')->nullable()->comment('Fecha límite de entrega');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sub_tasks');
    }
};
