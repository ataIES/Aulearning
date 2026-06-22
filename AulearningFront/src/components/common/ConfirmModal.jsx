export default function ConfirmModal({
  show,
  title = 'Confirmar acción',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onClose,
  loading = false,
}) {
  if (!show) return null;

  return (
    <div className="error-modal-backdrop">
      <div className="confirm-modal">
        <div className="confirm-icon">
          <i className="bi bi-exclamation-triangle" />
        </div>

        <h4>{title}</h4>
        <p>{message}</p>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            className="btn btn-danger w-100"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}