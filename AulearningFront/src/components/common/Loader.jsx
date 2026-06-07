export default function Loader() {
  return (
    <div className="loader-overlay">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status" />
        <p className="mb-0 fw-semibold">Cargando...</p>
      </div>
    </div>
  );
}