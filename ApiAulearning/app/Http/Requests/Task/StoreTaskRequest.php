<?php

namespace App\Http\Requests\Task;

use App\Http\Requests\BaseApiRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends BaseApiRequest
{
    public function rules(): array
    {
        return [

            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'required',
                'string',
            ],

            'due_date' => [
                'required',
                'date',
            ],

            'course_id' => [
                'required',
                'exists:courses,id',
            ],

            'student_id' => [
                'nullable',
                'exists:users,id',
            ],

            'type' => [
                'required',
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