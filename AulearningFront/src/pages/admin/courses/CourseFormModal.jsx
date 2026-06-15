import LoadingButton from '../../../components/common/LoadingButton';
import { useEffect, useState } from 'react';

const emptyForm = {
  name: '',
  description: '',
  teacher_id: '',
  start_date: '',
  end_date: '',
};

export default function CourseFormModal({
  show,
  course,
  teachers = [],
  errors = {},
  loading = false,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(emptyForm);
  const isEditing = Boolean(course);

  useEffect(() => {
    if (course) {
      setForm({
        name: course.name ?? '',
        description: course.description ?? '',
        teacher_id: course.teacher_id ?? '',
        start_date: course.start_date ?? '',
        end_date: course.end_date ?? '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [course, show]);

  if (!show) return null;

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
      ...form,
      teacher_id: form.teacher_id ? Number(form.teacher_id) : null,
    });
  };

  const fieldError = (field) => errors?.[field]?.[0];

  return (
    <div className="error-modal-backdrop">
      <div className="form-modal">
        <div className="form-modal-header">
          <div>
            <h4>{isEditing ? 'Editar curso' : 'Nuevo curso'}</h4>
            <p>Gestiona la ficha base del curso y su profesor.</p>
          </div>

          <button type="button" className="btn-close" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Nombre del curso</label>
            <input
              name="name"
              className={`form-control ${fieldError('name') ? 'is-invalid' : ''}`}
              value={form.name}
              onChange={handleChange}
              required
            />
            {fieldError('name') && (
              <div className="invalid-feedback">{fieldError('name')}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              name="description"
              rows="4"
              className={`form-control ${fieldError('description') ? 'is-invalid' : ''}`}
              value={form.description}
              onChange={handleChange}
            />
            {fieldError('description') && (
              <div className="invalid-feedback">{fieldError('description')}</div>
            )}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Fecha de inicio</label>
              <input
                type="date"
                name="start_date"
                className={`form-control ${fieldError('start_date') ? 'is-invalid' : ''}`}
                value={form.start_date}
                onChange={handleChange}
                required
              />
              {fieldError('start_date') && (
                <div className="invalid-feedback">{fieldError('start_date')}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Fecha de fin</label>
              <input
                type="date"
                name="end_date"
                className={`form-control ${fieldError('end_date') ? 'is-invalid' : ''}`}
                value={form.end_date}
                onChange={handleChange}
                required
              />
              {fieldError('end_date') && (
                <div className="invalid-feedback">{fieldError('end_date')}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Profesor asignado</label>
            <select
              name="teacher_id"
              className={`form-select ${fieldError('teacher_id') ? 'is-invalid' : ''}`}
              value={form.teacher_id}
              onChange={handleChange}
            >
              <option value="">Sin profesor asignado</option>

              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} {teacher.last_name ?? ''} — {teacher.email}
                </option>
              ))}
            </select>

            {fieldError('teacher_id') && (
              <div className="invalid-feedback">{fieldError('teacher_id')}</div>
            )}
          </div>

          <div className="d-flex justify-content-end gap-2 mt-2">
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
              loadingText="Guardando curso..."
              icon="bi-check-lg"
            >
              Guardar curso
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}