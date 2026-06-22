<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

abstract class BaseApiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function failedValidation(
        Validator $validator
    ): void {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Error de validación.',
                'errors' => $validator->errors(),
            ], 422)
        );
    }

    public function messages(): array
    {
        return [

            'required' => 'El campo :attribute es obligatorio.',
            'string' => 'El campo :attribute debe ser un texto válido.',
            'email' => 'El campo :attribute debe contener un correo electrónico válido.',
            'unique' => 'El valor indicado para :attribute ya existe.',
            'exists' => 'El :attribute seleccionado no existe.',
            'confirmed' => 'La confirmación de :attribute no coincide.',
            'min' => 'El campo :attribute debe contener al menos :min caracteres.',
            'max' => 'El campo :attribute no puede superar :max caracteres.',
            'boolean' => 'El campo :attribute debe ser verdadero o falso.',
            'date' => 'El campo :attribute debe contener una fecha válida.',
            'after_or_equal' => 'La fecha indicada debe ser posterior o igual a la fecha inicial.',
            'file' => 'Debe proporcionar un archivo válido.',
            'image' => 'Debe proporcionar una imagen válida.',
            'mimes' => 'El formato del archivo no está permitido.',
            'in' => 'El valor seleccionado para :attribute no es válido.',
            'numeric' => 'El campo :attribute debe ser numérico.',
            'integer' => 'El campo :attribute debe ser un número entero.',
            'array' => 'El campo :attribute debe ser un array válido.',
        ];
    }

    public function attributes(): array
    {
        return [

            // User
            'name' => 'nombre',
            'last_name' => 'apellidos',
            'email' => 'correo electrónico',
            'password' => 'contraseña',
            'password_confirmation' => 'confirmación de contraseña',
            'active' => 'estado',

            // Course
            'course_id' => 'curso',
            'teacher_id' => 'profesor',
            'student_id' => 'alumno',
            'start_date' => 'fecha de inicio',
            'end_date' => 'fecha de finalización',

            // Task
            'title' => 'título',
            'description' => 'descripción',
            'due_date' => 'fecha de entrega',
            'gradable' => 'calificable',
            'status' => 'estado',
            'type' => 'tipo',

            // Chat
            'chat_group_id' => 'grupo',
            'content' => 'contenido',

            // File
            'file' => 'archivo',
            'task_id' => 'tarea',

            // Notification
            'user_id' => 'usuario',
        ];
    }
}