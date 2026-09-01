<?php

namespace App\Http\Requests\File;

use App\Http\Requests\BaseApiRequest;

class StoreFileRequest extends BaseApiRequest
{
    public function rules(): array
    {
        return [
            'task_id' => [
                'required',
                'integer',
                'exists:tasks,id',
            ],

            'file' => [
                'required',
                'file',
                'mimes:jpg,jpeg,png,webp,pdf,doc,docx',
                'max:10240',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'task_id.required' => 'La tarea es obligatoria.',
            'task_id.integer' => 'La tarea seleccionada no es válida.',
            'task_id.exists' => 'La tarea seleccionada no existe.',

            'file.required' => 'Debes seleccionar un archivo.',
            'file.file' => 'El archivo seleccionado no es válido.',
            'file.mimes' => 'Solo se permiten imágenes, archivos PDF y documentos Word.',
            'file.max' => 'El archivo no puede superar los 10 MB.',
        ];
    }
}