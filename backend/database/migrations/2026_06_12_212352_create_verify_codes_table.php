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
        Schema::create('verify_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->comment('FK del usuario');
            $table->string('code', 6)->unique()->comment('Código de verificación');
            $table->string('type')->comment('Tipo de verificación');
            $table->dateTime('expires_at')->comment('Fecha de expiración');
            $table->datetime('used_at')->nullable()->comment('Fecha de uso');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('verify_codes');
    }
};
