import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import ContentLoader from '../../../components/common/ContentLoader';
import PageLoader from '../../../components/common/PageLoader';
import EmptyLearningState from '../../../components/learning/EmptyLearningState';
import LearningPanel from '../../../components/learning/LearningPanel';

import { useUI } from '../../../hooks/useUI';
import TeacherService from '../../../services/TeacherService';

import GradeDeliveryModal from './GradeDeliveryModal';

const defaultFilters = {
  search: '',
  status: '',
  task_id: '',
  student_id: ''
};

export default function TeacherCourseDeliveriesPage() {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const studentIdFromUrl = searchParams.get('student_id') ?? '';
  const { showError } = useUI();

  const [course, setCourse] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [deliveries, setDeliveries] = useState([]);

  const [filters, setFilters] = useState({
    ...defaultFilters,
    student_id: studentIdFromUrl,
  });

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [gradeErrors, setGradeErrors] = useState({});
  const [savingGrade, setSavingGrade] = useState(false);

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

      const [courseResponse, tasksResponse, deliveriesResponse] =
        await Promise.all([
          TeacherService.courseDetail(courseId),
          TeacherService.courseTasks(courseId, {
            per_page: 200,
          }),
          TeacherService.courseDeliveries(courseId, {
            student_id: studentIdFromUrl || undefined,
          }),
        ]);

      setCourse(extractData(courseResponse));
      setTasks(extractItems(tasksResponse));
      setDeliveries(extractItems(deliveriesResponse));
    } catch (error) {
      console.error(error);
      showError('No se pudieron cargar las entregas del curso.');
    } finally {
      setLoadingPage(false);
    }
  };

  const loadDeliveries = async (params = {}) => {
    try {
      setLoadingResults(true);

      const response = await TeacherService.courseDeliveries(courseId, params);

      setDeliveries(extractItems(response));
    } catch (error) {
      console.error(error);
      showError('No se pudieron actualizar las entregas.');
    } finally {
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, [courseId]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const buildFilters = () => {
    const params = {};

    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.task_id) params.task_id = filters.task_id;
    if (filters.student_id) params.student_id = filters.student_id;

    return params;
  };

  const handleSearch = (event) => {
    event.preventDefault();
    event.stopPropagation();

    loadDeliveries(buildFilters());
  };

  const handleReset = () => {
    setFilters({
      ...defaultFilters,
      student_id: studentIdFromUrl,
    });

    loadDeliveries({
      student_id: studentIdFromUrl || undefined,
    });
  };

  const openGradeModal = (delivery) => {
    setGradeErrors({});
    setSelectedDelivery(delivery);
  };

  const closeGradeModal = () => {
    if (savingGrade) return;

    setSelectedDelivery(null);
    setGradeErrors({});
  };

  const handleGradeSubmit = async (payload) => {
    if (!selectedDelivery) return;

    try {
      setSavingGrade(true);
      setGradeErrors({});

      await TeacherService.updateDelivery(selectedDelivery.id, {
        student_id: selectedDelivery.student_id ?? selectedDelivery.student?.id,
        task_id: selectedDelivery.task_id ?? selectedDelivery.task?.id,
        delivery_date: selectedDelivery.delivery_date,
        ...payload,
      });

      setSelectedDelivery(null);

      await loadDeliveries(buildFilters());
    } catch (error) {
      const response = error.response?.data;

      if (response?.errors) {
        setGradeErrors(response.errors);

        const firstKey = Object.keys(response.errors)[0];
        const firstMessage = response.errors[firstKey]?.[0];

        showError(firstMessage ?? response.message, 'Error de validación');
        return;
      }

      showError(response?.message ?? 'No se pudo guardar la calificación.');
    } finally {
      setSavingGrade(false);
    }
  };

  const getFileUrl = (file) => {
    if (!file) return '#';

    if (file.url) return file.url;

    if (file.path?.startsWith('http')) {
      return file.path;
    }

    return `${import.meta.env.VITE_API_URL?.replace('/api/v1', '')}/storage/${file.path}`;
  };

  const deliveryStatusBadge = (delivery) => {
    if (delivery.grade !== null && delivery.grade !== undefined) {
      return (
        <span className="badge bg-success-subtle text-success">
          Calificada
        </span>
      );
    }

    return (
      <span className="badge bg-warning-subtle text-warning">
        Pendiente
      </span>
    );
  };

  if (loadingPage) {
    return (
      <PageLoader
        title="Cargando entregas"
        message="Preparando entregas y tareas del curso..."
      />
    );
  }

  return (
    <div className="learning-dashboard">
      <section className="learning-hero">
        <div>
          <span className="learning-kicker">Entregas del curso</span>

          <h2>{course?.name ?? 'Curso'}</h2>

          <p>
            Revisa las entregas de tus alumnos y registra sus calificaciones.
          </p>
        </div>

        <div className="learning-hero-icon">
          <i className="bi bi-inbox-fill" />
        </div>
      </section>

      <LearningPanel
        title="Entregas"
        subtitle="Filtra por tarea, alumno o estado de corrección."
        action={
          <Link
            to={`/teacher/courses/${courseId}`}
            className="btn btn-outline-secondary btn-sm"
          >
            Volver
          </Link>
        }
      >
        <form className="learning-filter-bar" onSubmit={handleSearch}>
          <div className="learning-filter-input">
            <i className="bi bi-search" />

            <input
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
              placeholder="Buscar alumno o tarea..."
              disabled={loadingResults}
            />
          </div>

          <select
            className="form-select learning-filter-select"
            value={filters.task_id}
            onChange={(event) => updateFilter('task_id', event.target.value)}
            disabled={loadingResults}
          >
            <option value="">Todas las tareas</option>

            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>

          <select
            className="form-select learning-filter-select"
            value={filters.status}
            onChange={(event) => updateFilter('status', event.target.value)}
            disabled={loadingResults}
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
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
          title="Actualizando entregas..."
          message="Aplicando filtros..."
        >
          {deliveries.length > 0 ? (
            <div className="learning-delivery-grid mt-3">
              {deliveries.map((delivery) => {
                const files = delivery.files ?? [];

                return (
                  <article className="learning-delivery-card" key={delivery.id}>
                    <div className="learning-delivery-header">
                      <div className="learning-list-icon">
                        <i className="bi bi-upload" />
                      </div>

                      <div>
                        <h5>
                          {delivery.student?.name ?? 'Alumno'}{' '}
                          {delivery.student?.last_name ?? ''}
                        </h5>

                        <p>{delivery.student?.email ?? 'Sin email'}</p>
                      </div>

                      <div className="ms-auto">
                        {deliveryStatusBadge(delivery)}
                      </div>
                    </div>

                    <div className="learning-delivery-body">
                      <div>
                        <span>Tarea</span>
                        <strong>{delivery.task?.title ?? '-'}</strong>
                      </div>

                      <div>
                        <span>Fecha entrega</span>
                        <strong>
                          {delivery.delivery_date
                            ? new Date(delivery.delivery_date).toLocaleDateString()
                            : '-'}
                        </strong>
                      </div>

                      <div>
                        <span>Nota</span>
                        <strong>
                          {delivery.grade !== null && delivery.grade !== undefined
                            ? `${delivery.grade}/10`
                            : 'Sin calificar'}
                        </strong>
                      </div>
                    </div>

                    {delivery.comment && (
                      <p className="learning-delivery-comment">
                        {delivery.comment}
                      </p>
                    )}

                    <div className="learning-delivery-actions">
                      {files.length > 0 && (
                        <a
                          className="btn btn-outline-secondary btn-sm"
                          href={getFileUrl(files[0])}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Ver archivo
                        </a>
                      )}

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => openGradeModal(delivery)}
                      >
                        {delivery.grade !== null && delivery.grade !== undefined
                          ? 'Editar nota'
                          : 'Calificar'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyLearningState
              icon="bi-inbox"
              title="Sin entregas"
              message="Todavía no hay entregas para este curso."
            />
          )}
        </ContentLoader>
      </LearningPanel>

      <GradeDeliveryModal
        show={Boolean(selectedDelivery)}
        delivery={selectedDelivery}
        errors={gradeErrors}
        loading={savingGrade}
        onClose={closeGradeModal}
        onSubmit={handleGradeSubmit}
      />
    </div>
  );
}