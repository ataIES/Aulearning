import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PageLoader from '../../components/common/PageLoader';
import ActivityItem from '../../components/learning/ActivityItem';
import CourseCard from '../../components/learning/CourseCard';
import EmptyLearningState from '../../components/learning/EmptyLearningState';
import LearningPanel from '../../components/learning/LearningPanel';
import LearningStatCard from '../../components/learning/LearningStatCard';
import QuickAction from '../../components/learning/QuickAction';
import StudentCourseCard from '../../components/learning/StudentCourseCard';

import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import StudentService from '../../services/StudentService';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const { showError } = useUI();

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await StudentService.dashboard();

      const data =
        response?.data?.data ??
        response?.data ??
        response ??
        null;

      setDashboard(data);
    } catch (error) {
      console.error(error);
      showError('No se pudo cargar el dashboard del alumno.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <PageLoader
        title="Cargando dashboard"
        message="Preparando tu espacio de aprendizaje..."
      />
    );
  }

  const summary = dashboard?.summary ?? {};

  return (
    <div className="learning-dashboard">
      <section className="learning-hero">
        <div>
          <span className="learning-kicker">Panel alumno</span>

          <h2>Hola, {user?.name ?? 'alumno'} 👋</h2>

          <p>
            Consulta tus cursos, tareas pendientes, materiales y últimas
            calificaciones desde un único lugar.
          </p>
        </div>

        <div className="learning-hero-icon">
          <i className="bi bi-backpack-fill" />
        </div>
      </section>

      <section className="learning-stats-grid">
        <LearningStatCard
          icon="bi-journal-bookmark-fill"
          value={summary.courses ?? 0}
          label="Cursos matriculados"
        />

        <LearningStatCard
          icon="bi-list-task"
          value={summary.pending_tasks ?? 0}
          label="Tareas pendientes"
          variant="warning"
        />

        <LearningStatCard
          icon="bi-upload"
          value={summary.deliveries ?? 0}
          label="Entregas realizadas"
          variant="green"
        />

        <LearningStatCard
          icon="bi-award-fill"
          value={summary.graded_deliveries ?? 0}
          label="Calificadas"
          variant="purple"
        />
      </section>

      <div className="row g-4 mt-1">
        <div className="col-xl-8">
          <LearningPanel
            title="Mis cursos"
            subtitle="Cursos en los que estás matriculado."
            action={
              <Link
                to="/student/courses"
                className="btn btn-outline-primary btn-sm"
              >
                Ver todos
              </Link>
            }
          >
            <div className="teacher-course-grid">
              {(dashboard?.courses ?? []).length > 0 ? (
                dashboard.courses.map((course) => (
                  <StudentCourseCard
                    key={course.id}
                    course={course}
                    to={`/student/courses/${course.id}`}
                  />
                ))
              ) : (
                <EmptyLearningState
                  icon="bi-journal-x"
                  title="Sin cursos"
                  message="Todavía no tienes cursos matriculados."
                />
              )}
            </div>
          </LearningPanel>
        </div>

        <div className="col-xl-4">
          <LearningPanel
            title="Acciones rápidas"
            subtitle="Accede rápidamente a tus zonas principales."
          >
            <div className="learning-actions">
              <QuickAction
                to="/student/courses"
                icon="bi-journal-bookmark-fill"
                label="Mis cursos"
              />

              <QuickAction
                to="/student/tasks"
                icon="bi-list-task"
                label="Mis tareas"
              />

              <QuickAction
                to="/student/grades"
                icon="bi-award-fill"
                label="Mis calificaciones"
              />
            </div>
          </LearningPanel>
        </div>

        <div className="col-xl-6">
          <LearningPanel
            title="Próximas tareas"
            subtitle="Tareas con fecha de entrega cercana."
          >
            <div className="learning-list">
              {(dashboard?.upcoming_tasks ?? []).length > 0 ? (
                dashboard.upcoming_tasks.map((task) => (
                  <ActivityItem
                    key={task.id}
                    icon="bi-calendar-event"
                    variant="purple"
                    title={task.title}
                    subtitle={`${task.course?.name ?? 'Curso'} · ${task.due_date
                        ? new Date(task.due_date).toLocaleDateString()
                        : 'Sin fecha'
                      }`}
                  />
                ))
              ) : (
                <EmptyLearningState
                  icon="bi-calendar-x"
                  title="Sin próximas tareas"
                  message="No tienes tareas próximas con fecha de entrega."
                />
              )}
            </div>
          </LearningPanel>
        </div>

        <div className="col-xl-6">
          <LearningPanel
            title="Últimas calificaciones"
            subtitle="Tus entregas calificadas recientemente."
          >
            <div className="learning-list">
              {(dashboard?.latest_grades ?? []).length > 0 ? (
                dashboard.latest_grades.map((delivery) => (
                  <ActivityItem
                    key={delivery.id}
                    icon="bi-award-fill"
                    variant="warning"
                    title={delivery.task?.title ?? 'Tarea'}
                    subtitle={`${delivery.task?.course?.name ?? 'Curso'} · ${delivery.grade !== null && delivery.grade !== undefined
                        ? `${delivery.grade}/10`
                        : 'Sin nota'
                      }`}
                  />
                ))
              ) : (
                <EmptyLearningState
                  icon="bi-award"
                  title="Sin calificaciones"
                  message="Cuando un profesor califique tus entregas aparecerán aquí."
                />
              )}
            </div>
          </LearningPanel>
        </div>
      </div>
    </div>
  );
}