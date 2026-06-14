import { useEffect, useState } from 'react';

import ConfirmModal from '../../../components/common/ConfirmModal';
import DataTable from '../../../components/table/DataTable';
import TablePagination from '../../../components/table/TablePagination';

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
};

export default function AdminUsersPage() {
    const { setLoading, showError } = useUI();
    const [tableLoading, setTableLoading] = useState(false);

    const [users, setUsers] = useState([]);
    const [meta, setMeta] = useState(null);
    const [filters, setFilters] = useState(defaultFilters);

    const [showForm, setShowForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const [userToDelete, setUserToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const buildParams = () => {
        const params = {
            page: filters.page,
            per_page: filters.per_page,
        };

        if (filters.search) {
            params.search = filters.search;
            params.searchBy = filters.searchBy;
        }

        if (filters.type) params.type = filters.type;
        if (filters.active !== '') params.active = filters.active;

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
    }, [filters.page, filters.per_page]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
            page: 1,
        }));
    };

    const handleSearch = (event) => {
        event.preventDefault();
        loadUsers();
    };

    const handleReset = () => {
        setFilters(defaultFilters);
        setTimeout(loadUsers, 0);
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
            }

            showError(response?.message ?? 'No se pudo guardar el usuario.');
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = (user) => {
        setUserToDelete(user);
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

        return (
            <span className={`badge role-badge role-${type}`}>
                {labels[type] ?? type}
            </span>
        );
    };

    const columns = [
        {
            label: 'Usuario',
            render: (user) => (
                <div className="table-user">
                    <div className="table-avatar">
                        {(user.name ?? 'U').charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <strong>{user.name}</strong>
                        <small>ID #{user.id}</small>
                    </div>
                </div>
            ),
        },
        {
            label: 'Email',
            key: 'email',
        },
        {
            label: 'Tipo',
            render: (user) => roleBadge(user.type),
        },
        {
            label: 'Estado',
            render: (user) =>
                user.active ? (
                    <span className="badge bg-success-subtle text-success">Activo</span>
                ) : (
                    <span className="badge bg-secondary-subtle text-secondary">Inactivo</span>
                ),
        },
        {
            label: 'Acciones',
            render: (user) => (
                <div className="btn-group">
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openEdit(user)}
                    >
                        <i className="bi bi-pencil" />
                    </button>

                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => confirmDelete(user)}
                    >
                        <i className="bi bi-trash" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="admin-dashboard-header">
                <div>
                    <h3>Usuarios</h3>
                    <p>Gestiona administradores, profesores y alumnos.</p>
                </div>

                <button className="btn btn-primary" onClick={openCreate}>
                    <i className="bi bi-plus-lg me-1" />
                    Nuevo usuario
                </button>
            </div>

            <div className="admin-panel-card mb-3">
                <form onSubmit={handleSearch}>
                    <div className="row g-2">
                        <div className="col-md-4">
                            <input
                                name="search"
                                className="form-control"
                                placeholder="Buscar por nombre o email..."
                                value={filters.search}
                                onChange={handleFilterChange}
                            />
                        </div>

                        <div className="col-md-2">
                            <select
                                name="type"
                                className="form-select"
                                value={filters.type}
                                onChange={handleFilterChange}
                            >
                                <option value="">Todos los roles</option>
                                <option value="admin">Administrador</option>
                                <option value="teacher">Profesor</option>
                                <option value="student">Alumno</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <select
                                name="active"
                                className="form-select"
                                value={filters.active}
                                onChange={handleFilterChange}
                            >
                                <option value="">Todos</option>
                                <option value="1">Activos</option>
                                <option value="0">Inactivos</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <select
                                name="per_page"
                                className="form-select"
                                value={filters.per_page}
                                onChange={handleFilterChange}
                            >
                                <option value="10">10 por página</option>
                                <option value="15">15 por página</option>
                                <option value="25">25 por página</option>
                                <option value="50">50 por página</option>
                            </select>
                        </div>

                        <div className="col-md-2 d-flex gap-2">
                            <button className="btn btn-outline-primary w-100" type="submit">
                                Filtrar
                            </button>

                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={handleReset}
                            >
                                <i className="bi bi-arrow-clockwise" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="admin-panel-card">
                <DataTable
                    columns={columns}
                    data={users}
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
                message={`¿Seguro que quieres eliminar a ${userToDelete?.name ?? 'este usuario'}?`}
                confirmText="Eliminar"
                loading={deleting}
                onClose={() => setUserToDelete(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}