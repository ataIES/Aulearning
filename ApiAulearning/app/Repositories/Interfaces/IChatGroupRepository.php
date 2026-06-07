<?php

namespace App\Repositories\Interfaces;

use App\Repositories\Interfaces\IBaseRepository;
use Illuminate\Database\Eloquent\Collection;

interface IChatGroupRepository extends IBaseRepository
{
    public function getByOwner(int $ownerId): Collection;
}