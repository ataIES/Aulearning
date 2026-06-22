<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CourseFactory extends Factory
{
    public function definition(): array
    {
        return [

            'name' => fake()->sentence(3),

            'description' => fake()->paragraph(),

            'start_date' => now(),

            'end_date' => now()->addMonths(4),

            'teacher_id' => User::query()
                ->where('type', 'teacher')
                ->inRandomOrder()
                ->value('id'),
        ];
    }
}