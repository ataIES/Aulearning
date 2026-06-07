export default function AlertModal({ alert, onClose }) {
  if (!alert.show) return null;

  const icon = alert.type === 'success'
    ? 'bi-check-circle-fill text-success'
    : 'bi-exclamation-triangle-fill text-danger';

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-card">
        <div className="d-flex align-items-center gap-3 mb-3">
          <i className={`bi ${icon} fs-2`} />
          <h5 className="mb-0">{alert.title}</h5>
        </div>

        <p className="text-muted">{alert.message}</p>

        <div className="text-end">
          <button className="btn btn-primary" onClick={onClose}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}