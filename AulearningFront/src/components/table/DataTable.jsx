import EmptyState from './EmptyState';
import TableLoader from './TableLoader';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
}) {
  if (loading) {
    return <TableLoader />;
  }

  if (!data.length) {
    return (
      <EmptyState
        title="Sin registros"
        message="No se encontraron datos."
      />
    );
  }

  return (
    <div className="table-responsive">
      <table className="table admin-table align-middle mb-0">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key || column.label}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.key || column.label}>
                  {column.render
                    ? column.render(row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}