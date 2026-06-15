import { useEffect, useState } from 'react';

import ConfirmModal from '../../../components/common/ConfirmModal';
import DataTable from '../../../components/table/DataTable';
import TableActionButtons from '../../../components/table/TableActionButtons';
import TableEntityCell from '../../../components/table/TableEntityCell';
import TablePagination from '../../../components/table/TablePagination';
import TableToolbar from '../../../components/table/TableToolbar';

import { useUI } from '../../../hooks/useUI';
import NotificationService from '../../../services/NotificationService';

import NotificationFormModal from './NotificationFormModal';

const defaultFilters = {
  search: '',
  type: '',
  per_page: 10,
  page: 1,
};

export default function AdminNotificationsPage() {
  const { showError } = useUI();

  const [notifications, setNotifications] = useState([]);
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [tableLoading, setTableLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const buildParams = () => {
    const params = {
      page: filters.page,
      per_page: filters.per_page,
    };

    if (filters.search) params.search = filters.search;
    if (filters.type) params.type = filters.type;

    return params;
  };

  const loadNotifications = async () => {
    try {
      setTableLoading(true);

      const response = await NotificationService.paginate(buildParams());

      setNotifications(response.data?.data ?? response.data?.items ?? []);
      setMeta(response.data?.meta ?? response.data?.pagination ?? null);
    } catch {
      showError('No se pudieron cargar las notificaciones.');
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
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
    loadNotifications();
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setTimeout(loadNotifications, 0);
  };

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      setFormErrors({});

      await NotificationService.create(payload);

      setShowForm(false);
      await loadNotifications();
    } catch (error) {
      const response = error.response?.data;

      if (response?.errors) {
        setFormErrors(response.errors);

        const firstKey = Object.keys(response.errors)[0];
        const firstMessage = response.errors[firstKey]?.[0];

        showError(firstMessage ?? response.message, 'Error de validación');
        return;
      }

      showError(response?.message ?? 'No se pudo crear la notificación.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!notificationToDelete) return;

    try {
      setDeleting(true);

      await NotificationService.delete(notificationToDelete.id);

      setNotificationToDelete(null);
      await loadNotifications();
    } catch {
      showError('No se pudo eliminar la notificación.');
    } finally {
      setDeleting(false);
    }
  };

  const typeBadge = (type) => {
    const labels = {
      global: 'Global',
      system: 'Sistema',
      course: 'Curso',
      user: 'Usuario',
    };

    return (
      <span className="badge bg-primary-subtle text-primary">
        {labels[type] ?? type}
      </span>
    );
  };

  const columns = [
    {
      label: 'Notificación',
      render: (notification) => (
        <TableEntityCell
          icon="bi-bell-fill"
          title={notification.title}
          subtitle={notification.content}
          variant="purple"
        />
      ),
    },
    {
      label: 'Tipo',
      render: (notification) => typeBadge(notification.type),
    },
    {
      label: 'Fecha',
      render: (notification) =>
        notification.created_at
          ? new Date(notification.created_at).toLocaleString()
          : '-',
    },
    {
      label: 'Acciones',
      render: (notification) => (
        <TableActionButtons
          onDelete={() => setNotificationToDelete(notification)}
        />
      ),
    },
  ];

  return (
    <div>
      <TableToolbar
        title="Notificaciones"
        subtitle="Gestiona avisos y comunicaciones de la plataforma."
        search={filters.search}
        searchPlaceholder="Buscar notificación..."
        onSearchChange={(value) => updateFilter('search', value)}
        onSearchSubmit={handleSearch}
        createLabel="Nueva notificación"
        onCreate={() => {
          setFormErrors({});
          setShowForm(true);
        }}
        filters={
          <>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.type}
                onChange={(event) => updateFilter('type', event.target.value)}
              >
                <option value="">Todos los tipos</option>
                <option value="global">Global</option>
                <option value="system">Sistema</option>
                <option value="course">Curso</option>
                <option value="user">Usuario</option>
              </select>
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.per_page}
                onChange={(event) => updateFilter('per_page', event.target.value)}
              >
                <option value="10">10 por página</option>
                <option value="15">15 por página</option>
                <option value="25">25 por página</option>
                <option value="50">50 por página</option>
              </select>
            </div>
          </>
        }
        actions={
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={handleReset}
          >
            <i className="bi bi-arrow-clockwise" />
          </button>
        }
      />

      <div className="admin-panel-card">
        <DataTable
          columns={columns}
          data={notifications}
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

      <NotificationFormModal
        show={showForm}
        errors={formErrors}
        loading={saving}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        show={Boolean(notificationToDelete)}
        title="Eliminar notificación"
        message={`¿Seguro que quieres eliminar "${notificationToDelete?.title ?? ''}"?`}
        confirmText="Eliminar"
        loading={deleting}
        onClose={() => setNotificationToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}