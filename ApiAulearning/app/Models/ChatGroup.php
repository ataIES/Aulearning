<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ChatGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'active',
        'owner_id',
    ];

    public function owner()
    {
        return $this->belongsTo(
            User::class,
            'owner_id'
        );
    }

    public function participants()
    {
        return $this->hasMany(
            Participant::class
        );
    }

    public function messages()
    {
        return $this->hasMany(
            Message::class
        );
    }
}