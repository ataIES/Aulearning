import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import NotificationsDropdown from '../../components/common/NotificationsDropdown';

export default function AdminHeader({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { setLoading } = useUI();

  const handleLogout = async () => {
    setLoading(true);

    try {
      await logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="admin-header">
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
        >
          <i className="bi bi-list" />
        </button>

        <div>
          <h5>Panel de administración</h5>
          <small>Gestión sencilla de la plataforma</small>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <small className="admin-email">{user?.email}</small>

        <NotificationsDropdown />

        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
          Salir
        </button>
      </div>
    </header>
  );
}