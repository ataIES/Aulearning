<?php

namespace Database\Factories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

class FileFactory extends Factory
{
    public function definition(): array
    {
        return [

            'name' => fake()->word().'.pdf',

            'path' => 'tasks/' .
                fake()->uuid() .
                '.pdf',

            'disk' => 'public',

            'mime_type' => 'application/pdf',

            'size' => rand(
                10000,
                5000000
            ),

            'task_id' => Task::query()
                ->inRandomOrder()
                ->value('id'),
        ];
    }
}