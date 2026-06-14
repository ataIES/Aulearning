<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Database\Seeder;

class EnrollmentSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::query()
            ->where('type', 'student')
            ->pluck('id');

        $courses = Course::query()->get();

        foreach ($courses as $course) {
            $maxStudents = min(20, $students->count());

            if ($maxStudents === 0) {
                continue;
            }

            $selectedStudents = $students
                ->shuffle()
                ->take(fake()->numberBetween(5, $maxStudents));

            foreach ($selectedStudents as $studentId) {
                Enrollment::query()->firstOrCreate(
                    [
                        'student_id' => $studentId,
                        'course_id' => $course->id,
                    ],
                    [
                        'enrollment_date' => fake()->dateTimeBetween(
                            '-4 months',
                            '-1 week'
                        ),
                        'active' => true,
                    ]
                );
            }
        }
    }
}