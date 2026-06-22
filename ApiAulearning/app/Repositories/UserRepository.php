<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Interfaces\IUserRepository;
use Illuminate\Database\Eloquent\Collection;

class UserRepository extends BaseRepository implements IUserRepository
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function findByEmail(string $email): ?User
    {
        return User::query()
            ->where('email', $email)
            ->first();
    }

    public function getTeachers(): Collection
    {
        return User::query()
            ->where('type', 'teacher')
            ->get();
    }

    public function getStudents(): Collection
    {
        return User::query()
            ->where('type', 'student')
            ->get();
    }
}