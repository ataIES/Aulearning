<?php

namespace App\Services;

use App\Models\User;
use App\Mappers\Interfaces\INotificationMapper;
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
        return $this->notificationRepository->getByUser($userId);
    }

    public function getUnreadByUser(int $userId): Collection
    {
        return $this->notificationRepository->getUnreadByUser($userId);
    }

    public function markAsRead(int $notificationId): bool
    {
        return $this->notificationRepository->markAsRead($notificationId);
    }

    public function createForUser(
        User $user,
        string $title,
        string $content,
        string $type = 'system'
    ): void {
        $this->notificationRepository->create([
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
        string $type = 'system'
    ): void {
        $this->notificationRepository->create([
            'title' => $title,
            'content' => $content,
            'type' => $type,
            'user_id' => null,
            'read_at' => null,
        ]);
    }
}