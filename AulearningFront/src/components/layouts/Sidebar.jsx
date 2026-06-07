import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();

  const menuByRole = {
    admin: [
      ['bi-speedometer2', 'Dashboard', '/dashboard'],
      ['bi-people', 'Usuarios', '/users'],
      ['bi-journal-bookmark', 'Cursos', '/courses'],
      ['bi-person-check', 'Inscripciones', '/enrollments'],
      ['bi-list-task', 'Tareas', '/tasks'],
      ['bi-folder2-open', 'Archivos', '/files'],
      ['bi-award', 'Calificaciones', '/grades'],
      ['bi-chat-dots', 'Chats', '/chats'],
      ['bi-bell', 'Notificaciones', '/notifications'],
    ],

    teacher: [
      ['bi-speedometer2', 'Dashboard', '/dashboard'],
      ['bi-journal-bookmark', 'Mis cursos', '/courses'],
      ['bi-people', 'Mis alumnos', '/students'],
      ['bi-list-task', 'Tareas', '/tasks'],
      ['bi-folder2-open', 'Materiales', '/files'],
      ['bi-award', 'Calificaciones', '/grades'],
      ['bi-chat-dots', 'Chats', '/chats'],
      ['bi-bell', 'Notificaciones', '/notifications'],
    ],

    student: [
      ['bi-speedometer2', 'Dashboard', '/dashboard'],
      ['bi-journal-bookmark', 'Mis cursos', '/courses'],
      ['bi-list-task', 'Mis tareas', '/tasks'],
      ['bi-folder2-open', 'Materiales', '/files'],
      ['bi-award', 'Mis notas', '/grades'],
      ['bi-chat-dots', 'Chats', '/chats'],
      ['bi-bell', 'Notificaciones', '/notifications'],
    ],
  };

  const links = menuByRole[user?.type] ?? [];

  const getRoleName = () => {
    switch (user?.type) {
      case 'admin':
        return 'Administrador';

      case 'teacher':
        return 'Profesor';

      case 'student':
        return 'Alumno';

      default:
        return 'Usuario';
    }
  };

  return (
    <aside className={`sidebar ${open ? 'show' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-logo">
          A
        </div>

        <div>
          <h5 className="mb-0">Aulearning</h5>

          <small>
            Learning Platform
          </small>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>

        <div>
          <div className="fw-semibold">
            {user?.name}
          </div>

          <small className="text-light-emphasis">
            {getRoleName()}
          </small>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map(([icon, label, path]) => (
          <NavLink
            key={path}
            to={path}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <i className={`bi ${icon}`} />

            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <small>
          © {new Date().getFullYear()} Aulearning
        </small>
      </div>
    </aside>
  );
}