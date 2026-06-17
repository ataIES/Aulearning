export default function EmptyLearningState({
  icon = 'bi-inbox',
  title = 'Sin datos',
  message = 'No hay información disponible todavía.',
}) {
  return (
    <div className="learning-empty-state">
      <i className={`bi ${icon}`} />
      <h5>{title}</h5>
      <p>{message}</p>
    </div>
  );
}