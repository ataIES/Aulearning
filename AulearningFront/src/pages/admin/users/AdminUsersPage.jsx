import { useEffect, useState } from 'react';

import ConfirmModal from '../../../components/common/ConfirmModal';
import DataTable from '../../../components/table/DataTable';
import TableActionButtons from '../../../components/table/TableActionButtons';
import TablePagination from '../../../components/table/TablePagination';
import TableToolbar from '../../../components/table/TableToolbar';
import TableUserCell from '../../../components/table/TableUserCell';

import { useUI } from '../../../hooks/useUI';
import UserService from '../../../services/UserService';

import UserFormModal from './UserFormModal';

const defaultFilters = {
  search: '',
  searchBy: 'all',
  type: '',
  active: '',
  per_page: 10,
  page: 1,
  sort_by: 'name',
  sort_direction: 'asc',
};

export default function AdminUsersPage() {
  const { showError } = useUI();

  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const [tableLoading, setTableLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const buildParams = () => {
    const params = {
      page: appliedFilters.page,
      per_page: appliedFilters.per_page,
    };

    if (appliedFilters.search) {
      params.search = appliedFilters.search;
      params.searchBy = appliedFilters.searchBy;
    }

    if (appliedFilters.type) params.type = appliedFilters.type;
    if (appliedFilters.active !== '') params.active = appliedFilters.active;

    params.sort_by = appliedFilters.sort_by;
    params.sort_direction = appliedFilters.sort_direction;

    return params;
  };

  const loadUsers = async () => {
    try {
      setTableLoading(true);

      const response = await UserService.paginate(buildParams());

      setUsers(response.data?.data ?? response.data?.items ?? []);
      setMeta(response.data?.meta ?? response.data?.pagination ?? null);
    } catch {
      showError('No se pudo cargar la lista de usuarios.');
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [appliedFilters]);

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

    setAppliedFilters({
      ...filters,
      page: 1,
    });
  };

  const handleReset = () => {
    setFilters({ ...defaultFilters });
    setAppliedFilters({ ...defaultFilters });
  };

  const openCreate = () => {
    setSelectedUser(null);
    setFormErrors({});
    setShowForm(true);
  };

  const openEdit = (user) => {
    setSelectedUser(user);
    setFormErrors({});
    setShowForm(true);
  };

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      setFormErrors({});

      if (selectedUser) {
        await UserService.update(selectedUser.id, payload);
      } else {
        await UserService.create(payload);
      }

      setShowForm(false);
      setSelectedUser(null);

      await loadUsers();
    } catch (error) {
      const response = error.response?.data;

      if (response?.errors) {
        setFormErrors(response.errors);

        const firstKey = Object.keys(response.errors)[0];
        const firstMessage = response.errors[firstKey]?.[0];

        showError(firstMessage ?? response.message, 'Error de validación');
        return;
      }

      showError(response?.message ?? 'No se pudo guardar el usuario.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      setDeleting(true);

      await UserService.delete(userToDelete.id);

      setUserToDelete(null);
      await loadUsers();
    } catch {
      showError('No se pudo eliminar el usuario.');
    } finally {
      setDeleting(false);
    }
  };

  const roleBadge = (type) => {
    const labels = {
      admin: 'Administrador',
      teacher: 'Profesor',
      student: 'Alumno',
    };

    return <span className={`badge role-badge role-${type}`}>{labels[type] ?? type}</span>;
  };

  const columns = [
    {
      label: 'Usuario',
      render: (user) => (
        <TableUserCell
          name={`${user.name ?? ''} ${user.last_name ?? ''}`}
          email={user.email}
        />
      ),
    },
    {
      label: 'Rol',
      render: (user) => roleBadge(user.type),
    },
    {
      label: 'Estado',
      render: (user) =>
        user.active ? (
          <span className="badge bg-success-subtle text-success">Activo</span>
        ) : (
          <span className="badge bg-secondary-subtle text-secondary">
            Inactivo
          </span>
        ),
    },
    {
      label: 'Acciones',
      render: (user) => (
        <TableActionButtons
          onEdit={() => openEdit(user)}
          onDelete={() => setUserToDelete(user)}
        />
      ),
    },
  ];

  return (
    <div>
      <TableToolbar
        title="Usuarios"
        subtitle="Gestiona administradores, profesores y alumnos."
        search={filters.search}
        searchPlaceholder={
          filters.searchBy === 'name'
            ? 'Buscar por nombre...'
            : filters.searchBy === 'email'
              ? 'Buscar por email...'
              : 'Buscar por nombre o email...'
        }
        onSearchChange={(value) => updateFilter('search', value)}
        onSearchSubmit={handleSearch}
        createLabel="Nuevo usuario"
        onCreate={openCreate}
        loading={tableLoading}
        createDisabled={tableLoading}
        filters={
          <>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.searchBy}
                onChange={(event) => updateFilter('searchBy', event.target.value)}
              >
                <option value="all">Todo</option>
                <option value="name">Nombre</option>
                <option value="email">Email</option>
              </select>
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.type}
                onChange={(event) => updateFilter('type', event.target.value)}
              >
                <option value="">Todos los roles</option>
                <option value="admin">Administrador</option>
                <option value="teacher">Profesor</option>
                <option value="student">Alumno</option>
              </select>
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.active}
                onChange={(event) => updateFilter('active', event.target.value)}
              >
                <option value="">Todos</option>
                <option value="1">Activos</option>
                <option value="0">Inactivos</option>
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
            disabled={tableLoading}
          >
            <i className="bi bi-arrow-clockwise" />
          </button>
        }
      />

      <div className="admin-panel-card">
        <DataTable columns={columns} data={users} loading={tableLoading} />

        <TablePagination
          meta={meta}
          onPageChange={(page) =>
            setAppliedFilters((prev) => ({
              ...prev,
              page,
            }))
          }
        />
      </div>

      <UserFormModal
        show={showForm}
        user={selectedUser}
        errors={formErrors}
        loading={saving}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        show={Boolean(userToDelete)}
        title="Eliminar usuario"
        message={`¿Seguro que quieres eliminar a ${userToDelete?.name ?? 'este usuario'
          }?`}
        confirmText="Eliminar"
        loading={deleting}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}