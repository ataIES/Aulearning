<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryTask extends Model
{

    protected $table = "delivery_tasks";

    protected $fillable = [
        'student_id',
        'task_id',
        'delivery_date',
        'updated_date',
        'grade',
        'comment',
    ];

 protected $casts = [
    'delivery_date' => 'datetime',
    'updated_date' => 'datetime',
    'graded_at' => 'datetime',
    'grade' => 'decimal:2',
];
    public function student()
    {
        return $this->belongsTo(
            User::class,
            'student_id'
        );
    }

    public function task()
    {
        return $this->belongsTo(
            Task::class,
            'task_id'
        );
    }

    public function files()
    {
        return $this->hasMany(
            DeliveryFile::class,
            'delivery_task_id'
        );
    }
}
