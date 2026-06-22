<?php

namespace App\Repositories;

use App\Models\Notification;
use App\Repositories\Interfaces\INotificationRepository;
use Illuminate\Database\Eloquent\Collection;

class NotificationRepository extends BaseRepository implements INotificationRepository
{
    public function __construct(Notification $model)
    {
        parent::__construct($model);
    }

    public function getByUser(int $userId): Collection
    {
        return Notification::query()
            ->where('user_id', $userId)
            ->latest()
            ->get();
    }

    public function getUnreadByUser(int $userId): Collection
    {
        return Notification::query()
            ->where('user_id', $userId)
            ->whereNull('read_at')
            ->latest()
            ->get();
    }

    public function markAsRead(int $id): bool
    {
        $notification = Notification::query()->find($id);

        if (!$notification) {
            return false;
        }

        $notification->update([
            'read_at' => now(),
        ]);

        return true;
    }
}