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
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('tasks')->onDelete('cascade')->comment('FK de la task padre');
            $table->foreignId('sub_task_id')->nullable()->constrained('sub_tasks')->onDelete('cascade')->comment('FK de la sub-tarea padre');
            $table->string('file_type')->comment('Tipo de archivo');
            $table->string('file_name')->comment('Nombre del archivo');
            $table->text('url')->comment('URL del archivo');
            $table->foreignId('uploaded_by')->constrained('users')->comment('Usuario que cargó el archivo');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};