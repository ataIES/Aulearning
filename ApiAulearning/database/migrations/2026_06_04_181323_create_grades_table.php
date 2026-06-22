<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grades', function (Blueprint $table) {

            $table->id();

            $table->decimal(
                'grade',
                5,
                2
            );

            $table->foreignId('student_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('course_id')
                ->constrained('courses')
                ->cascadeOnDelete();

            $table->timestamps();

            $table->unique([
                'student_id',
                'course_id'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};