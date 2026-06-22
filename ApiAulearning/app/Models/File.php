<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class File extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'path',
        'disk',
        'mime_type',
        'size',
        'task_id',
    ];

    protected $appends = [
        'url',
    ];

    public function task()
    {
        return $this->belongsTo(
            Task::class,
            'task_id'
        );
    }

    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
    }
}