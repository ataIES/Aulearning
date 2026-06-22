export default function PageLoader({
  title = 'Cargando datos',
  message = 'Preparando la información...',
}) {
  return (
    <div className="page-content-loader">
      <div className="page-content-loader-card">
        <div className="page-content-loader-spinner" />

        <div>
          <h5>{title}</h5>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}