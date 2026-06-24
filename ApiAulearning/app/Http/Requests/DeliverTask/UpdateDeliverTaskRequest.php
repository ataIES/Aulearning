<?php

namespace App\Http\Requests\DeliverTask;

use App\Http\Requests\BaseApiRequest;

class UpdateDeliverTaskRequest extends BaseApiRequest
{
    public function rules(): array
    {
        return [
            'student_id' => [
                'sometimes',
                'integer',
                'exists:users,id',
            ],

            'task_id' => [
                'sometimes',
                'integer',
                'exists:tasks,id',
            ],

            'delivery_date' => [
                'sometimes',
                'nullable',
                'date',
            ],

            'grade' => [
                'sometimes',
                'nullable',
                'numeric',
                'min:0',
                'max:10',
            ],

            'comment' => [
                'sometimes',
                'nullable',
                'string',
                'max:500',
            ],
            'removed_files' => ['nullable', 'array'],
            'removed_files.*' => ['integer', 'exists:delivery_files,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'student_id.exists' => 'El alumno seleccionado no existe.',
            'task_id.exists' => 'La tarea seleccionada no existe.',
            'delivery_date.date' => 'La fecha de entrega no es válida.',
            'grade.numeric' => 'La calificación debe ser numérica.',
            'grade.min' => 'La calificación mínima es 0.',
            'grade.max' => 'La calificación máxima es 10.',
            'comment.max' => 'El comentario no puede superar los 500 caracteres.',
        ];
    }
}
