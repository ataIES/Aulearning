<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\ChatGroup;
use Illuminate\Database\Eloquent\Factories\Factory;

class MessageFactory extends Factory
{
    public function definition(): array
    {
        return [

            'content' => fake()->paragraph(),

            'user_id' => User::query()
                ->inRandomOrder()
                ->value('id'),

            'chat_group_id' => ChatGroup::query()
                ->inRandomOrder()
                ->value('id'),
        ];
    }
}