import { Link } from 'react-router-dom';

import DashboardHero from '../../components/dashboard/DashboardHero';
import DashboardQuickActions from '../../components/dashboard/DashboardQuickActions';
import DashboardSection from '../../components/dashboard/DashboardSection';
import DashboardSummaryCards from '../../components/dashboard/DashboardSummaryCards';

import DashboardService from '../../services/DashboardService';
import useDashboard from '../../hooks/useDashboard';

export default function StudentDashboardPage() {
  const dashboard = useDashboard(() => DashboardService.student());

  if (!dashboard) return null;

  const cards = [
    {
      title: 'Mis cursos',
      value: dashboard.summary?.courses ?? 0,
      icon: 'bi-journal-bookmark',
      to: '/student/courses',
    },
    {
      title: 'Tareas pendientes',
      value: dashboard.summary?.pending_tasks ?? 0,
      icon: 'bi-list-task',
      to: '/student/tasks',
    },
    {
      title: 'Materiales',
      value: dashboard.summary?.materials ?? 0,
      icon: 'bi-folder2-open',
      to: '/student/files',
    },
    {
      title: 'Notas',
      value: dashboard.summary?.grades ?? 0,
      icon: 'bi-award',
      to: '/student/grades',
    },
  ];

  const quickActions = [
    {
      label: 'Ver tareas',
      to: '/student/tasks',
    },
    {
      label: 'Ver material',
      to: '/student/files',
      outline: true,
    },
    {
      label: 'Ver mis notas',
      to: '/student/grades',
      outline: true,
    },
  ];

  return (
    <div>
      <DashboardHero
        title="Dashboard alumno"
        subtitle="Consulta tus cursos, tareas pendientes, materiales y calificaciones."
        icon="bi-backpack"
        gradient="student-hero"
      />

      <DashboardSummaryCards cards={cards} />

      <div className="row g-4">
        <div className="col-xl-7">
          <DashboardSection
            title="Próximas tareas"
            action={<Link to="/student/tasks">Ver tareas</Link>}
          >
            {(dashboard.upcoming_tasks ?? []).length > 0 ? (
              <div className="learning-task-list">
                {dashboard.upcoming_tasks.map((task) => (
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
                No tienes tareas pendientes.
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
            title="Últimas notas"
            action={<Link to="/student/grades">Ver notas</Link>}
          >
            {(dashboard.latest_grades ?? []).length > 0 ? (
              <div className="learning-task-list">
                {dashboard.latest_grades.map((grade) => (
                  <div className="learning-task-item" key={grade.id}>
                    <div>
                      <strong>{grade.task?.title ?? 'Tarea'}</strong>
                      <small>{grade.comment ?? 'Sin comentario'}</small>
                    </div>

                    <span>{grade.grade}/10</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0">
                Todavía no hay notas publicadas.
              </p>
            )}
          </DashboardSection>
        </div>

        <div className="col-xl-6">
          <DashboardSection
            title="Mis cursos recientes"
            action={<Link to="/student/courses">Ver cursos</Link>}
          >
            {(dashboard.courses ?? []).length > 0 ? (
              <div className="learning-task-list">
                {dashboard.courses.map((course) => (
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
                No tienes cursos asignados.
              </p>
            )}
          </DashboardSection>
        </div>
      </div>
    </div>
  );
}