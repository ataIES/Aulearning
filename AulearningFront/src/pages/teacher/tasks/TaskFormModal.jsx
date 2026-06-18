import { useEffect, useState } from 'react';
import LoadingButton from '../../../components/common/LoadingButton';

const emptyForm = {
  title: '',
  description: '',
  due_date: '',
  course_id: '',
  type: 'TAREA',
  gradable: true,
  files: [],
};

export default function TaskFormModal({
  show,
  task,
  courses = [],
  showCourseSelect = false,
  errors = {},
  loading = false,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(emptyForm);
  const isEditing = Boolean(task);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title ?? '',
        description: task.description ?? '',
        due_date: task.due_date ?? '',
        course_id: task.course_id ?? '',
        type: task.type ?? 'TAREA',
        gradable: Boolean(task.gradable ?? task.calificable ?? true),
        files: [],
      });
    } else {
      setForm(emptyForm);
    }
  }, [task, show]);

  if (!show) return null;

  const fieldError = (field) => errors?.[field]?.[0];

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: files
        ? Array.from(files)
        : type === 'checkbox'
          ? checked
          : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    onSubmit({
      ...form,
      course_id: form.course_id ? Number(form.course_id) : null,
    });
  };

  return (
    <div className="error-modal-backdrop">
      <div className="form-modal">
        <div className="form-modal-header">
          <div>
            <h4>{isEditing ? 'Editar tarea' : 'Nueva tarea'}</h4>
            <p>
              Configura la tarea y adjunta materiales si lo necesitas.
            </p>
          </div>

          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            disabled={loading}
          />
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {showCourseSelect && (
            <div className="mb-3">
              <label className="form-label">Curso</label>

              <select
                name="course_id"
                className={`form-select ${fieldError('course_id') ? 'is-invalid' : ''}`}
                value={form.course_id}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="">Selecciona un curso...</option>

                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>

              {fieldError('course_id') && (
                <div className="invalid-feedback">
                  {fieldError('course_id')}
                </div>
              )}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Título</label>

            <input
              name="title"
              className={`form-control ${fieldError('title') ? 'is-invalid' : ''}`}
              value={form.title}
              onChange={handleChange}
              disabled={loading}
              required
            />

            {fieldError('title') && (
              <div className="invalid-feedback">{fieldError('title')}</div>
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
              disabled={loading}
            />

            {fieldError('description') && (
              <div className="invalid-feedback">
                {fieldError('description')}
              </div>
            )}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Tipo</label>

              <select
                name="type"
                className={`form-select ${fieldError('type') ? 'is-invalid' : ''}`}
                value={form.type}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="TAREA">Tarea</option>
                <option value="EXAMEN">Examen</option>
                <option value="APUNTES">Apuntes</option>
              </select>

              {fieldError('type') && (
                <div className="invalid-feedback">{fieldError('type')}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Fecha entrega</label>

              <input
                type="date"
                name="due_date"
                className={`form-control ${fieldError('due_date') ? 'is-invalid' : ''}`}
                value={form.due_date}
                onChange={handleChange}
                disabled={loading || form.type === 'APUNTES'}
              />

              {fieldError('due_date') && (
                <div className="invalid-feedback">
                  {fieldError('due_date')}
                </div>
              )}
            </div>
          </div>

          <div className="form-check mb-3">
            <input
              id="gradable"
              name="gradable"
              type="checkbox"
              className="form-check-input"
              checked={form.gradable}
              onChange={handleChange}
              disabled={loading || form.type === 'APUNTES'}
            />

            <label className="form-check-label" htmlFor="gradable">
              Tarea calificable
            </label>
          </div>

          {isEditing && (task?.files ?? []).length > 0 && (
            <div className="mb-3">
              <label className="form-label">Archivos actuales</label>

              <div className="task-current-files">
                {task.files.map((file) => (
                  <a
                    key={file.id}
                    href={file.url ?? file.path}
                    target="_blank"
                    rel="noreferrer"
                    className="task-current-file"
                  >
                    <i className="bi bi-paperclip" />
                    <span>{file.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="form-label">
              {isEditing ? 'Añadir nuevos archivos' : 'Archivos adjuntos'}
            </label>

            <input
              type="file"
              name="files"
              multiple
              className={`form-control ${fieldError('files') ? 'is-invalid' : ''}`}
              onChange={handleChange}
              disabled={loading}
            />

            <small className="text-muted">
              Se subirán como materiales de la tarea.
            </small>

            {fieldError('files') && (
              <div className="invalid-feedback">{fieldError('files')}</div>
            )}
          </div>

          <div className="d-flex justify-content-end gap-2">
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
              loadingText="Guardando tarea..."
              icon="bi-check-lg"
            >
              Guardar tarea
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}