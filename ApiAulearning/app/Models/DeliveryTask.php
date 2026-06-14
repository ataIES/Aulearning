<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryTask extends Model
{
    use HasFactory;

    protected $table = 'entrega_tareas';

    protected $fillable = [
        'student_id',
        'task_id',
        'submitted_at',
        'updated_delivery_at',
        'grade',
        'comment',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'updated_delivery_at' => 'datetime',
        'grade' => 'integer',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }
}
