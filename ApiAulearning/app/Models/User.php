<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use HasRoles;
    use Notifiable;

    protected $fillable = [
        'name',
        'last_name',
        'email',
        'password',
        'type',
        'active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'active' => 'boolean',
        ];
    }

    public function courses()
    {
        return $this->hasMany(
            Course::class,
            'teacher_id'
        );
    }

    public function enrollments()
    {
        return $this->hasMany(
            Enrollment::class,
            'student_id'
        );
    }

    public function grades()
    {
        return $this->hasMany(
            Grade::class,
            'student_id'
        );
    }

    public function tasks()
    {
        return $this->hasMany(
            Task::class,
            'student_id'
        );
    }

    public function notifications()
    {
        return $this->hasMany(
            Notification::class
        );
    }

    public function ownedGroups()
    {
        return $this->hasMany(
            ChatGroup::class,
            'owner_id'
        );
    }

    public function messages()
    {
        return $this->hasMany(
            Message::class
        );
    }

    public function deliveries()
    {
        return $this->hasMany(DeliveryTask::class, 'student_id');
    }
}
