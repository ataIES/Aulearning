<?php

namespace App\Services;

use App\Mappers\NotificationMapper;
use App\Repositories\Interfaces\INotificationRepository;
use App\Services\Interfaces\INotificationService;
use Illuminate\Support\Collection;

class NotificationService extends BaseService implements INotificationService
{
    public function __construct(
        private readonly INotificationRepository $notificationRepository,
        NotificationMapper $mapper,
    ) {
        parent::__construct($notificationRepository, $mapper);
    }

    public function getByUser(int $userId): Collection
    {
        return $this->notificationRepository
            ->getByUser($userId)
            ->map(fn ($notification) => $this->mapper->toDto($notification));
    }

    public function getUnreadByUser(int $userId): Collection
    {
        return $this->notificationRepository
            ->getUnreadByUser($userId)
            ->map(fn ($notification) => $this->mapper->toDto($notification));
    }

    public function markAsRead(int $notificationId): bool
    {
        return $this->notificationRepository
            ->markAsRead($notificationId);
    }
}