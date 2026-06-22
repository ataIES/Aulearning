export default function TableStatPill({
  icon,
  value,
  variant = 'blue',
}) {
  return (
    <div className={`table-stat-pill ${variant}`}>
      <i className={`bi ${icon}`} />
      <span>{value ?? 0}</span>
    </div>
  );
}