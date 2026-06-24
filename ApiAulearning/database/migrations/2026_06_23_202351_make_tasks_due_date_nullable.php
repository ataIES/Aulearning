<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            ALTER TABLE tasks 
            MODIFY due_date DATE NULL
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE tasks 
            MODIFY due_date DATE NOT NULL
        ");
    }
};