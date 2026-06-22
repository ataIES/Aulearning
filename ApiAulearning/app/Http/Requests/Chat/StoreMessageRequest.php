<?php

namespace App\Http\Requests\Chat;

use App\Http\Requests\BaseApiRequest;

class StoreMessageRequest extends BaseApiRequest
{
    public function rules(): array
    {
        return [

            'content' => [
                'required',
                'string',
            ],

            'chat_group_id' => [
                'required',
                'exists:chat_groups,id',
            ],
        ];
    }
}