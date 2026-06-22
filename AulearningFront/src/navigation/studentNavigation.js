const studentNavigation = [
  {
    title: 'General',
    items: [
      {
        icon: 'bi-speedometer2',
        label: 'Dashboard',
        to: '/student/dashboard',
      },
    ],
  },
  {
    title: 'Mis cursos',
    items: [
      {
        icon: 'bi-journal-bookmark',
        label: 'Cursos',
        to: '/student/courses',
      },
      {
        icon: 'bi-folder2-open',
        label: 'Material',
        to: '/student/files',
      },
    ],
  },
  {
    title: 'Trabajo',
    items: [
      {
        icon: 'bi-list-task',
        label: 'Tareas',
        to: '/student/tasks',
      },
      {
        icon: 'bi-award',
        label: 'Mis notas',
        to: '/student/grades',
      },
    ],
  },
  {
    title: 'Organización',
    items: [
      {
        icon: 'bi-calendar-event',
        label: 'Calendario',
        to: '/student/calendar',
      },
    ],
  },
  {
    title: 'Comunicación',
    items: [
      {
        icon: 'bi-chat-dots',
        label: 'Mensajes',
        to: '/student/chats',
      },
      {
        icon: 'bi-bell',
        label: 'Notificaciones',
        to: '/student/notifications',
      },
    ],
  },
];

export default studentNavigation;