<?php

namespace App\Services;

use App\Mappers\RoleMapper;
use App\Repositories\Interfaces\IRoleRepository;
use App\Services\Interfaces\IRoleService;
use App\Services\Interfaces\RoleServiceInterface;

class RoleService extends BaseService implements IRoleService
{
    public function __construct(
       private readonly IRoleRepository $roleRepository,
        RoleMapper $mapper,
    ) {
        parent::__construct($roleRepository, $mapper);
    }
}