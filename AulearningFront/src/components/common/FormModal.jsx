export default function FormModal({
  show,
  title,
  children,
  onClose,
  onSubmit,
  submitText = 'Guardar',
  loading = false,
}) {
  if (!show) return null;

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-card modal-card-lg">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">{title}</h5>

          <button className="btn btn-sm btn-light" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          {children}

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cancelar
            </button>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}