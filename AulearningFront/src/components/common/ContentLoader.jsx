export default function ContentLoader({
  loading,
  title = 'Actualizando resultados...',
  message = 'Espera un momento...',
  children,
}) {
  if (!loading) {
    return children;
  }

  return (
    <div className="content-loader">
      <div className="content-loader-spinner">
        <span />
      </div>

      <h5>{title}</h5>

      <p>{message}</p>
    </div>
  );
}