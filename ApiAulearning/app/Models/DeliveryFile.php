<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryFile extends Model
{
    protected $fillable = [
        'delivery_task_id',
        'name',
        'path',
        'disk',
        'mime_type',
        'size',
    ];

    protected $appends = [
        'url',
    ];

    public function delivery()
    {
        return $this->belongsTo(
            DeliveryTask::class,
            'delivery_task_id'
        );
    }

    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
    }
}