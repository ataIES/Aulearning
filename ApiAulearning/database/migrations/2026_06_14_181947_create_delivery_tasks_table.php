<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entrega_tareas', function (Blueprint $table) {
            $table->id();

            $table->foreignId('student_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('task_id')
                ->constrained('tasks')
                ->cascadeOnDelete();

            $table->dateTime('submitted_at')->nullable();

            $table->dateTime('updated_delivery_at')->nullable();

            $table->integer('grade')->nullable();

            $table->text('comment')->nullable();

            $table->timestamps();

            $table->unique(['student_id', 'task_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entrega_tareas');
    }
};