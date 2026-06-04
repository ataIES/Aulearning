<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        Course::factory()
            ->count(20)
            ->create();

        $students = User::where('type', 'student')->get();

        Course::all()->each(function (Course $course) use ($students) {
            $students
                ->random(rand(8, 20))
                ->each(function (User $student) use ($course) {
                    Enrollment::firstOrCreate([
                        'student_id' => $student->id,
                        'course_id' => $course->id,
                    ], [
                        'enrollment_date' => now(),
                        'active' => true,
                    ]);

                    Grade::firstOrCreate([
                        'student_id' => $student->id,
                        'course_id' => $course->id,
                    ], [
                        'grade' => fake()->randomFloat(2, 0, 10),
                    ]);
                });
        });
    }
}
