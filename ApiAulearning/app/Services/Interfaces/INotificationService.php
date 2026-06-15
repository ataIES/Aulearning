<?php

namespace App\Services\Interfaces;

use App\Models\User;
use Illuminate\Support\Collection;

interface INotificationService extends IBaseService
{
    public function getByUser(int $userId): Collection;

    public function getUnreadByUser(int $userId): Collection;

    public function markAsRead(int $notificationId): bool;

    public function createForUser(
        User $user,
        string $title,
        string $content,
        string $type = 'system'
    ): void;

    public function createGlobal(
        string $title,
        string $content,
        string $type = 'system'
    ): void;
}