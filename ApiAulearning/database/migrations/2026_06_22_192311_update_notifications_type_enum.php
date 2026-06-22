<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            ALTER TABLE notifications 
            MODIFY type ENUM(
                'info',
                'success',
                'warning',
                'error',
                'task',
                'message',
                'user',
                'course',
                'delivery',
                'grade',
                'file',
                'enrollment'
            ) DEFAULT 'info'
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE notifications 
            MODIFY type ENUM(
                'info',
                'warning',
                'task',
                'message'
            ) DEFAULT 'info'
        ");
    }
};