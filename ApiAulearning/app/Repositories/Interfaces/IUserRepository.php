<?php

namespace App\Repositories\Interfaces;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface IUserRepository extends IBaseRepository
{
    public function findByEmail(string $email): ?User;

    public function getTeachers(): Collection;

    public function getStudents(): Collection;
}