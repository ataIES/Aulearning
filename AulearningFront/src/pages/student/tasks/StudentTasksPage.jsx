import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import ContentLoader from '../../../components/common/ContentLoader';
import PageLoader from '../../../components/common/PageLoader';
import EmptyLearningState from '../../../components/learning/EmptyLearningState';
import LearningPanel from '../../../components/learning/LearningPanel';

import { useAuth } from '../../../hooks/useAuth';
import { useUI } from '../../../hooks/useUI';
import StudentService from '../../../services/StudentService';

import SubmitTaskModal from './SubmitTaskModal';

const defaultFilters = {
  search: '',
  status: '',
  course_id: '',
};

export default function StudentTasksPage() {
  const { user } = useAuth();
  const { showError } = useUI();
  const [searchParams] = useSearchParams();

  const courseIdFromUrl = searchParams.get('course_id') ?? '';

  const [tasks, setTasks] = useState([]);
  const [deliveries, setDeliveries] = useState([]);

  const [filters, setFilters] = useState({
    ...defaultFilters,
    course_id: courseIdFromUrl,
  });

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [submitErrors, setSubmitErrors] = useState({});
  const [savingDelivery, setSavingDelivery] = useState(false);

  const extractItems = (response) =>
    response?.data?.data?.data ??
    response?.data?.data ??
    response?.data?.items ??
    [];

  const buildFilters = () => {
    const params = {
      per_page: 200,
    };

    if (filters.search) params.search = filters.search;
    if (filters.course_id) params.course_id = filters.course_id;

    return params;
  };

  const loadPage = async () => {
    try {
      setLoadingPage(true);

      const [tasksResponse, deliveriesResponse] = await Promise.all([
        StudentService.tasks(buildFilters()),
        StudentService.deliveries({
          student_id: user.id,
          per_page: 200,
        }),
      ]);

      setTasks(extractItems(tasksResponse));
      setDeliveries(extractItems(deliveriesResponse));
    } catch (error) {
      console.error(error);
      showError('No se pudieron cargar tus tareas.');
    } finally {
      setLoadingPage(false);
    }
  };

  const loadTasks = async (params = {}) => {
    try {
      setLoadingResults(true);

      const [tasksResponse, deliveriesResponse] = await Promise.all([
        StudentService.tasks({
          ...buildFilters(),
          ...params,
        }),
        StudentService.deliveries({
          student_id: user.id,
          per_page: 200,
        }),
      ]);

      setTasks(extractItems(tasksResponse));
      setDeliveries(extractItems(deliveriesResponse));
    } catch (error) {
      console.error(error);
      showError('No se pudieron actualizar tus tareas.');
    } finally {
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadPage();
    }
  }, [user?.id]);

  const getDeliveryForTask = (taskId) =>
    deliveries.find((delivery) => {
      const deliveryTaskId = delivery.task_id ?? delivery.task?.id;
      return Number(deliveryTaskId) === Number(taskId);
    });

  const getVisibleTasks = () => {
    if (!filters.status) return tasks;

    return tasks.filter((task) => {
      const delivery = getDeliveryForTask(task.id);

      if (filters.status === 'pending') {
        return !delivery;
      }

      if (filters.status === 'delivered') {
        return delivery && (delivery.grade === null || delivery.grade === undefined);
      }

      if (filters.status === 'graded') {
        return delivery && delivery.grade !== null && delivery.grade !== undefined;
      }

      return true;
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    event.stopPropagation();

    loadTasks();
  };

  const handleReset = () => {
    setFilters({
      ...defaultFilters,
      course_id: courseIdFromUrl,
    });

    loadTasks({
      course_id: courseIdFromUrl || undefined,
    });
  };

  const openSubmitModal = (task) => {
    const delivery = getDeliveryForTask(task.id);

    setSelectedTask(task);
    setSelectedDelivery(delivery ?? null);
    setSubmitErrors({});
  };

  const closeSubmitModal = () => {
    if (savingDelivery) return;

    setSelectedTask(null);
    setSelectedDelivery(null);
    setSubmitErrors({});
  };

  const handleSubmitDelivery = async (payload) => {
    if (!selectedTask) return;

    try {
      setSavingDelivery(true);
      setSubmitErrors({});

      const requestPayload = {
        student_id: user.id,
        task_id: selectedTask.id,
        delivery_date: new Date().toISOString().slice(0, 10),
        comment: payload.comment || null,
        files: payload.files ?? [],
      };

      if (selectedDelivery) {
        await StudentService.updateDelivery(selectedDelivery.id, requestPayload);
      } else {
        await StudentService.createDelivery(requestPayload);
      }

      setSelectedTask(null);
      setSelectedDelivery(null);

      await loadTasks();
    } catch (error) {
      const response = error.response?.data;

      if (response?.errors) {
        setSubmitErrors(response.errors);

        const firstKey = Object.keys(response.errors)[0];
        const firstMessage = response.errors[firstKey]?.[0];

        showError(firstMessage ?? response.message, 'Error de validación');
        return;
      }

      showError(response?.message ?? 'No se pudo guardar la entrega.');
    } finally {
      setSavingDelivery(false);
    }
  };

  const getStatusBadge = (task) => {
    const delivery = getDeliveryForTask(task.id);

    if (!delivery) {
      return (
        <span className="badge bg-warning-subtle text-warning">
          Pendiente
        </span>
      );
    }

    if (delivery.grade !== null && delivery.grade !== undefined) {
      return (
        <span className="badge bg-success-subtle text-success">
          Calificada
        </span>
      );
    }

    return (
      <span className="badge bg-primary-subtle text-primary">
        Entregada
      </span>
    );
  };

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
        title="Cargando tareas"
        message="Preparando tus tareas pendientes..."
      />
    );
  }

  const visibleTasks = getVisibleTasks();

  return (
    <div className="learning-dashboard">
      <section className="learning-hero">
        <div>
          <span className="learning-kicker">Mis tareas</span>

          <h2>Tareas y entregas</h2>

          <p>
            Consulta tus tareas, descarga materiales y entrega tus trabajos.
          </p>
        </div>

        <div className="learning-hero-icon">
          <i className="bi bi-list-task" />
        </div>
      </section>

      <LearningPanel
        title="Tareas"
        subtitle="Filtra tus tareas por estado o búsqueda."
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

          <select
            className="form-select learning-filter-select"
            value={filters.status}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                status: event.target.value,
              }))
            }
            disabled={loadingResults}
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="delivered">Entregadas</option>
            <option value="graded">Calificadas</option>
          </select>

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
          {visibleTasks.length > 0 ? (
            <div className="learning-task-grid mt-3">
              {visibleTasks.map((task) => {
                const delivery = getDeliveryForTask(task.id);
                const files = task.files ?? [];

                return (
                  <article className="learning-task-card" key={task.id}>
                    <div className="learning-task-card-header">
                      <div className="learning-list-icon purple">
                        <i className="bi bi-list-task" />
                      </div>

                      <div>
                        <h5>{task.title}</h5>

                        <p>
                          {task.course?.name ?? 'Curso'} ·{' '}
                          {task.due_date
                            ? new Date(task.due_date).toLocaleDateString()
                            : 'Sin fecha'}
                        </p>
                      </div>

                      <div className="ms-auto">
                        {getStatusBadge(task)}
                      </div>
                    </div>

                    {task.description && (
                      <p className="learning-task-description">
                        {task.description}
                      </p>
                    )}

                    {files.length > 0 && (
                      <div className="learning-task-files">
                        <strong>Materiales</strong>

                        <div>
                          {files.map((file) => (
                            <a
                              key={file.id}
                              href={getFileUrl(file)}
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

                    {delivery?.comment && (
                      <p className="learning-delivery-comment">
                        {delivery.comment}
                      </p>
                    )}

                    <div className="learning-task-actions">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => openSubmitModal(task)}
                      >
                        {delivery ? 'Editar entrega' : 'Entregar'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyLearningState
              icon="bi-list-task"
              title="Sin tareas"
              message="No hay tareas que coincidan con los filtros."
            />
          )}
        </ContentLoader>
      </LearningPanel>

      <SubmitTaskModal
        show={Boolean(selectedTask)}
        task={selectedTask}
        delivery={selectedDelivery}
        errors={submitErrors}
        loading={savingDelivery}
        onClose={closeSubmitModal}
        onSubmit={handleSubmitDelivery}
      />
    </div>
  );
}