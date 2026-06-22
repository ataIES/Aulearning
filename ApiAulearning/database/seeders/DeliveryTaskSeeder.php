<?php

namespace Database\Seeders;

use App\Models\DeliveryTask;
use App\Models\Enrollment;
use App\Models\Task;
use Illuminate\Database\Seeder;

class DeliveryTaskSeeder extends Seeder
{
    public function run(): void
    {
        $tasks = Task::query()
            ->where('gradable', true)
            ->get();

        foreach ($tasks as $task) {
            $enrollments = Enrollment::query()
                ->where('course_id', $task->course_id)
                ->inRandomOrder()
                ->limit(rand(3, 8))
                ->get();

            foreach ($enrollments as $enrollment) {
                DeliveryTask::query()->firstOrCreate(
                    [
                        'student_id' => $enrollment->student_id,
                        'task_id' => $task->id,
                    ],
                    [
                        'delivery_date' => now()
                            ->subDays(rand(0, 10))
                            ->toDateString(),

                        'updated_date' => null,

                        'grade' => rand(0, 1)
                            ? rand(50, 100) / 10
                            : null,

                        'comment' => null,
                    ]
                );
            }
        }
    }
}