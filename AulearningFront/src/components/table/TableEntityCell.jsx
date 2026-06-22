export default function TableEntityCell({
  icon,
  title,
  subtitle,
  variant = 'blue',
}) {
  return (
    <div className="table-entity-cell">
      <div className={`table-entity-icon ${variant}`}>
        <i className={`bi ${icon}`} />
      </div>

      <div>
        <strong>{title}</strong>

        {subtitle && (
          <small>{subtitle}</small>
        )}
      </div>
    </div>
  );
}