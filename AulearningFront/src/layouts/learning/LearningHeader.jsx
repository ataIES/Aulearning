import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import NotificationsDropdown from '../../components/common/NotificationsDropdown';

export default function LearningHeader({ onToggleSidebar }) {
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

  const title = user?.type === 'teacher'
    ? 'Área del profesor'
    : 'Área del alumno';

  return (
    <header className="learning-header">
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
        >
          <i className="bi bi-list" />
        </button>

        <div>
          <h5>{title}</h5>
          <small>Bienvenido, {user?.name ?? user?.nombre}</small>
        </div>
      </div>

      <NotificationsDropdown></NotificationsDropdown>
      <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
        Salir
      </button>
    </header>
  );
}