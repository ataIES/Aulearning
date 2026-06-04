<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EnrollmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'student_id' => User::query()
                ->where('type', 'student')
                ->inRandomOrder()
                ->value('id'),

            'course_id' => Course::query()
                ->inRandomOrder()
                ->value('id'),

            'enrollment_date' => now(),

            'active' => true,
        ];
    }
}