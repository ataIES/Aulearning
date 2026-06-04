<?php

namespace App\Http\Requests\Task;

use App\Http\Requests\BaseApiRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends BaseApiRequest
{
    public function rules(): array
    {
        return [

            'title' => [
                'sometimes',
                'string',
                'max:255',
            ],

            'description' => [
                'sometimes',
                'string',
            ],

            'due_date' => [
                'sometimes',
                'date',
            ],

            'course_id' => [
                'sometimes',
                'exists:courses,id',
            ],

            'student_id' => [
                'sometimes',
                'nullable',
                'exists:users,id',
            ],

            'type' => [
                'sometimes',
                Rule::in([
                    'activity',
                    'practice',
                    'exam',
                    'project',
                ]),
            ],

            'gradable' => [
                'sometimes',
                'boolean',
            ],

            'comment' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'status' => [
                'sometimes',
                Rule::in([
                    'pending',
                    'submitted',
                    'reviewed',
                    'graded',
                ]),
            ],
        ];
    }
}