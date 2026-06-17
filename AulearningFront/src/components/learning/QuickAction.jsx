import { Link } from 'react-router-dom';

export default function QuickAction({
  to,
  icon,
  label,
  onClick,
  disabled = false,
}) {
  if (onClick) {
    return (
      <button
        type="button"
        className="learning-action"
        onClick={onClick}
        disabled={disabled}
      >
        <i className={`bi ${icon}`} />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <Link to={to} className="learning-action">
      <i className={`bi ${icon}`} />
      <span>{label}</span>
    </Link>
  );
}