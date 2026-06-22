<?php

namespace App\Http\Requests\Notification;

use App\Http\Requests\BaseApiRequest;
use Illuminate\Validation\Rule;

class StoreNotificationRequest extends BaseApiRequest
{
    public function rules(): array
    {
        return [

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'content' => [
                'required',
                'string',
            ],

            'user_id' => [
                'required',
                'exists:users,id',
            ],

            'type' => [
                'required',
                Rule::in([
                    'info',
                    'warning',
                    'task',
                    'message',
                ]),
            ],
        ];
    }
}