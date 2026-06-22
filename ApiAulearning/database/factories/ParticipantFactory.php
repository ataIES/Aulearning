<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\ChatGroup;
use Illuminate\Database\Eloquent\Factories\Factory;

class ParticipantFactory extends Factory
{
    public function definition(): array
    {
        return [

            'chat_group_id' => ChatGroup::query()
                ->inRandomOrder()
                ->value('id'),

            'user_id' => User::query()
                ->inRandomOrder()
                ->value('id'),

            'role' => fake()->randomElement([
                'member',
                'moderator'
            ]),

            'joined_at' => now(),

            'active' => true,
        ];
    }
}