import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import PageLoader from '../../../components/common/PageLoader';
import ActivityItem from '../../../components/learning/ActivityItem';
import EmptyLearningState from '../../../components/learning/EmptyLearningState';
import LearningPanel from '../../../components/learning/LearningPanel';
import LearningStatCard from '../../../components/learning/LearningStatCard';
import QuickAction from '../../../components/learning/QuickAction';

import { useUI } from '../../../hooks/useUI';
import TeacherService from '../../../services/TeacherService';
import TaskFormModal from '../tasks/TaskFormModal';

export default function TeacherCourseDetailPage() {
  const { courseId } = useParams();
  const { showError } = useUI();

  const [loadingPage, setLoadingPage] = useState(true);
  const [course, setCourse] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [savingTask, setSavingTask] = useState(false);
  const [taskErrors, setTaskErrors] = useState({});

  const extractData = (response) =>
    response.data?.data ??
    response.data ??
    response ??
    null;

  const loadCourse = async () => {
    try {
      setLoadingPage(true);

      const response = await TeacherService.courseDetail(courseId);

      setCourse(extractData(response));
    } catch (error) {
      console.error(error);
      showError('No se pudo cargar el curso.');
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const handleCreateTask = async (payload) => {
    try {
      setSavingTask(true);
      setTaskErrors({});

      await TeacherService.createTask({
        ...payload,
        course_id: Number(courseId),
        due_date: payload.type === 'APUNTES' ? null : payload.due_date || null,
        gradable: payload.type === 'APUNTES' ? false : payload.gradable,
      });

      setShowTaskModal(false);

      await loadCourse();
    } catch (error) {
      const response = error.response?.data;

      if (response?.errors) {
        setTaskErrors(response.errors);
      }

      showError(response?.message ?? 'No se pudo crear la tarea.');
    } finally {
      setSavingTask(false);
    }
  };

  if (loadingPage) {
    return (
      <PageLoader
        title="Cargando curso"
        message="Preparando la información del curso..."
      />
    );
  }

  if (!course) {
    return (
      <EmptyLearningState
        icon="bi-journal-x"
        title="Curso no encontrado"
        message="No se pudo obtener la información del curso."
      />
    );
  }

  const enrollments = course.enrollments ?? [];
  const tasks = course.tasks ?? [];

  return (
    <div className="learning-dashboard">
      <section className="learning-hero">
        <div>
          <span className="learning-kicker">Detalle del curso</span>

          <h2>{course.name}</h2>

          <p>
            Gestiona alumnos, tareas, entregas y materiales de este curso.
          </p>
        </div>

        <div className="learning-hero-icon">
          <i className="bi bi-journal-bookmark-fill" />
        </div>
      </section>

      <section className="learning-stats-grid">
        <LearningStatCard
          icon="bi-people-fill"
          value={course.enrollments_count ?? 0}
          label="Alumnos matriculados"
        />

        <LearningStatCard
          icon="bi-list-task"
          value={course.tasks_count ?? 0}
          label="Tareas"
          variant="purple"
        />

        <LearningStatCard
          icon="bi-person-badge-fill"
          value={course.teacher ? 1 : 0}
          label="Profesor asignado"
          variant="green"
        />

        <LearningStatCard
          icon="bi-calendar-event"
          value={course.start_date ?? '-'}
          label="Fecha inicio"
          variant="warning"
        />
      </section>

      <div className="row g-4 mt-1">
        <div className="col-xl-8">
          <LearningPanel
            title="Alumnos recientes"
            subtitle="Últimos alumnos matriculados en el curso."
            action={
              <Link
                to={`/teacher/courses/${course.id}/students`}
                className="btn btn-outline-primary btn-sm"
              >
                Ver alumnos
              </Link>
            }
          >
            <div className="learning-list">
              {enrollments.length > 0 ? (
                enrollments.map((enrollment) => (
                  <ActivityItem
                    key={enrollment.id}
                    icon="bi-person-fill"
                    title={`${enrollment.student?.name ?? ''} ${enrollment.student?.last_name ?? ''
                      }`}
                    subtitle={enrollment.student?.email ?? 'Sin email'}
                  />
                ))
              ) : (
                <EmptyLearningState
                  icon="bi-people"
                  title="Sin alumnos"
                  message="Todavía no hay alumnos matriculados."
                />
              )}
            </div>
          </LearningPanel>
        </div>

        <div className="col-xl-4">
          <LearningPanel
            title="Acciones rápidas"
            subtitle="Gestiona el curso rápidamente."
          >
            <div className="learning-actions">
              <QuickAction
                icon="bi-plus-square"
                label="Crear tarea"
                onClick={() => {
                  setTaskErrors({});
                  setShowTaskModal(true);
                }}
              />

              <QuickAction
                to={`/teacher/courses/${course.id}/deliveries`}
                icon="bi-inbox"
                label="Ver entregas"
              />

              <QuickAction
                to={`/teacher/courses/${course.id}/materials`}
                icon="bi-folder-plus"
                label="Subir material"
              />
            </div>
          </LearningPanel>
        </div>

        <div className="col-xl-12">
          <LearningPanel
            title="Últimas tareas"
            subtitle="Tareas creadas recientemente para este curso."
            action={
              <Link
                to={`/teacher/courses/${course.id}/tasks`}
                className="btn btn-outline-primary btn-sm"
              >
                Ver tareas
              </Link>
            }
          >
            <div className="learning-list">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <ActivityItem
                    key={task.id}
                    icon="bi-list-task"
                    variant="purple"
                    title={task.title}
                    subtitle={
                      task.due_date
                        ? `Entrega: ${new Date(task.due_date).toLocaleDateString()}`
                        : 'Sin fecha de entrega'
                    }
                  />
                ))
              ) : (
                <EmptyLearningState
                  icon="bi-list-task"
                  title="Sin tareas"
                  message="Todavía no has creado tareas para este curso."
                />
              )}
            </div>
          </LearningPanel>
        </div>
      </div>
      <TaskFormModal
        show={showTaskModal}
        task={null}
        errors={taskErrors}
        loading={savingTask}
        onClose={() => {
          if (!savingTask) setShowTaskModal(false);
        }}
        onSubmit={handleCreateTask}
      />
    </div>



  );

}