import { useEffect, useState } from 'react';

import LoadingButton from '../../../components/common/LoadingButton';

const emptyForm = {
  student_id: '',
  course_id: '',
};

export default function EnrollmentFormModal({
  show,
  students = [],
  courses = [],
  errors = {},
  loading = false,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (show) {
      setForm(emptyForm);
    }
  }, [show]);

  if (!show) return null;

  const fieldError = (field) => errors?.[field]?.[0];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    onSubmit({
      student_id: Number(form.student_id),
      course_id: Number(form.course_id),
    });
  };

  return (
    <div className="error-modal-backdrop">
      <div className="form-modal">
        <div className="form-modal-header">
          <div>
            <h4>Nueva matrícula</h4>
            <p>Matricula un alumno en un curso.</p>
          </div>

          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            disabled={loading}
          />
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Alumno</label>

            <select
              name="student_id"
              className={`form-select ${fieldError('student_id') ? 'is-invalid' : ''}`}
              value={form.student_id}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Selecciona un alumno...</option>

              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} {student.last_name ?? ''} — {student.email}
                </option>
              ))}
            </select>

            {fieldError('student_id') && (
              <div className="invalid-feedback">{fieldError('student_id')}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Curso</label>

            <select
              name="course_id"
              className={`form-select ${fieldError('course_id') ? 'is-invalid' : ''}`}
              value={form.course_id}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Selecciona un curso...</option>

              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} — {course.teacher?.name ?? 'Sin profesor'}
                </option>
              ))}
            </select>

            {fieldError('course_id') && (
              <div className="invalid-feedback">{fieldError('course_id')}</div>
            )}
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>

            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Matriculando..."
              icon="bi-person-plus-fill"
            >
              Crear matrícula
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}