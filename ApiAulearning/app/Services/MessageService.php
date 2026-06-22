<?php

namespace App\Services;

use App\DTOs\MessageDto;
use App\Mappers\MessageMapper;
use App\Repositories\Interfaces\IMessageRepository;
use App\Repositories\Interfaces\IParticipantRepository;
use App\Services\Interfaces\IMessageService;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class MessageService extends BaseService implements IMessageService
{
    public function __construct(
        private readonly IMessageRepository $messageRepository,
        MessageMapper $mapper,
        private readonly IParticipantRepository $participantRepository,
    ) {
        parent::__construct($messageRepository, $mapper);
    }

    public function send(MessageDto $dto): MessageDto
    {
        if (!$this->participantRepository->isParticipant($dto->chatGroupId, $dto->userId)) {
            throw ValidationException::withMessages([
                'chat_group_id' => ['El usuario no pertenece a este grupo.'],
            ]);
        }

        /** @var MessageDto $message */
        $message = $this->create($dto);

        return $message;
    }

    public function getByGroup(int $chatGroupId): Collection
    {
        return $this->messageRepository
            ->getByGroup($chatGroupId)
            ->map(fn ($message) => $this->mapper->toDto($message));
    }
}