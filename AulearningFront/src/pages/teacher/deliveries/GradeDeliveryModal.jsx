import { useEffect, useState } from 'react';

import LoadingButton from '../../../components/common/LoadingButton';

const emptyForm = {
  grade: '',
  comment: '',
};

export default function GradeDeliveryModal({
  show,
  delivery,
  errors = {},
  loading = false,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (delivery) {
      setForm({
        grade: delivery.grade ?? '',
        comment: delivery.comment ?? '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [delivery, show]);

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
      grade: form.grade === '' ? null : Number(form.grade),
      comment: form.comment || null,
    });
  };

  return (
    <div className="error-modal-backdrop">
      <div className="form-modal">
        <div className="form-modal-header">
          <div>
            <h4>Calificar entrega</h4>
            <p>
              {delivery?.student?.name} {delivery?.student?.last_name} ·{' '}
              {delivery?.task?.title}
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
          <div className="mb-3">
            <label className="form-label">Calificación</label>

            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              name="grade"
              className={`form-control ${fieldError('grade') ? 'is-invalid' : ''}`}
              value={form.grade}
              onChange={handleChange}
              disabled={loading}
              placeholder="0 - 10"
            />

            {fieldError('grade') && (
              <div className="invalid-feedback">{fieldError('grade')}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label">Comentario</label>

            <textarea
              name="comment"
              rows="4"
              className={`form-control ${fieldError('comment') ? 'is-invalid' : ''}`}
              value={form.comment}
              onChange={handleChange}
              disabled={loading}
              placeholder="Comentario para el alumno..."
            />

            {fieldError('comment') && (
              <div className="invalid-feedback">{fieldError('comment')}</div>
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
              loadingText="Guardando..."
              icon="bi-check-lg"
            >
              Guardar calificación
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}