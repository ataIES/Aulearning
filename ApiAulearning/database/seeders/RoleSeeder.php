<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $admin = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        $teacher = Role::firstOrCreate([
            'name' => 'teacher',
            'guard_name' => 'web',
        ]);

        $student = Role::firstOrCreate([
            'name' => 'student',
            'guard_name' => 'web',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Admin
        |--------------------------------------------------------------------------
        */

        $admin->syncPermissions(
            Permission::all()
        );

        /*
        |--------------------------------------------------------------------------
        | Teacher
        |--------------------------------------------------------------------------
        */

        $teacher->syncPermissions([

            'courses.view',
            'courses.create',
            'courses.update',

            'tasks.view',
            'tasks.create',
            'tasks.update',
            'tasks.grade',

            'grades.view',
            'grades.create',
            'grades.update',

            'files.view',
            'files.upload',

            'messages.view',
            'messages.create',

            'chats.view',
            'chats.create',

            'notifications.view',
            'notifications.create',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Student
        |--------------------------------------------------------------------------
        */

        $student->syncPermissions([

            'courses.view',

            'tasks.view',

            'grades.view',

            'files.view',
            'files.upload',

            'messages.view',
            'messages.create',

            'chats.view',

            'notifications.view',
        ]);
    }
}