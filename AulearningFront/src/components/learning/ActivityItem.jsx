export default function ActivityItem({
  icon = 'bi-bell',
  title,
  subtitle,
  variant = '',
}) {
  return (
    <div className="learning-list-item">
      <div className={`learning-list-icon ${variant}`}>
        <i className={`bi ${icon}`} />
      </div>

      <div>
        <strong>{title}</strong>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}