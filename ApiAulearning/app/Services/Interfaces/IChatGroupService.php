<?php

namespace App\Services\Interfaces;

use Illuminate\Support\Collection;

interface IChatGroupService extends IBaseService
{
    public function getByOwner(int $ownerId): Collection;
}