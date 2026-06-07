<?php

namespace App\Services;

use App\DTOs\ParticipantDto;
use App\Mappers\ParticipantMapper;
use App\Repositories\Interfaces\IParticipantRepository;
use App\Services\Interfaces\IParticipantService;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class ParticipantService extends BaseService implements IParticipantService
{
    public function __construct(
        private readonly IParticipantRepository $participantRepository,
        ParticipantMapper $mapper,
    ) {
        parent::__construct($participantRepository, $mapper);
    }

    public function addParticipant(ParticipantDto $dto): ParticipantDto
    {
        if ($this->participantRepository->isParticipant($dto->chatGroupId, $dto->userId)) {
            throw ValidationException::withMessages([
                'user_id' => ['El usuario ya pertenece al grupo.'],
            ]);
        }

        /** @var ParticipantDto $participant */
        $participant = $this->create($dto);

        return $participant;
    }

    public function getByGroup(int $chatGroupId): Collection
    {
        return $this->participantRepository
            ->getByGroup($chatGroupId)
            ->map(fn ($participant) => $this->mapper->toDto($participant));
    }

    public function getByUser(int $userId): Collection
    {
        return $this->participantRepository
            ->getByUser($userId)
            ->map(fn ($participant) => $this->mapper->toDto($participant));
    }
}