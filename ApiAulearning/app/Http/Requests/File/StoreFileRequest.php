<?php

namespace App\Http\Requests\File;

use App\Http\Requests\BaseApiRequest;

class StoreFileRequest extends BaseApiRequest
{
    public function rules(): array
    {
        return [
            'task_id' => [
                'required',
                'integer',
                'exists:tasks,id',
            ],

            'file' => [
                'required',
                'file',
                'max:10240',
            ],
        ];
    }
}