import { useEffect, useState } from 'react';

import DataTable from '../../../components/table/DataTable';
import TableActionButtons from '../../../components/table/TableActionButtons';
import TableEntityCell from '../../../components/table/TableEntityCell';
import { useUI } from '../../../hooks/useUI';

import RoleService from '../../../services/RoleService';
import PermissionService from '../../../services/PermissionService';
import LoadingButton from '../../../components/common/LoadingButton';

export default function AdminRolesPage() {
  const { showError, setLoading } = useUI();

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [savingPermissions, setSavingPermissions] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const [rolesResponse, permissionsResponse] = await Promise.all([
        RoleService.paginate(),
        PermissionService.list(),
      ]);

      setRoles(rolesResponse.data ?? []);
      setPermissions(permissionsResponse.data ?? []);
    } catch {
      showError('No se pudieron cargar roles y permisos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openPermissions = (role) => {
    setSelectedRole(role);
    setSelectedPermissions(role.permissions?.map((p) => p.name) ?? []);
  };

  const togglePermission = (permissionName) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionName)
        ? prev.filter((item) => item !== permissionName)
        : [...prev, permissionName]
    );
  };

  const savePermissions = async () => {
    try {
      setSavingPermissions(true);

      await RoleService.syncPermissions(
        selectedRole.id,
        selectedPermissions
      );

      setSelectedRole(null);

      await loadData();
    } catch {
      showError('No se pudieron actualizar los permisos del rol.');
    } finally {
      setSavingPermissions(false);
    }
  };

  const groupedPermissions = permissions.reduce((groups, permission) => {
    const group = permission.name.split('.')[0];

    return {
      ...groups,
      [group]: [...(groups[group] ?? []), permission],
    };
  }, {});

  const columns = [
    {
      label: 'Rol',
      render: (role) => (
        <TableEntityCell
          icon="bi-shield-lock-fill"
          title={role.name}
          subtitle={`${role.permissions?.length ?? 0} permisos`}
          variant="purple"
        />
      ),
    },
    {
      label: 'Permisos',
      render: (role) => (
        <span className="text-muted">
          {role.permissions?.slice(0, 4).map((p) => p.name).join(', ')}

          {(role.permissions?.length ?? 0) > 4 && '...'}
        </span>
      ),
    },
    {
      label: 'Acciones',
      render: (role) => (
        <TableActionButtons
          extra={[
            {
              title: 'Gestionar permisos',
              icon: 'bi-key-fill',
              variant: 'primary',
              onClick: () => openPermissions(role),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="admin-dashboard-header">
        <div>
          <h3>Roles y permisos</h3>
          <p>Gestiona qué puede hacer cada tipo de usuario.</p>
        </div>
      </div>

      <div className="admin-panel-card">
        <DataTable columns={columns} data={roles} />
      </div>

      {selectedRole && (
        <div className="error-modal-backdrop">
          <div className="form-modal permissions-modal">
            <div className="form-modal-header">
              <div>
                <h4>Permisos de {selectedRole.name}</h4>
                <p>Selecciona los permisos asignados a este rol.</p>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={() => setSelectedRole(null)}
              />
            </div>

            <div className="permissions-grid">
              {Object.entries(groupedPermissions).map(([group, items]) => (
                <div className="permission-group" key={group}>
                  <h6>{group}</h6>

                  {items.map((permission) => (
                    <label className="permission-check" key={permission.id}>
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission.name)}
                        onChange={() => togglePermission(permission.name)}
                      />

                      <span>{permission.name}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setSelectedRole(null)}
              >
                Cancelar
              </button>

              <LoadingButton
                loading={savingPermissions}
                loadingText="Actualizando..."
                icon="bi-check-lg"
                onClick={savePermissions}
              >
                Guardar permisos
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}