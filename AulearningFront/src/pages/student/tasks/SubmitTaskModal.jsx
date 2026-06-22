import { useEffect, useState } from 'react';

import LoadingButton from '../../../components/common/LoadingButton';

const emptyForm = {
  comment: '',
  files: [],
};

export default function SubmitTaskModal({
  show,
  task,
  delivery,
  errors = {},
  loading = false,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(emptyForm);

  const isEditing = Boolean(delivery);

  useEffect(() => {
    if (show) {
      setForm({
        comment: delivery?.comment ?? '',
        files: [],
      });
    }
  }, [show, delivery]);

  if (!show) return null;

  const fieldError = (field) => errors?.[field]?.[0];

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? Array.from(files) : value,
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
            <h4>{isEditing ? 'Actualizar entrega' : 'Entregar tarea'}</h4>
            <p>{task?.title ?? 'Tarea'}</p>
          </div>

          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            disabled={loading}
          />
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {delivery?.files?.length > 0 && (
            <div className="mb-3">
              <label className="form-label">Archivos entregados</label>

              <div className="task-current-files">
                {delivery.files.map((file) => (
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

          <div className="mb-3">
            <label className="form-label">Comentario</label>

            <textarea
              name="comment"
              rows="4"
              className={`form-control ${fieldError('comment') ? 'is-invalid' : ''}`}
              value={form.comment}
              onChange={handleChange}
              disabled={loading}
              placeholder="Añade un comentario para el profesor..."
            />

            {fieldError('comment') && (
              <div className="invalid-feedback">{fieldError('comment')}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label">
              {isEditing ? 'Añadir nuevos archivos' : 'Archivos'}
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
              Puedes subir uno o varios archivos para esta entrega.
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
              loadingText="Guardando entrega..."
              icon="bi-upload"
            >
              {isEditing ? 'Actualizar entrega' : 'Entregar tarea'}
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}