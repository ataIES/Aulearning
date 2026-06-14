const teacherNavigation = [
  {
    title: 'General',
    items: [
      {
        icon: 'bi-speedometer2',
        label: 'Dashboard',
        to: '/teacher/dashboard',
      },
    ],
  },
  {
    title: 'Docencia',
    items: [
      {
        icon: 'bi-journal-bookmark',
        label: 'Mis cursos',
        to: '/teacher/courses',
      },
      {
        icon: 'bi-people',
        label: 'Alumnos',
        to: '/teacher/students',
      },
    ],
  },
  {
    title: 'Contenido',
    items: [
      {
        icon: 'bi-folder2-open',
        label: 'Material',
        to: '/teacher/files',
      },
      {
        icon: 'bi-list-task',
        label: 'Tareas',
        to: '/teacher/tasks',
      },
      {
        icon: 'bi-upload',
        label: 'Entregas',
        to: '/teacher/deliveries',
      },
    ],
  },
  {
    title: 'Seguimiento',
    items: [
      {
        icon: 'bi-award',
        label: 'Calificaciones',
        to: '/teacher/grades',
      },
      {
        icon: 'bi-calendar-event',
        label: 'Calendario',
        to: '/teacher/calendar',
      },
    ],
  },
  {
    title: 'Comunicación',
    items: [
      {
        icon: 'bi-chat-dots',
        label: 'Mensajes',
        to: '/teacher/chats',
      },
      {
        icon: 'bi-bell',
        label: 'Notificaciones',
        to: '/teacher/notifications',
      },
    ],
  },
];

export default teacherNavigation;