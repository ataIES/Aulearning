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
                'nullable',
                'date',
                'required_unless:type,APUNTES',
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

    public function messages(): array
    {
        return [

            'title.max' => 'El título no puede superar los 255 caracteres.',

            'due_date.required_unless' =>
                'La fecha de entrega es obligatoria salvo para apuntes.',

            'course_id.exists' =>
                'El curso seleccionado no existe.',

            'student_id.exists' =>
                'El alumno seleccionado no existe.',

            'type.in' =>
                'El tipo de tarea seleccionado no es válido.',

        ];
    }
}