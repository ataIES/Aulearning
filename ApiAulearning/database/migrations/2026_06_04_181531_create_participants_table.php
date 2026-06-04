<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('participants', function (Blueprint $table) {

            $table->id();

            $table->foreignId('chat_group_id')
                ->constrained('chat_groups')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->enum('role', [
                'member',
                'moderator',
                'admin'
            ])->default('member');

            $table->dateTime('joined_at');

            $table->boolean('active')
                ->default(true);

            $table->timestamps();

            $table->unique([
                'chat_group_id',
                'user_id'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('participants');
    }
};