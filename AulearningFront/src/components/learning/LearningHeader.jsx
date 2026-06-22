import { Link } from 'react-router-dom';

import NotificationsDropdown from '../common/NotificationsDropdown';
import { useAuth } from '../../hooks/useAuth';

export default function LearningHeader({
  title = 'Dashboard',
  subtitle = 'Bienvenido a tu espacio académico',
  onToggleSidebar,
}) {
  const { user, logout } = useAuth();

  const initial = user?.name?.charAt(0)?.toUpperCase() ?? 'U';
  const roleLabel = user?.type === 'teacher' ? 'Profesor' : 'Alumno';

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="learning-header">
      <div className="learning-header-top">
        <div className="learning-header-left">
          <button
            type="button"
            className="learning-menu-button"
            onClick={onToggleSidebar}
            aria-label="Abrir menú"
          >
            <i className="bi bi-list" />
          </button>

          <div>
            <h2>{title}</h2>
            <small>{subtitle}</small>
          </div>
        </div>

        <div className="learning-header-right">
          <NotificationsDropdown />

          <Link className="learning-profile" to={`/${user?.type}/profile`}>
            <div className="learning-avatar">{initial}</div>

            <div className="learning-profile-text">
              <strong>{user?.name ?? 'Usuario'}</strong>
              <small>{roleLabel}</small>
            </div>
          </Link>

          <button
            type="button"
            className="learning-logout-button"
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            <i className="bi bi-box-arrow-right" />
          </button>
        </div>
      </div>
    </header>
  );
}