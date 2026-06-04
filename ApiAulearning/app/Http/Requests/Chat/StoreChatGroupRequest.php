<?php

namespace App\Http\Requests\Chat;

use App\Http\Requests\BaseApiRequest;

class StoreChatGroupRequest extends BaseApiRequest
{
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ];
    }
}