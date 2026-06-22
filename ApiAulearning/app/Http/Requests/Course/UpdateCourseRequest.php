<?php

namespace App\Http\Requests\Course;

use App\Http\Requests\BaseApiRequest;

class UpdateCourseRequest extends BaseApiRequest
{
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],

            'description' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'start_date' => [
                'sometimes',
                'date',
            ],

            'end_date' => [
                'sometimes',
                'date',
            ],

            'teacher_id' => [
                'sometimes',
                'exists:users,id',
            ],
        ];
    }
}