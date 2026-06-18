<?php

namespace App\Services;

use App\DTOs\Interfaces\IBaseDto;
use App\Filters\DeliverTaskFilter;
use App\Mappers\Interfaces\IDeliverTaskMapper;
use App\Models\DeliveryTask;
use App\Repositories\Interfaces\IDeliverTaskRepository;
use App\Services\Interfaces\IDeliverTaskService;
use App\Services\Interfaces\INotificationService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class DeliverTaskService extends BaseService implements IDeliverTaskService
{
    public function __construct(
        private readonly IDeliverTaskRepository $deliverTaskRepository,
        private readonly INotificationService $notificationService,
        IDeliverTaskMapper $deliverTaskMapper,
    ) {
        parent::__construct(
            $deliverTaskRepository,
            $deliverTaskMapper
        );
    }

    public function getByStudent(int $studentId): Collection
    {
        return $this->deliverTaskRepository
            ->getByStudent($studentId)
            ->map(fn ($delivery) => $this->mapper->toDto($delivery));
    }

    public function getByTask(int $taskId): Collection
    {
        return $this->deliverTaskRepository
            ->getByTask($taskId)
            ->map(fn ($delivery) => $this->mapper->toDto($delivery));
    }

   public function paginateDeliveries(
        DeliverTaskFilter $filter,
        array $relations = []
    ): LengthAwarePaginator {
        return $this->deliverTaskRepository->paginate(
            $filter,
            $relations
        );
    }

    public function update(int $id, IBaseDto $dto): ?IBaseDto
    {
        $previousDelivery = DeliveryTask::query()->find($id);

        $updatedDeliveryDto = parent::update($id, $dto);

        $delivery = DeliveryTask::query()
            ->with([
                'student',
                'task',
                'task.course',
            ])
            ->find($id);

        if (
            $updatedDeliveryDto &&
            $delivery &&
            $delivery->grade !== null &&
            $previousDelivery?->grade !== $delivery->grade
        ) {
            $this->notificationService->createForUser(
                $delivery->student,
                'Entrega calificada',
                "Tu entrega de la tarea {$delivery->task?->title} ha sido calificada con {$delivery->grade}/10.",
                'info'
            );
        }

        return $updatedDeliveryDto;
    }
}