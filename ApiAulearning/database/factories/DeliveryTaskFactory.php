<?php

namespace Database\Factories;

use App\Models\DeliveryTask;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DeliveryTaskFactory extends Factory
{
    protected $model = DeliveryTask::class;

    public function definition(): array
    {
        return [
            'student_id' => User::query()
                ->where('type', 'student')
                ->inRandomOrder()
                ->value('id'),

            'task_id' => Task::query()
                ->inRandomOrder()
                ->value('id'),

            'submitted_at' => fake()->dateTimeBetween('-15 days', 'now'),

            'updated_delivery_at' => fake()->boolean(35)
                ? fake()->dateTimeBetween('-5 days', 'now')
                : null,

            'grade' => fake()->boolean(70)
                ? fake()->numberBetween(0, 10)
                : null,

            'comment' => fake()->boolean(45)
                ? fake()->sentence()
                : null,
        ];
    }
}