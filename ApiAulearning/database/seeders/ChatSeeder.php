<?php

namespace Database\Seeders;

use App\Models\ChatGroup;
use App\Models\Message;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Database\Seeder;

class ChatSeeder extends Seeder
{
    public function run(): void
    {
        ChatGroup::factory()
            ->count(10)
            ->create();

        $users = User::all();

        ChatGroup::all()->each(function (ChatGroup $group) use ($users) {
            Participant::firstOrCreate([
                'chat_group_id' => $group->id,
                'user_id' => $group->owner_id,
            ], [
                'role' => 'admin',
                'joined_at' => now(),
                'active' => true,
            ]);

            $users
                ->where('id', '!=', $group->owner_id)
                ->random(rand(5, 15))
                ->each(function (User $user) use ($group) {
                    Participant::firstOrCreate([
                        'chat_group_id' => $group->id,
                        'user_id' => $user->id,
                    ], [
                        'role' => 'member',
                        'joined_at' => now(),
                        'active' => true,
                    ]);
                });

            $participants = Participant::where('chat_group_id', $group->id)->pluck('user_id');

            for ($i = 0; $i < rand(10, 30); $i++) {
                Message::factory()->create([
                    'chat_group_id' => $group->id,
                    'user_id' => $participants->random(),
                ]);
            }
        });
    }
}