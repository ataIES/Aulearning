<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]
            ->forgetCachedPermissions();

        $permissions = [

            // Usuarios
            'users.view',
            'users.create',
            'users.update',
            'users.delete',

            // Cursos
            'courses.view',
            'courses.create',
            'courses.update',
            'courses.delete',

            // Inscripciones
            'enrollments.view',
            'enrollments.create',
            'enrollments.delete',

            // Tareas
            'tasks.view',
            'tasks.create',
            'tasks.update',
            'tasks.delete',
            'tasks.grade',

            // Calificaciones
            'grades.view',
            'grades.create',
            'grades.update',

            // Chats
            'chats.view',
            'chats.create',
            'chats.update',
            'chats.delete',

            // Mensajes
            'messages.view',
            'messages.create',
            'messages.delete',

            // Archivos
            'files.view',
            'files.upload',
            'files.delete',

            // Notificaciones
            'notifications.view',
            'notifications.create',
            'notifications.delete',

            // Administración
            'admin.panel',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }
    }
}