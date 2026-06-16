export default function LoginLoader({
  title = 'Iniciando sesión',
  message = 'Preparando tu espacio de trabajo...',
}) {
  return (
    <div className="login-loader-overlay">
      <div className="login-loader-card">
        <div className="login-loader-spinner" />

        <div>
          <h5>{title}</h5>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}