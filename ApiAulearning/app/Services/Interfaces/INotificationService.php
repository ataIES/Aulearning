<?php

namespace App\Services\Interfaces;

use Illuminate\Support\Collection;

interface INotificationService extends IBaseService
{
    public function getByUser(
        int $userId
    ): Collection;

    public function getUnreadByUser(
        int $userId
    ): Collection;

    public function markAsRead(
        int $notificationId
    ): bool;
}