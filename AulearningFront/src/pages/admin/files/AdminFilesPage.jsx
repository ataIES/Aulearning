import { useEffect, useState } from 'react';

import ConfirmModal from '../../../components/common/ConfirmModal';
import DataTable from '../../../components/table/DataTable';
import TableActionButtons from '../../../components/table/TableActionButtons';
import TableEntityCell from '../../../components/table/TableEntityCell';
import TablePagination from '../../../components/table/TablePagination';
import TableToolbar from '../../../components/table/TableToolbar';

import { useUI } from '../../../hooks/useUI';
import FileService from '../../../services/FileService';

const defaultFilters = {
  search: '',
  per_page: 10,
  page: 1,
};

export default function AdminFilesPage() {
  const { showError } = useUI();

  const [files, setFiles] = useState([]);
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [tableLoading, setTableLoading] = useState(false);

  const [fileToDelete, setFileToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const buildParams = () => {
    const params = {
      page: filters.page,
      per_page: filters.per_page,
    };

    if (filters.search) params.search = filters.search;

    return params;
  };

  const loadFiles = async () => {
    try {
      setTableLoading(true);

      const response = await FileService.paginate(buildParams());

      setFiles(response.data?.data ?? response.data?.items ?? []);
      setMeta(response.data?.meta ?? response.data?.pagination ?? null);
    } catch (error) {
      console.error(error);
      showError('No se pudieron cargar los archivos.');
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [filters.page, filters.per_page]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    event.stopPropagation();
    loadFiles();
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setTimeout(loadFiles, 0);
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;

    try {
      setDeleting(true);

      await FileService.delete(fileToDelete.id);

      setFileToDelete(null);
      await loadFiles();
    } catch {
      showError('No se pudo eliminar el archivo.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      label: 'Archivo',
      render: (file) => (
        <TableEntityCell
          icon="bi-file-earmark-text-fill"
          title={file.name}
          subtitle={file.mime_type ?? 'Archivo'}
          variant="blue"
        />
      ),
    },
    {
      label: 'Tamaño',
      render: (file) =>
        file.size
          ? `${(file.size / 1024).toFixed(1)} KB`
          : '-',
    },
    {
      label: 'Tarea',
      render: (file) =>
        file.task ? (
          <span>{file.task.title}</span>
        ) : (
          <span className="text-muted">Sin tarea</span>
        ),
    },
    {
      label: 'Fecha',
      render: (file) =>
        file.created_at
          ? new Date(file.created_at).toLocaleDateString()
          : '-',
    },
    {
      label: 'Acciones',
      render: (file) => (
        <TableActionButtons
          onView={() => window.open(file.url ?? file.path, '_blank')}
          onDelete={() => setFileToDelete(file)}
        />
      ),
    },
  ];

  return (
    <div>
      <TableToolbar
        title="Archivos"
        subtitle="Consulta y gestiona los archivos subidos en la plataforma."
        search={filters.search}
        searchPlaceholder="Buscar archivo..."
        onSearchChange={(value) => updateFilter('search', value)}
        onSearchSubmit={handleSearch}
        loading={tableLoading}
        filters={
          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.per_page}
              onChange={(event) =>
                updateFilter('per_page', event.target.value)
              }
            >
              <option value="10">10 por página</option>
              <option value="15">15 por página</option>
              <option value="25">25 por página</option>
              <option value="50">50 por página</option>
            </select>
          </div>
        }
        actions={
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleReset}
          >
            <i className="bi bi-arrow-clockwise" />
          </button>
        }
      />

      <div className="admin-panel-card">
        <DataTable
          columns={columns}
          data={files}
          loading={tableLoading}
        />

        <TablePagination
          meta={meta}
          onPageChange={(page) =>
            setFilters((prev) => ({
              ...prev,
              page,
            }))
          }
        />
      </div>

      <ConfirmModal
        show={Boolean(fileToDelete)}
        title="Eliminar archivo"
        message={`¿Seguro que quieres eliminar "${fileToDelete?.name ?? ''}"?`}
        confirmText="Eliminar"
        loading={deleting}
        onClose={() => setFileToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}