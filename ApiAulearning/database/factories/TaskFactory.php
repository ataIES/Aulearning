<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [

            'title' => fake()->sentence(),

            'description' => fake()->paragraph(),

            'due_date' => now()->addDays(
                rand(1, 30)
            ),

            'course_id' => Course::query()
                ->inRandomOrder()
                ->value('id'),

            'student_id' => User::query()
                ->where('type', 'student')
                ->inRandomOrder()
                ->value('id'),

            'type' => fake()->randomElement([
                'activity',
                'practice',
                'exam',
                'project'
            ]),

            'gradable' => true,

            'comment' => fake()->optional()->sentence(),

            'status' => fake()->randomElement([
                'pending',
                'submitted',
                'reviewed',
                'graded'
            ]),
        ];
    }
}