<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {

            $table->id();

            $table->string('title');

            $table->text('description');

            $table->date('due_date');

            $table->foreignId('course_id')
                ->constrained('courses')
                ->cascadeOnDelete();

            $table->foreignId('student_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->enum('type', [
                'activity',
                'practice',
                'exam',
                'project'
            ]);

            $table->boolean('gradable')
                ->default(true);

            $table->string('comment')
                ->nullable();

            $table->enum('status', [
                'pending',
                'submitted',
                'reviewed',
                'graded'
            ])->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};