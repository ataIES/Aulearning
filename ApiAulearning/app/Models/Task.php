<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'due_date',
        'course_id',
        'student_id',
        'type',
        'gradable',
        'comment',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'gradable' => 'boolean',
        ];
    }

    public function course()
    {
        return $this->belongsTo(
            Course::class
        );
    }

    public function student()
    {
        return $this->belongsTo(
            User::class,
            'student_id'
        );
    }

    public function files()
    {
        return $this->hasMany(
            File::class
        );
    }

    public function deliveries()
    {
        return $this->hasMany(DeliveryTask::class, 'task_id');
    }
}
