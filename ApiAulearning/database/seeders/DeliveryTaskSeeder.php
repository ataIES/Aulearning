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
        $tasks = Task::query()->get();

        foreach ($tasks as $task) {
            $studentIds = Enrollment::query()
                ->where('course_id', $task->course_id)
                ->pluck('student_id');

            foreach ($studentIds as $studentId) {
                if (fake()->boolean(65)) {
                    DeliveryTask::query()->updateOrCreate(
                        [
                            'student_id' => $studentId,
                            'task_id' => $task->id,
                        ],
                        [
                            'submitted_at' => fake()->dateTimeBetween(
                                '-20 days',
                                'now'
                            ),

                            'updated_delivery_at' => fake()->boolean(35)
                                ? fake()->dateTimeBetween('-5 days', 'now')
                                : null,

                            'grade' => fake()->boolean(70)
                                ? fake()->numberBetween(0, 10)
                                : null,

                            'comment' => fake()->boolean(45)
                                ? fake()->sentence()
                                : null,
                        ]
                    );
                }
            }
        }
    }
}