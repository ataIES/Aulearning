export default function LoadingButton({
  loading = false,
  children,
  loadingText = 'Guardando...',
  icon = 'bi-check-lg',
  variant = 'primary',
  type = 'button',
  className = '',
  disabled = false,
  onClick,
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      disabled={loading || disabled}
      onClick={onClick}
    >
      {loading ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          />
          {loadingText}
        </>
      ) : (
        <>
          {icon && <i className={`bi ${icon} me-2`} />}
          {children}
        </>
      )}
    </button>
  );
}