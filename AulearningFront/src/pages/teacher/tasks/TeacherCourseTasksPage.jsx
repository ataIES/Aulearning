import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import ConfirmModal from '../../../components/common/ConfirmModal';
import ContentLoader from '../../../components/common/ContentLoader';
import PageLoader from '../../../components/common/PageLoader';
import EmptyLearningState from '../../../components/learning/EmptyLearningState';
import LearningPanel from '../../../components/learning/LearningPanel';

import { useUI } from '../../../hooks/useUI';
import TeacherService from '../../../services/TeacherService';

import TaskFormModal from './TaskFormModal';
import { Helmet } from 'react-helmet-async';

const defaultFilters = {
  search: '',
};

export default function TeacherCourseTasksPage() {
  const { courseId } = useParams();
  const { showError } = useUI();

  const [course, setCourse] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const extractData = (response) =>
    response.data?.data ??
    response.data ??
    response ??
    null;

  const extractItems = (response) =>
    response.data?.data?.data ??
    response.data?.data ??
    response.data?.items ??
    [];

  const loadPage = async () => {
    try {
      setLoadingPage(true);

      const [courseResponse, tasksResponse] = await Promise.all([
        TeacherService.courseDetail(courseId),
        TeacherService.courseTasks(courseId),
      ]);

      setCourse(extractData(courseResponse));
      setTasks(extractItems(tasksResponse));
    } catch (error) {
      console.error(error);
      showError('No se pudo cargar la información del curso.');
    } finally {
      setLoadingPage(false);
    }
  };

  const loadTasks = async (params = {}) => {
    try {
      setLoadingResults(true);

      const response = await TeacherService.courseTasks(courseId, params);

      setTasks(extractItems(response));
    } catch (error) {
      console.error(error);
      showError('No se pudieron cargar las tareas.');
    } finally {
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, [courseId]);

  const handleSearch = (event) => {
    event.preventDefault();
    event.stopPropagation();

    loadTasks({
      search: filters.search,
    });
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    loadTasks();
  };

  const openCreate = () => {
    setSelectedTask(null);
    setFormErrors({});
    setShowForm(true);
  };

  const openEdit = (task) => {
    setSelectedTask(task);
    setFormErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setSelectedTask(null);
    setFormErrors({});
  };

  const normalizePayload = (payload) => ({
    ...payload,
    course_id: Number(courseId),
    due_date: payload.type === 'APUNTES' ? null : payload.due_date || null,
    gradable: payload.type === 'APUNTES' ? false : payload.gradable,
    removed_files: payload.removed_files ?? [],
  });

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      setFormErrors({});

      const files = payload.files ?? [];

      const normalizedPayload = normalizePayload({
        ...payload,
        files: undefined,
        removed_files: payload.removed_files ?? [],
      });

      let response;

      if (selectedTask) {
        response = await TeacherService.updateTask(
          selectedTask.id,
          normalizedPayload
        );

        if (files.length > 0) {
          await Promise.all(
            files.map((file) =>
              TeacherService.uploadMaterial({
                task_id: selectedTask.id,
                file,
              })
            )
          );
        }
      } else {
        response = await TeacherService.createTask(normalizedPayload);

        const createdTask =
          response?.data?.data ??
          response?.data ??
          response;

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
      }

      setShowForm(false);
      setSelectedTask(null);

      await loadTasks();
    } catch (error) {
      const response = error.response?.data;

      if (response?.errors) {
        setFormErrors(response.errors);

        const firstKey = Object.keys(response.errors)[0];
        const firstMessage = response.errors[firstKey]?.[0];

        showError(firstMessage ?? response.message, 'Error de validación');
        return;
      }

      showError(response?.message ?? 'No se pudo guardar la tarea.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;

    try {
      setDeleting(true);

      await TeacherService.deleteTask(taskToDelete.id);

      setTaskToDelete(null);

      await loadTasks();
    } catch {
      showError('No se pudo eliminar la tarea.');
    } finally {
      setDeleting(false);
    }
  };

  const typeBadge = (type) => {
    const labels = {
      TAREA: 'Tarea',
      EXAMEN: 'Examen',
      APUNTES: 'Apuntes',
    };

    return (
      <span className="badge bg-primary-subtle text-primary">
        {labels[type] ?? type}
      </span>
    );
  };

  if (loadingPage) {
    return (
      <PageLoader
        title="Cargando tareas"
        message="Preparando las tareas del curso..."
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Ver Tareas</title>
      </Helmet>
      <div className="learning-dashboard">
        <section className="learning-hero">
          <div>
            <span className="learning-kicker">Tareas del curso</span>

            <h2>{course?.name ?? 'Curso'}</h2>

            <p>Gestiona las tareas, exámenes y apuntes publicados en este curso.</p>
          </div>

          <div className="learning-hero-icon">
            <i className="bi bi-list-task" />
          </div>
        </section>

        <LearningPanel
          title="Tareas"
          subtitle="Busca, crea y administra las tareas del curso."
          action={
            <div className="d-flex gap-2">
              <Link
                to={`/teacher/courses/${courseId}`}
                className="btn btn-outline-secondary btn-sm"
              >
                Volver
              </Link>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={openCreate}
                disabled={loadingResults}
              >
                <i className="bi bi-plus-lg me-1" />
                Nueva tarea
              </button>
            </div>
          }
        >
          <form className="learning-filter-bar" onSubmit={handleSearch}>
            <div className="learning-filter-input">
              <i className="bi bi-search" />

              <input
                value={filters.search}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: event.target.value,
                  }))
                }
                placeholder="Buscar tarea..."
                disabled={loadingResults}
              />
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loadingResults}
            >
              Buscar
            </button>

            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={handleReset}
              disabled={loadingResults}
            >
              Limpiar
            </button>
          </form>

          <ContentLoader
            loading={loadingResults}
            title="Actualizando tareas..."
            message="Aplicando filtros..."
          >

            {tasks.length > 0 ? (
              <div className="learning-task-grid mt-3">
                {tasks.map((task) => (
                  <article className="learning-task-card" key={task.id}>
                    <div className="learning-task-card-header">
                      <div className="learning-list-icon purple">
                        <i className="bi bi-list-task" />
                      </div>

                      <div>
                        <h5>{task.title}</h5>
                        <p>{task.description || 'Sin descripción'}</p>
                      </div>
                    </div>

                    <div className="learning-task-meta">
                      {typeBadge(task.type)}

                      <span>
                        <i className="bi bi-calendar-event me-1" />
                        {task.due_date
                          ? new Date(task.due_date).toLocaleDateString()
                          : 'Sin fecha'}
                      </span>

                      <span>
                        <i className="bi bi-award me-1" />
                        {task.gradable ?? task.calificable
                          ? 'Calificable'
                          : 'No calificable'}
                      </span>
                    </div>

                    <div className="learning-task-actions">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openEdit(task)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => setTaskToDelete(task)}
                      >
                        Eliminar
                      </button>
                    </div>

                    {(task.files ?? []).length > 0 && (
                      <div className="learning-task-files">
                        <strong>Archivos adjuntos</strong>

                        <div>
                          {task.files.map((file) => (
                            <a
                              key={file.id}
                              href={file.url ?? file.path}
                              target="_blank"
                              rel="noreferrer"
                              className="learning-task-file"
                            >
                              <i className="bi bi-paperclip" />
                              <span>{file.name}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <EmptyLearningState
                icon="bi-list-task"
                title="Sin tareas"
                message="Todavía no has creado tareas para este curso."
              />
            )}
          </ContentLoader>
        </LearningPanel>

        <TaskFormModal
          show={showForm}
          task={selectedTask}
          errors={formErrors}
          loading={saving}
          onClose={closeForm}
          onSubmit={handleSubmit}
        />

        <ConfirmModal
          show={Boolean(taskToDelete)}
          title="Eliminar tarea"
          message={`¿Seguro que quieres eliminar "${taskToDelete?.title ?? ''}"?`}
          confirmText="Eliminar"
          loading={deleting}
          onClose={() => setTaskToDelete(null)}
          onConfirm={handleDelete}
        />
      </div>
    </>
  );
}