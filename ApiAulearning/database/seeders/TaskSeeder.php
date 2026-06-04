<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\File;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::where('type', 'student')->get();

        Course::all()->each(function (Course $course) use ($students) {
            for ($i = 0; $i < rand(3, 8); $i++) {
                $task = Task::factory()->create([
                    'course_id' => $course->id,
                    'student_id' => fake()->boolean(70)
                        ? $students->random()->id
                        : null,
                ]);

                File::factory()
                    ->count(rand(0, 3))
                    ->create([
                        'task_id' => $task->id,
                    ]);
            }
        });
    }
}