import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import PageLoader from '../../../components/common/PageLoader';
import ActivityItem from '../../../components/learning/ActivityItem';
import EmptyLearningState from '../../../components/learning/EmptyLearningState';
import LearningPanel from '../../../components/learning/LearningPanel';
import LearningStatCard from '../../../components/learning/LearningStatCard';
import QuickAction from '../../../components/learning/QuickAction';
import { Helmet } from 'react-helmet-async';

import { useUI } from '../../../hooks/useUI';
import StudentService from '../../../services/StudentService';

export default function StudentCourseDetailPage() {
  const { courseId } = useParams();
  const { showError } = useUI();

  const [course, setCourse] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [loadingPage, setLoadingPage] = useState(true);

  const extractData = (response) =>
    response?.data?.data ??
    response?.data ??
    response ??
    null;

  const extractItems = (response) =>
    response?.data?.data?.data ??
    response?.data?.data ??
    response?.data?.items ??
    [];

  const loadPage = async () => {
    try {
      setLoadingPage(true);

      const [courseResponse, tasksResponse, materialsResponse] =
        await Promise.all([
          StudentService.courseDetail(courseId),
          StudentService.courseTasks(courseId, {
            per_page: 100,
          }),
          StudentService.courseMaterials(courseId, {
            per_page: 100,
          }),
        ]);

      setCourse(extractData(courseResponse));
      setTasks(extractItems(tasksResponse));
      const materialsData = extractItems(materialsResponse);

      setMaterials(
        [...materialsData].sort(
          (a, b) =>
            new Date(b.created_at || 0) -
            new Date(a.created_at || 0)
        )
      );
    } catch (error) {
      console.error(error);
      showError('No se pudo cargar el curso.');
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, [courseId]);

  const getFileUrl = (file) => {
    if (file.url) return file.url;

    if (file.path?.startsWith('http')) {
      return file.path;
    }

    return `${import.meta.env.VITE_API_URL?.replace('/api/v1', '')}/storage/${file.path}`;
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

  return (
    <>
      <Helmet>
        <title>Detalle Curso</title>
      </Helmet>
      <div className="learning-dashboard">
        <section className="learning-hero">
          <div>
            <span className="learning-kicker">Detalle del curso</span>

            <h2>{course.name}</h2>

            <p>
              Consulta tus tareas, materiales y la información principal del curso.
            </p>
          </div>

          <div className="learning-hero-icon">
            <i className="bi bi-journal-bookmark-fill" />
          </div>
        </section>

        <section className="learning-stats-grid">
          <LearningStatCard
            icon="bi-list-task"
            value={tasks.length}
            label="Tareas"
          />

          <LearningStatCard
            icon="bi-folder2-open"
            value={materials.length}
            label="Materiales"
            variant="purple"
          />

          <LearningStatCard
            icon="bi-person-badge-fill"
            value={course.teacher ? 1 : 0}
            label="Profesor"
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
              title="Tareas del curso"
              subtitle="Últimas tareas publicadas en este curso."
              action={
                <Link
                  to={`/student/tasks?course_id=${course.id}`}
                  className="btn btn-outline-primary btn-sm"
                >
                  Ver tareas
                </Link>
              }
            >
              <div className="learning-list">
                {tasks.length > 0 ? (
                  tasks.slice(0, 6).map((task) => (
                    <ActivityItem
                      key={task.id}
                      icon="bi-list-task"
                      variant="purple"
                      title={task.title}
                      subtitle={
                        `Publicada: ${task.created_at
                          ? new Date(task.created_at).toLocaleDateString('es-ES')
                          : '-'
                        }${task.due_date
                          ? ` · Entrega: ${new Date(task.due_date).toLocaleDateString('es-ES')}`
                          : ' · Sin fecha de entrega'
                        }`
                      }
                    />
                  ))
                ) : (
                  <EmptyLearningState
                    icon="bi-list-task"
                    title="Sin tareas"
                    message="Todavía no hay tareas publicadas."
                  />
                )}
              </div>
            </LearningPanel>
          </div>

          <div className="col-xl-4">
            <LearningPanel
              title="Acciones rápidas"
              subtitle="Accede a las zonas principales del curso."
            >
              <div className="learning-actions">
                <QuickAction
                  to={`/student/tasks?course_id=${course.id}`}
                  icon="bi-list-task"
                  label="Ver tareas"
                />

                <QuickAction
                  to={`/student/grades?course_id=${course.id}`}
                  icon="bi-award-fill"
                  label="Ver calificaciones"
                />

                <QuickAction
                  to="/student/courses"
                  icon="bi-arrow-left-circle"
                  label="Volver a cursos"
                />
              </div>
            </LearningPanel>
          </div>

          <div className="col-xl-12">
            <LearningPanel
              title="Materiales"
              subtitle="Archivos compartidos por el profesor."
            >
              {materials.length > 0 ? (
                <div className="learning-material-grid">
                  {materials.map((file) => (
                    <article className="learning-material-card" key={file.id}>
                      <div className="learning-material-icon">
                        <i className="bi bi-file-earmark-text-fill" />
                      </div>

                      <div className="learning-material-info">
                        <h5>{file.name}</h5>

                        <p>
                          {file.task?.title ?? 'Material'} ·{' '}
                          {file.mime_type ?? 'Archivo'}
                        </p>

                        <small>
                          {file.size
                            ? `${(file.size / 1024).toFixed(1)} KB`
                            : 'Tamaño desconocido'}
                          <br />
                          Subido:
                          {' '}
                          {file.created_at
                            ? new Date(file.created_at).toLocaleString('es-ES')
                            : '-'}
                        </small>
                      </div>

                      <div className="learning-material-actions">
                        <a
                          href={getFileUrl(file)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          Descargar
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyLearningState
                  icon="bi-folder-x"
                  title="Sin materiales"
                  message="Todavía no hay materiales subidos para este curso."
                />
              )}
            </LearningPanel>
          </div>
        </div>
      </div>
    </>
  );
}