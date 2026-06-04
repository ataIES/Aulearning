<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin',
            'last_name' => 'Aulearning',
            'email' => 'admin@aulearning.test',
            'type' => 'admin',
        ]);

        $admin->assignRole('admin');

        User::factory()
            ->count(5)
            ->create(['type' => 'teacher'])
            ->each(fn (User $user) => $user->assignRole('teacher'));

        User::factory()
            ->count(50)
            ->create(['type' => 'student'])
            ->each(fn (User $user) => $user->assignRole('student'));
    }
}
