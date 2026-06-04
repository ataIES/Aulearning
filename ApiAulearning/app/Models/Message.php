<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'content',
        'user_id',
        'chat_group_id',
    ];

    public function user()
    {
        return $this->belongsTo(
            User::class
        );
    }

    public function group()
    {
        return $this->belongsTo(
            ChatGroup::class,
            'chat_group_id'
        );
    }
}