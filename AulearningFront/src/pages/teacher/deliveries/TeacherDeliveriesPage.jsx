import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import ContentLoader from '../../../components/common/ContentLoader';
import PageLoader from '../../../components/common/PageLoader';
import EmptyLearningState from '../../../components/learning/EmptyLearningState';
import LearningPanel from '../../../components/learning/LearningPanel';

import { useAuth } from '../../../hooks/useAuth';
import { useUI } from '../../../hooks/useUI';
import TeacherService from '../../../services/TeacherService';

import GradeDeliveryModal from './GradeDeliveryModal';

const defaultFilters = {
  search: '',
  status: '',
};

export default function TeacherDeliveriesPage() {
  const { user } = useAuth();
  const { showError } = useUI();
  const [searchParams] = useSearchParams();

  const [deliveries, setDeliveries] = useState([]);
  const [filters, setFilters] = useState({
    ...defaultFilters,
    status: searchParams.get('status') ?? '',
  });

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [gradeErrors, setGradeErrors] = useState({});
  const [savingGrade, setSavingGrade] = useState(false);

  const extractItems = (response) =>
    response?.data?.data?.data ??
    response?.data?.data ??
    response?.data?.items ??
    [];

  const buildFilters = () => {
    const params = {};

    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;

    return params;
  };

  const loadDeliveries = async (params = {}, firstLoad = false) => {
    try {
      if (firstLoad) {
        setLoadingPage(true);
      } else {
        setLoadingResults(true);
      }

      const response = await TeacherService.teacherDeliveries(user.id, {
        per_page: 200,
        ...params,
      });

      setDeliveries(extractItems(response));
    } catch (error) {
      console.error(error);
      showError('No se pudieron cargar las entregas.');
    } finally {
      setLoadingPage(false);
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadDeliveries(buildFilters(), true);
    }
  }, [user?.id]);

  const handleSearch = (event) => {
    event.preventDefault();
    loadDeliveries(buildFilters());
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    loadDeliveries();
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
        return;
      }

      showError(response?.message ?? 'No se pudo guardar la calificación.');
    } finally {
      setSavingGrade(false);
    }
  };

  if (loadingPage) {
    return (
      <PageLoader
        title="Cargando entregas"
        message="Preparando entregas de tus alumnos..."
      />
    );
  }

  return (
    <div className="learning-dashboard">
      <section className="learning-hero">
        <div>
          <span className="learning-kicker">Entregas</span>
          <h2>Entregas de tus alumnos</h2>
          <p>Revisa y califica entregas de todos tus cursos.</p>
        </div>

        <div className="learning-hero-icon">
          <i className="bi bi-inbox-fill" />
        </div>
      </section>

      <LearningPanel title="Entregas" subtitle="Filtra por alumno, tarea o estado.">
        <form className="learning-filter-bar" onSubmit={handleSearch}>
          <div className="learning-filter-input">
            <i className="bi bi-search" />
            <input
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="Buscar alumno o tarea..."
              disabled={loadingResults}
            />
          </div>

          <select
            className="form-select learning-filter-select"
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            disabled={loadingResults}
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="graded">Calificadas</option>
          </select>

          <button className="btn btn-primary" type="submit" disabled={loadingResults}>
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
              {deliveries.map((delivery) => (
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
                      <p>{delivery.task?.title ?? 'Tarea'}</p>
                      <small>{delivery.task?.course?.name ?? 'Curso'}</small>
                    </div>

                    <div className="ms-auto">
                      {delivery.grade !== null && delivery.grade !== undefined ? (
                        <span className="badge bg-success-subtle text-success">
                          Calificada
                        </span>
                      ) : (
                        <span className="badge bg-warning-subtle text-warning">
                          Pendiente
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="learning-delivery-body">
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

                  <div className="learning-delivery-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setSelectedDelivery(delivery)}
                    >
                      {delivery.grade !== null && delivery.grade !== undefined
                        ? 'Editar nota'
                        : 'Calificar'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyLearningState
              icon="bi-inbox"
              title="Sin entregas"
              message="No hay entregas de tus alumnos."
            />
          )}
        </ContentLoader>
      </LearningPanel>

      <GradeDeliveryModal
        show={Boolean(selectedDelivery)}
        delivery={selectedDelivery}
        errors={gradeErrors}
        loading={savingGrade}
        onClose={() => {
          if (!savingGrade) {
            setSelectedDelivery(null);
            setGradeErrors({});
          }
        }}
        onSubmit={handleGradeSubmit}
      />
    </div>
  );
}