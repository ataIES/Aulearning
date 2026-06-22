<?php

namespace App\Services\Interfaces;

use App\DTOs\MessageDto;
use Illuminate\Support\Collection;

interface IMessageService extends IBaseService
{
    public function send(MessageDto $dto): MessageDto;

    public function getByGroup(int $chatGroupId): Collection;
}