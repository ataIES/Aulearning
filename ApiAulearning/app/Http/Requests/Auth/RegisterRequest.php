<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseApiRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends BaseApiRequest
{
    public function rules(): array
    {
        return [

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'last_name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],

            'type' => [
                'sometimes',
                Rule::in([
                    'student',
                    'teacher',
                ]),
            ],
        ];
    }

    public function messages(): array
    {
        return array_merge(
            parent::messages(),
            [

                'name.required' =>
                    'Debe indicar el nombre.',

                'last_name.required' =>
                    'Debe indicar los apellidos.',

                'email.required' =>
                    'Debe indicar un correo electrónico.',

                'email.unique' =>
                    'Ya existe un usuario con ese correo electrónico.',

                'password.required' =>
                    'Debe indicar una contraseña.',

                'password.confirmed' =>
                    'Las contraseñas no coinciden.',

                'password.min' =>
                    'La contraseña debe contener al menos 8 caracteres.',
            ]
        );
    }
}