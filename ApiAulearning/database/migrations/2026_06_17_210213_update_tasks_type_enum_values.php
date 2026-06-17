<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            ALTER TABLE tasks
            MODIFY type ENUM('TAREA', 'EXAMEN', 'APUNTES')
            NOT NULL DEFAULT 'TAREA'
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE tasks
            MODIFY type ENUM('activity', 'practice', 'exam', 'project')
            NOT NULL DEFAULT 'activity'
        ");
    }
};