export default function TableToolbar({
  title,
  subtitle,
  search,
  searchPlaceholder = 'Buscar...',
  onSearchChange,
  onSearchSubmit,
  filters,
  actions,
  createLabel = 'Nuevo',
  onCreate,
}) {
  return (
    <div className="admin-panel-card mb-3">
      <div className="table-toolbar-header">
        <div>
          <h4>{title}</h4>
          {subtitle && <p>{subtitle}</p>}
        </div>

        {onCreate && (
          <button className="btn btn-primary" onClick={onCreate}>
            <i className="bi bi-plus-lg me-1" />
            {createLabel}
          </button>
        )}
      </div>

      <form onSubmit={onSearchSubmit} noValidate>
        <div className="row g-2">
          <div className="col-md-4">
            <input
              className="form-control"
              value={search}
              placeholder={searchPlaceholder}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>

          {filters}

          <div className="col-md-2 d-flex gap-2">
            <button className="btn btn-outline-primary w-100" type="submit">
              Filtrar
            </button>

            {actions}
          </div>
        </div>
      </form>
    </div>
  );
}