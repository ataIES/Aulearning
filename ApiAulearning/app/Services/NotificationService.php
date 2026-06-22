<?php

namespace App\Services;

use App\Mappers\Interfaces\INotificationMapper;
use App\Models\Notification;
use App\Models\User;
use App\Repositories\Interfaces\INotificationRepository;
use App\Services\Interfaces\INotificationService;
use Illuminate\Support\Collection;

class NotificationService extends BaseService implements INotificationService
{
    public function __construct(
        private readonly INotificationRepository $notificationRepository,
        INotificationMapper $notificationMapper
    ) {
        parent::__construct(
            $notificationRepository,
            $notificationMapper
        );
    }

    public function getByUser(int $userId): Collection
    {
        return Notification::query()
            ->where(function ($query) use ($userId) {
                $query->where('user_id', $userId)
                    ->orWhereNull('user_id');
            })
            ->latest()
            ->get();
    }

    public function getUnreadByUser(int $userId): Collection
    {
        return Notification::query()
            ->where(function ($query) use ($userId) {
                $query->where('user_id', $userId)
                    ->orWhereNull('user_id');
            })
            ->whereNull('read_at')
            ->latest()
            ->get();
    }

    public function markAsRead(int $notificationId): bool
    {
        return Notification::query()
            ->where('id', $notificationId)
            ->update([
                'read_at' => now(),
            ]) > 0;
    }

    public function createForUser(
        User $user,
        string $title,
        string $content,
        string $type = 'info'
    ): void {
        Notification::query()->create([
            'title' => $title,
            'content' => $content,
            'type' => $type,
            'user_id' => $user->id,
            'read_at' => null,
        ]);
    }

    public function createGlobal(
        string $title,
        string $content,
        string $type = 'info'
    ): void {
        Notification::query()->create([
            'title' => $title,
            'content' => $content,
            'type' => $type,
            'user_id' => null,
            'read_at' => null,
        ]);
    }

    public function markAllAsRead(int $userId): bool
    {
        return Notification::query()
            ->where(function ($query) use ($userId) {
                $query->where('user_id', $userId)
                    ->orWhereNull('user_id');
            })
            ->whereNull('read_at')
            ->update([
                'read_at' => now(),
            ]) > 0;
    }
}
