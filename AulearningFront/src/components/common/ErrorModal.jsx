export default function ErrorModal({ show, title, message, onClose }) {
  if (!show) return null;

  return (
    <div className="global-error-backdrop">
      <div className="error-modal">
        <div className="error-modal-icon">
          <i className="bi bi-exclamation-lg" />
        </div>

        <h4>{title}</h4>
        <p>{message}</p>

        <button className="btn btn-primary w-100" onClick={onClose}>
          Entendido
        </button>
      </div>
    </div>
  );
}