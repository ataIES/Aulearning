import { useEffect, useState } from 'react';

import LoadingButton from '../../../components/common/LoadingButton';

const emptyForm = {
  task_id: '',
  file: null,
};

export default function MaterialFormModal({
  show,
  tasks = [],
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
    const { name, value, files } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    onSubmit({
      task_id: Number(form.task_id),
      file: form.file,
    });
  };

  return (
    <div className="error-modal-backdrop">
      <div className="form-modal">
        <div className="form-modal-header">
          <div>
            <h4>Subir material</h4>
            <p>Asocia el archivo a una tarea o apunte del curso.</p>
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
            <label className="form-label">Tarea / apunte</label>

            <select
              name="task_id"
              className={`form-select ${fieldError('task_id') ? 'is-invalid' : ''}`}
              value={form.task_id}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="">Selecciona una tarea...</option>

              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>

            {fieldError('task_id') && (
              <div className="invalid-feedback">{fieldError('task_id')}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label">Archivo</label>

            <input
              type="file"
              name="file"
              className={`form-control ${fieldError('file') ? 'is-invalid' : ''}`}
              onChange={handleChange}
              disabled={loading}
              required
            />

            {fieldError('file') && (
              <div className="invalid-feedback">{fieldError('file')}</div>
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
              loadingText="Subiendo..."
              icon="bi-upload"
            >
              Subir material
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}