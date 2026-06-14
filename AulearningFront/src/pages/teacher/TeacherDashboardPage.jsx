import { Link } from 'react-router-dom';

import DashboardHero from '../../components/dashboard/DashboardHero';
import DashboardQuickActions from '../../components/dashboard/DashboardQuickActions';
import DashboardSection from '../../components/dashboard/DashboardSection';
import DashboardSummaryCards from '../../components/dashboard/DashboardSummaryCards';

import DashboardService from '../../services/DashboardService';
import useDashboard from '../../hooks/useDashboard';

export default function TeacherDashboardPage() {
  const dashboard = useDashboard(() => DashboardService.teacher());

  if (!dashboard) return null;

  const cards = [
    {
      title: 'Mis cursos',
      value: dashboard.summary?.courses ?? 0,
      icon: 'bi-journal-bookmark',
      to: '/teacher/courses',
    },
    {
      title: 'Tareas',
      value: dashboard.summary?.tasks ?? 0,
      icon: 'bi-list-task',
      to: '/teacher/tasks',
    },
    {
      title: 'Entregas',
      value: dashboard.summary?.deliveries ?? 0,
      icon: 'bi-upload',
      to: '/teacher/deliveries',
    },
    {
      title: 'Alumnos',
      value: dashboard.summary?.students ?? 0,
      icon: 'bi-people',
      to: '/teacher/students',
    },
  ];

  const quickActions = [
    {
      label: 'Crear tarea',
      to: '/teacher/tasks',
    },
    {
      label: 'Subir material',
      to: '/teacher/files',
      outline: true,
    },
    {
      label: 'Ver calificaciones',
      to: '/teacher/grades',
      outline: true,
    },
  ];

  return (
    <div>
      <DashboardHero
        title="Dashboard profesor"
        subtitle="Gestiona tus cursos, tareas, entregas y seguimiento de alumnos."
        icon="bi-mortarboard"
      />

      <DashboardSummaryCards cards={cards} />

      <div className="row g-4">
        <div className="col-xl-7">
          <DashboardSection
            title="Últimas entregas"
            action={<Link to="/teacher/deliveries">Ver todo</Link>}
          >
            {(dashboard.latest_deliveries ?? []).length > 0 ? (
              <div className="learning-activity-list">
                {dashboard.latest_deliveries.map((delivery) => (
                  <div className="learning-activity-item" key={delivery.id}>
                    <i className="bi bi-upload" />

                    <span>
                      {delivery.student?.name ?? 'Alumno'} entregó{' '}
                      <strong>{delivery.task?.title ?? 'una tarea'}</strong>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0">
                No hay entregas recientes.
              </p>
            )}
          </DashboardSection>
        </div>

        <div className="col-xl-5">
          <DashboardSection title="Accesos rápidos">
            <DashboardQuickActions actions={quickActions} />
          </DashboardSection>
        </div>

        <div className="col-xl-6">
          <DashboardSection
            title="Últimas tareas"
            action={<Link to="/teacher/tasks">Ver tareas</Link>}
          >
            {(dashboard.latest_tasks ?? []).length > 0 ? (
              <div className="learning-task-list">
                {dashboard.latest_tasks.map((task) => (
                  <div className="learning-task-item" key={task.id}>
                    <div>
                      <strong>{task.title}</strong>
                      <small>{task.type}</small>
                    </div>

                    <span>#{task.id}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0">
                No hay tareas recientes.
              </p>
            )}
          </DashboardSection>
        </div>

        <div className="col-xl-6">
          <DashboardSection
            title="Mis cursos recientes"
            action={<Link to="/teacher/courses">Ver cursos</Link>}
          >
            {(dashboard.latest_courses ?? []).length > 0 ? (
              <div className="learning-task-list">
                {dashboard.latest_courses.map((course) => (
                  <div className="learning-task-item" key={course.id}>
                    <div>
                      <strong>{course.name}</strong>
                      <small>
                        {course.created_at
                          ? new Date(course.created_at).toLocaleDateString()
                          : ''}
                      </small>
                    </div>

                    <span>#{course.id}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0">
                No hay cursos recientes.
              </p>
            )}
          </DashboardSection>
        </div>
      </div>
    </div>
  );
}