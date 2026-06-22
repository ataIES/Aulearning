export const adminNavigation = [
  {
    title: 'General',
    items: [
      { icon: 'bi-speedometer2', label: 'Dashboard', to: '/admin/dashboard' },
    ],
  },
  {
    title: 'Gestión',
    items: [
      { icon: 'bi-people', label: 'Usuarios', to: '/admin/users' },
      { icon: 'bi-journal-bookmark', label: 'Cursos', to: '/admin/courses' },
      { icon: 'bi-person-check', label: 'Inscripciones', to: '/admin/enrollments' },
      { icon: 'bi-list-task', label: 'Tareas', to: '/admin/tasks' },
      { icon: 'bi-folder2-open', label: 'Archivos', to: '/admin/files' },
    ],
  },
  {
    title: 'Comunicación',
    items: [
      { icon: 'bi-bell', label: 'Notificaciones', to: '/admin/notifications' },
    ],
  },
  {
    title: 'Seguridad',
    items: [
      { icon: 'bi-shield-lock', label: 'Roles', to: '/admin/roles' },
      { icon: 'bi-key', label: 'Permisos', to: '/admin/permissions' },
    ],
  },
];