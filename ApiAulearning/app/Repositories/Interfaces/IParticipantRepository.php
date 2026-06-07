<?php

namespace App\Repositories\Interfaces;

use App\Repositories\Interfaces\IBaseRepository;
use Illuminate\Database\Eloquent\Collection;

interface IParticipantRepository extends IBaseRepository
{
    public function getByGroup(int $chatGroupId): Collection;

    public function getByUser(int $userId): Collection;

    public function isParticipant(int $chatGroupId, int $userId): bool;
}