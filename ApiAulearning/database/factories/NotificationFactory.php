<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    public function definition(): array
    {
        return [

            'title' => fake()->sentence(),

            'content' => fake()->paragraph(),

            'user_id' => User::query()
                ->inRandomOrder()
                ->value('id'),

            'type' => fake()->randomElement([
                'info',
                'warning',
                'task',
                'message'
            ]),

            'read_at' => fake()->boolean(50)
                ? now()
                : null,
        ];
    }
}