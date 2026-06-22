<?php

namespace App\Repositories\Interfaces;

use App\Repositories\Interfaces\IBaseRepository;
use Illuminate\Database\Eloquent\Collection;

interface IMessageRepository extends IBaseRepository
{
    public function getByGroup(int $chatGroupId): Collection;
}