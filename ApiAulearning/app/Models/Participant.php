<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Participant extends Model
{
    use HasFactory;

    protected $fillable = [
        'chat_group_id',
        'user_id',
        'role',
        'joined_at',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'joined_at' => 'datetime',
            'active' => 'boolean',
        ];
    }

    public function group()
    {
        return $this->belongsTo(
            ChatGroup::class,
            'chat_group_id'
        );
    }

    public function user()
    {
        return $this->belongsTo(
            User::class
        );
    }
}