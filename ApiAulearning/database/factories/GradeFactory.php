<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class GradeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'grade' => fake()->randomFloat(
                2,
                0,
                10
            ),

            'student_id' => User::query()
                ->where('type', 'student')
                ->inRandomOrder()
                ->value('id'),

            'course_id' => Course::query()
                ->inRandomOrder()
                ->value('id'),
        ];
    }
}