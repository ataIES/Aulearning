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
                'nullable',
                'date',
                'required_unless:type,APUNTES',
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
                    'TAREA',
                    'EXAMEN',
                    'APUNTES',
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

    public function messages(): array
    {
        return [
            'title.required' => 'El título es obligatorio.',
            'description.required' => 'La descripción es obligatoria.',
            'due_date.required_unless' => 'La fecha de entrega es obligatoria salvo para apuntes.',
            'course_id.required' => 'El curso es obligatorio.',
            'course_id.exists' => 'El curso seleccionado no existe.',
            'type.required' => 'El tipo de tarea es obligatorio.',
            'type.in' => 'El tipo de tarea seleccionado no es válido.',
        ];
    }
}