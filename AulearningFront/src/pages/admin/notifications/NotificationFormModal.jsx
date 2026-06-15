import { useState } from 'react';
import LoadingButton from '../../../components/common/LoadingButton';

const emptyForm = {
  title: '',
  content: '',
  type: 'global',
};

export default function NotificationFormModal({
  show,
  errors = {},
  loading = false,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(emptyForm);

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

    onSubmit(form);
  };

  return (
    <div className="error-modal-backdrop">
      <div className="form-modal">
        <div className="form-modal-header">
          <div>
            <h4>Nueva notificación</h4>
            <p>Envía un aviso a la plataforma.</p>
          </div>

          <button type="button" className="btn-close" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Título</label>
            <input
              name="title"
              className={`form-control ${fieldError('title') ? 'is-invalid' : ''}`}
              value={form.title}
              onChange={handleChange}
              required
            />
            {fieldError('title') && (
              <div className="invalid-feedback">{fieldError('title')}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Contenido</label>
            <textarea
              name="content"
              rows="5"
              className={`form-control ${fieldError('content') ? 'is-invalid' : ''}`}
              value={form.content}
              onChange={handleChange}
              required
            />
            {fieldError('content') && (
              <div className="invalid-feedback">{fieldError('content')}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Tipo</label>
            <select
              name="type"
              className={`form-select ${fieldError('type') ? 'is-invalid' : ''}`}
              value={form.type}
              onChange={handleChange}
            >
              <option value="global">Global</option>
              <option value="system">Sistema</option>
              <option value="course">Curso</option>
              <option value="user">Usuario</option>
            </select>
            {fieldError('type') && (
              <div className="invalid-feedback">{fieldError('type')}</div>
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
              loadingText="Enviando..."
              icon="bi-send-fill"
            >
              Enviar notificación
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}