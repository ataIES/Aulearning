<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Enrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'course_id',
        'enrollment_date',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'enrollment_date' => 'datetime',
            'active' => 'boolean',
        ];
    }

    public function student()
    {
        return $this->belongsTo(
            User::class,
            'student_id'
        );
    }

    public function course()
    {
        return $this->belongsTo(
            Course::class
        );
    }
}