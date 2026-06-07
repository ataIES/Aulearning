<?php

namespace App\Services;

use App\Mappers\UserMapper;
use App\Repositories\Interfaces\IUserRepository;
use App\Services\Interfaces\IUserService;
use Illuminate\Support\Collection;

class UserService extends BaseService implements IUserService
{
    public function __construct(
        private readonly IUserRepository $userRepository,
        UserMapper $mapper,
    ) {
        parent::__construct($userRepository, $mapper);
    }

    public function getTeachers(): Collection
    {
        return $this->userRepository
            ->getTeachers()
            ->map(fn ($user) => $this->mapper->toDto($user));
    }

    public function getStudents(): Collection
    {
        return $this->userRepository
            ->getStudents()
            ->map(fn ($user) => $this->mapper->toDto($user));
    }
}