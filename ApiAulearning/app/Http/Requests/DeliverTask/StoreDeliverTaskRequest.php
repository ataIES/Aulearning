<?php

namespace App\Http\Requests\DeliverTask;

use App\Http\Requests\BaseApiRequest;

class StoreDeliverTaskRequest extends BaseApiRequest
{
    public function rules(): array
    {
        return [
            'student_id' => [
                'required',
                'integer',
                'exists:users,id',
            ],

            'task_id' => [
                'required',
                'integer',
                'exists:tasks,id',
            ],

            'delivery_date' => [
                'nullable',
                'date',
            ],

            'grade' => [
                'nullable',
                'numeric',
                'min:0',
                'max:10',
            ],

            'comment' => [
                'nullable',
                'string',
                'max:500',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'student_id.required' => 'El alumno es obligatorio.',
            'student_id.exists' => 'El alumno seleccionado no existe.',
            'task_id.required' => 'La tarea es obligatoria.',
            'task_id.exists' => 'La tarea seleccionada no existe.',
            'delivery_date.date' => 'La fecha de entrega no es válida.',
            'grade.numeric' => 'La calificación debe ser numérica.',
            'grade.min' => 'La calificación mínima es 0.',
            'grade.max' => 'La calificación máxima es 10.',
            'comment.max' => 'El comentario no puede superar los 500 caracteres.',
        ];
    }
}