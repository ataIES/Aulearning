<?php

namespace App\Repositories\Interfaces;

use App\Repositories\Interfaces\IBaseRepository;
use Illuminate\Database\Eloquent\Collection;

interface INotificationRepository extends IBaseRepository
{
    public function getByUser(int $userId): Collection;

    public function getUnreadByUser(int $userId): Collection;

    public function markAsRead(int $id): bool;
}