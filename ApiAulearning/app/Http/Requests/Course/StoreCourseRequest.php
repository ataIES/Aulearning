<?php

namespace App\Http\Requests\Course;

use App\Http\Requests\BaseApiRequest;

class StoreCourseRequest extends BaseApiRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],

            'start_date' => ['required', 'date'],

            'end_date' => [
                'required',
                'date',
                'after_or_equal:start_date',
            ],

            'teacher_id' => [
                'required',
                'exists:users,id',
            ],
        ];
    }
}