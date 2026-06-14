export default function EmptyState({
  title = 'Sin resultados',
  message = 'No hay datos para mostrar.',
}) {
  return (
    <div className="empty-state">
      <i className="bi bi-inbox" />
      <h5>{title}</h5>
      <p>{message}</p>
    </div>
  );
}