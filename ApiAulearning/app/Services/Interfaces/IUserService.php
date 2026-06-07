<?php

namespace App\Services\Interfaces;

use App\Services\Interfaces\IBaseService;
use Illuminate\Support\Collection;

interface IUserService extends IBaseService
{
    public function getTeachers(): Collection;

    public function getStudents(): Collection;
}