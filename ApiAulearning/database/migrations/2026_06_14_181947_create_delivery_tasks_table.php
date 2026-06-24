<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delivery_tasks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('student_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('task_id')
                ->constrained('tasks')
                ->cascadeOnDelete();

            $table->date('delivery_date')->nullable();
            $table->dateTime('updated_date')->nullable();

            $table->decimal('grade', 5, 2)->nullable();
            $table->text('comment')->nullable();

            $table->timestamps();

            $table->unique([
                'student_id',
                'task_id',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_tasks');
    }
};