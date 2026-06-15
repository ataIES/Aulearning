<?php

namespace App\Http\Requests\Enrollment;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEnrollmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $studentId = $this->input('student_id');
        $courseId = $this->input('course_id');

        return [
            'student_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')->where('type', 'student'),
            ],

            'course_id' => [
                'required',
                'integer',
                Rule::exists('courses', 'id'),
                Rule::unique('enrollments', 'course_id')
                    ->where('student_id', $studentId),
            ],

            'enrollment_date' => [
                'nullable',
                'date',
            ],

            'active' => [
                'nullable',
                'boolean',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'student_id.required' => 'El alumno es obligatorio.',
            'student_id.exists' => 'El alumno seleccionado no es válido.',
            'course_id.required' => 'El curso es obligatorio.',
            'course_id.exists' => 'El curso seleccionado no existe.',
            'course_id.unique' => 'Este alumno ya está matriculado en el curso.',
        ];
    }
}