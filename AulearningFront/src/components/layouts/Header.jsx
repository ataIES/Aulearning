import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';

export default function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { setLoading, showSuccess, showError } = useUI();

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      
    } catch {
      showError('No se pudo cerrar la sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="app-header">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-light d-lg-none"
          onClick={onToggleSidebar}
        >
          <i className="bi bi-list fs-4" />
        </button>

        <div>
          <h5 className="mb-0">Panel de gestión</h5>
          <small className="text-muted">
            Bienvenido, {user?.name ?? 'Usuario'}
          </small>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="text-end d-none d-md-block">
          <small className="fw-semibold d-block">{user?.email}</small>
          <small className="text-muted">{user?.type}</small>
        </div>

        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-1" />
          <span className="d-none d-sm-inline">Salir</span>
        </button>
      </div>
    </header>
  );
}