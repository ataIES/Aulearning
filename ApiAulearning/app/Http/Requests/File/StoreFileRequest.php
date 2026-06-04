<?php

namespace App\Http\Requests\File;

use App\Http\Requests\BaseApiRequest;

class StoreFileRequest extends BaseApiRequest
{
    public function rules(): array
    {
        return [

            'file' => [
                'required',
                'file',
                'max:10240',
            ],

            'task_id' => [
                'required',
                'exists:tasks,id',
            ],
        ];
    }
}