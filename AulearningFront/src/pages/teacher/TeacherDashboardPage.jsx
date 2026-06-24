import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import PageLoader from '../../components/common/PageLoader';
import ActivityItem from '../../components/learning/ActivityItem';
import CourseCard from '../../components/learning/CourseCard';
import EmptyLearningState from '../../components/learning/EmptyLearningState';
import LearningPanel from '../../components/learning/LearningPanel';
import LearningStatCard from '../../components/learning/LearningStatCard';
import QuickAction from '../../components/learning/QuickAction';

import TaskFormModal from './tasks/TaskFormModal';

import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import DashboardService from '../../services/DashboardService';
import TeacherService from '../../services/TeacherService';

export default function TeacherDashboardPage() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { showError } = useUI();

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [savingTask, setSavingTask] = useState(false);
  const [taskErrors, setTaskErrors] = useState({});

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await DashboardService.teacher();

      const data =
        response?.data?.data ??
        response?.data ??
        response ??
        null;

      setDashboard(data);
    } catch (error) {
      console.error(error);
      showError('No se pudo cargar el dashboard del profesor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const getFirstCourseId = () => {
    const courses = dashboard?.courses ?? [];

    return courses.length > 0 ? courses[0].id : null;
  };

  const normalizeTaskPayload = (payload) => ({
    title: payload.title,
    description: payload.description,
    due_date: payload.type === 'APUNTES' ? null : payload.due_date || null,
    course_id: Number(payload.course_id),
    student_id: payload.student_id ?? null,
    type: payload.type,
    gradable: payload.type === 'APUNTES' ? false : payload.gradable,
    comment: payload.comment ?? null,
    status: payload.status ?? 'pending',
  });

  const handleOpenCreateTask = () => {
    const courses = dashboard?.courses ?? [];

    if (courses.length === 0) {
      showError('No puedes crear una tarea porque no tienes cursos asignados.');
      return;
    }

    setTaskErrors({});
    setShowTaskModal(true);
  };

  const handleCreateTask = async (payload) => {
    try {
      setSavingTask(true);
      setTaskErrors({});

      const files = payload.files ?? [];
      const firstCourseId = getFirstCourseId();

      const response = await TeacherService.createTask(
        normalizeTaskPayload(payload)
      );

      const createdTask =
        response?.data?.data ??
        response?.data ??
        response ??
        null;

      if (createdTask?.id && files.length > 0) {
        await Promise.all(
          files.map((file) =>
            TeacherService.uploadMaterial({
              task_id: createdTask.id,
              file,
            })
          )
        );
      }

      setShowTaskModal(false);
      await loadDashboard();
    } catch (error) {
      const response = error.response?.data;

      if (response?.errors) {
        setTaskErrors(response.errors);

        const firstKey = Object.keys(response.errors)[0];
        const firstMessage = response.errors[firstKey]?.[0];

        showError(firstMessage ?? response.message, 'Error de validación');
        return;
      }

      showError(response?.message ?? 'No se pudo crear la tarea.');
    } finally {
      setSavingTask(false);
    }
  };

  if (loading) {
    return (
      <PageLoader
        title="Cargando dashboard"
        message="Preparando tu espacio docente..."
      />
    );
  }

  const summary = dashboard?.summary ?? {};

  return (
    <>
    <Helmet>
      <title>Bienvenido!</title>
    </Helmet>
      <div className="learning-dashboard">
        <section className="learning-hero">
          <div>
            <span className="learning-kicker">Panel docente</span>

            <h2>Hola, {user?.name ?? 'profesor'} 👋</h2>

            <p>
              Revisa tus cursos, entregas recientes y tareas pendientes desde un
              único lugar.
            </p>
          </div>

          <div className="learning-hero-icon">
            <i className="bi bi-mortarboard-fill" />
          </div>
        </section>

        <section className="learning-stats-grid">
          <LearningStatCard
            icon="bi-journal-bookmark-fill"
            value={summary.courses ?? 0}
            label="Cursos asignados"
          />

          <LearningStatCard
            icon="bi-people-fill"
            value={summary.students ?? 0}
            label="Alumnos"
          />

          <LearningStatCard
            icon="bi-list-task"
            value={summary.tasks ?? 0}
            label="Tareas creadas"
          />

          <LearningStatCard
            icon="bi-inbox-fill"
            value={summary.pending_deliveries ?? 0}
            label="Por corregir"
            variant="warning"
          />
        </section>

        <div className="row g-4 mt-1">
          <div className="col-xl-8">
            <LearningPanel
              title="Mis cursos"
              subtitle="Cursos asignados recientemente."
              action={
                <Link to="/teacher/courses" className="btn btn-outline-primary btn-sm">
                  Ver todos
                </Link>
              }
            >
              <div className="teacher-course-grid">
                {(dashboard?.courses ?? []).length > 0 ? (
                  dashboard.courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      to={`/teacher/courses/${course.id}`}
                    />
                  ))
                ) : (
                  <EmptyLearningState
                    icon="bi-journal-x"
                    title="Sin cursos asignados"
                    message="Todavía no tienes cursos asociados."
                  />
                )}
              </div>
            </LearningPanel>
          </div>

          <div className="col-xl-4">
            <LearningPanel
              title="Acciones rápidas"
              subtitle="Accede a tus tareas principales."
            >
              <div className="learning-actions">
                <QuickAction
                  to="/teacher/courses"
                  icon="bi-journal-text"
                  label="Ver mis cursos"
                />

                <QuickAction
                  icon="bi-plus-square"
                  label="Crear tarea"
                  onClick={handleOpenCreateTask}
                />

                <QuickAction
                  icon="bi-inbox"
                  label="Corregir entregas"
                  onClick={() => navigate('/teacher/deliveries?status=pending')}
                />
              </div>
            </LearningPanel>
          </div>

          <div className="col-xl-6">
            <LearningPanel
              title="Entregas recientes"
              subtitle="Últimas entregas enviadas por alumnos."
            >
              <div className="learning-list">
                {(dashboard?.latest_deliveries ?? []).length > 0 ? (
                  dashboard.latest_deliveries.map((delivery) => (
                    <ActivityItem
                      key={delivery.id}
                      icon="bi-upload"
                      title={`${delivery.student?.name ?? ''} ${delivery.student?.last_name ?? ''
                        }`}
                      subtitle={`${delivery.task?.title ?? 'Tarea'} · ${delivery.task?.course?.name ?? 'Curso'
                        }`}
                    />
                  ))
                ) : (
                  <EmptyLearningState
                    icon="bi-inbox"
                    title="Sin entregas recientes"
                    message="Cuando un alumno entregue una tarea aparecerá aquí."
                  />
                )}
              </div>
            </LearningPanel>
          </div>

          <div className="col-xl-6">
            <LearningPanel
              title="Próximas tareas"
              subtitle="Tareas con fecha de entrega próxima."
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
                    title="Sin tareas próximas"
                    message="No tienes tareas próximas con fecha de entrega."
                  />
                )}
              </div>
            </LearningPanel>
          </div>
        </div>

        <TaskFormModal
          show={showTaskModal}
          task={null}
          courses={dashboard?.courses ?? []}
          showCourseSelect
          errors={taskErrors}
          loading={savingTask}
          onClose={() => {
            if (!savingTask) {
              setShowTaskModal(false);
            }
          }}
          onSubmit={handleCreateTask}
        />
      </div>
    </>
  );
}