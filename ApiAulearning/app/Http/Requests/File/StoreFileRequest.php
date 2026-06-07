<?php

namespace App\Http\Requests\File;

use Illuminate\Foundation\Http\FormRequest;

class StoreFileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

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
                'integer',
                'exists:tasks,id',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Debes seleccionar un archivo.',
            'file.file' => 'El archivo no es válido.',
            'file.max' => 'El archivo no puede superar los 10 MB.',

            'task_id.required' => 'La tarea es obligatoria.',
            'task_id.exists' => 'La tarea indicada no existe.',
        ];
    }
}