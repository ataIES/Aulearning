import { useEffect, useState } from 'react';

import LoadingButton from '../../../components/common/LoadingButton';

const emptyForm = {
  title: '',
  description: '',
  due_date: '',
  type: 'TAREA',
  gradable: true,
};

export default function TaskFormModal({
  show,
  task,
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
        type: task.type ?? 'TAREA',
        gradable: Boolean(task.gradable ?? task.calificable ?? true),
      });
    } else {
      setForm(emptyForm);
    }
  }, [task, show]);

  if (!show) return null;

  const fieldError = (field) => errors?.[field]?.[0];

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    onSubmit(form);
  };

  return (
    <div className="error-modal-backdrop">
      <div className="form-modal">
        <div className="form-modal-header">
          <div>
            <h4>{isEditing ? 'Editar tarea' : 'Nueva tarea'}</h4>
            <p>Configura la tarea del curso.</p>
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
              <div className="invalid-feedback">{fieldError('description')}</div>
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
                <div className="invalid-feedback">{fieldError('due_date')}</div>
              )}
            </div>
          </div>

          <div className="form-check mb-4">
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