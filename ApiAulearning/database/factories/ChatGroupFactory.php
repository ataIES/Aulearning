<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChatGroupFactory extends Factory
{
    public function definition(): array
    {
        return [

            'name' => fake()->words(
                3,
                true
            ),

            'description' => fake()->sentence(),

            'active' => true,

            'owner_id' => User::query()
                ->inRandomOrder()
                ->value('id'),
        ];
    }
}
