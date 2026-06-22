export default function TablePagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null;

  return (
    <div className="table-pagination">
      <small>
        Página {meta.current_page} de {meta.last_page} · {meta.total} registros
      </small>

      <div className="btn-group">
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={meta.current_page <= 1}
          onClick={() => onPageChange(meta.current_page - 1)}
        >
          Anterior
        </button>

        <button
          className="btn btn-outline-primary btn-sm"
          disabled={meta.current_page >= meta.last_page}
          onClick={() => onPageChange(meta.current_page + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}