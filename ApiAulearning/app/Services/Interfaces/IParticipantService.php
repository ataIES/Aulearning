<?php

namespace App\Services\Interfaces;

use App\DTOs\ParticipantDto;
use Illuminate\Support\Collection;

interface IParticipantService extends IBaseService
{
    public function addParticipant(ParticipantDto $dto): ParticipantDto;

    public function getByGroup(int $chatGroupId): Collection;

    public function getByUser(int $userId): Collection;
}