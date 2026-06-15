export default function TableUserCell({
  name,
  email,
}) {
  const initial = name?.charAt(0)?.toUpperCase() ?? 'U';

  return (
    <div className="table-user-cell">
      <div className="table-user-avatar">
        {initial}
      </div>

      <div>
        <strong>{name ?? 'Sin nombre'}</strong>
        <small>{email ?? 'Sin email'}</small>
      </div>
    </div>
  );
}