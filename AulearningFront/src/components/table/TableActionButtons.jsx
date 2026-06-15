export default function TableActionButtons({
  onEdit,
  onView,
  onDelete,
  extra = [],
}) {
  return (
    <div className="btn-group">
      {onEdit && (
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          title="Editar"
          onClick={onEdit}
        >
          <i className="bi bi-pencil-square" />
        </button>
      )}

      {extra.map((action) => (
        <button
          key={action.title}
          type="button"
          className={`btn btn-outline-${action.variant ?? 'secondary'} btn-sm`}
          title={action.title}
          onClick={action.onClick}
        >
          <i className={`bi ${action.icon}`} />
        </button>
      ))}

      {onView && (
        <button
          type="button"
          className="btn btn-outline-info btn-sm"
          title="Ver"
          onClick={onView}
        >
          <i className="bi bi-eye-fill" />
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          title="Eliminar"
          onClick={onDelete}
        >
          <i className="bi bi-trash-fill" />
        </button>
      )}
    </div>
  );
}