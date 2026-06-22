<?php

namespace App\Http\Requests\Chat;

use App\Http\Requests\BaseApiRequest;

class UpdateChatGroupRequest extends BaseApiRequest
{
    public function rules(): array
    {
        return [
            'name' => [
                'sometimes',
                'string',
                'max:255',
            ],

            'description' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'active' => [
                'sometimes',
                'boolean',
            ],
        ];
    }
}