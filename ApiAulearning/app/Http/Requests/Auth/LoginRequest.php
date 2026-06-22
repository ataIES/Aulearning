<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseApiRequest;

class LoginRequest extends BaseApiRequest
{
    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'email',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
            ],
        ];
    }

    public function messages(): array
    {
        return array_merge(
            parent::messages(),
            [
                'email.required' =>
                    'Debe introducir un correo electrónico.',

                'email.email' =>
                    'El correo electrónico no tiene un formato válido.',

                'password.required' =>
                    'Debe introducir una contraseña.',

                'password.min' =>
                    'La contraseña debe contener al menos 8 caracteres.',
            ]
        );
    }
}
