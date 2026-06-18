import { NavLink } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

export default function LearningSidebar({ open = false, onClose }) {
  const { user } = useAuth();

  const isTeacher = user?.type === 'teacher';

  const links = isTeacher
    ? [
        {
          label: 'Dashboard',
          icon: 'bi-speedometer2',
          to: '/teacher/dashboard',
        },
        {
          label: 'Mis cursos',
          icon: 'bi-journal-bookmark-fill',
          to: '/teacher/courses',
        },
        {
          label: 'Mis alumnos',
          icon: 'bi-people-fill',
          to: '/teacher/students',
        },
        {
          label: 'Perfil',
          icon: 'bi-person-circle',
          to: '/teacher/profile',
        },
      ]
    : [
        {
          label: 'Dashboard',
          icon: 'bi-speedometer2',
          to: '/student/dashboard',
        },
        {
          label: 'Mis cursos',
          icon: 'bi-journal-bookmark-fill',
          to: '/student/courses',
        },
        {
          label: 'Tareas',
          icon: 'bi-list-task',
          to: '/student/tasks',
        },
        {
          label: 'Calificaciones',
          icon: 'bi-award-fill',
          to: '/student/grades',
        },
      ];

  return (
    <>
      <aside className={`learning-sidebar ${open ? 'open' : ''}`}>
        <div className="learning-sidebar-brand">
          <div className="learning-sidebar-logo">A</div>

          <div>
            <h4>Aulearning</h4>
            <span>{isTeacher ? 'Profesor' : 'Alumno'}</span>
          </div>

          <button
            type="button"
            className="learning-sidebar-close"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <nav className="learning-sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `learning-sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <i className={`bi ${link.icon}`} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {open && (
        <button
          type="button"
          className="learning-sidebar-backdrop"
          onClick={onClose}
          aria-label="Cerrar menú"
        />
      )}
    </>
  );
}