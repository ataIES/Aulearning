import { useEffect, useState } from 'react';

import ContentLoader from '../../../components/common/ContentLoader';
import PageLoader from '../../../components/common/PageLoader';
import EmptyLearningState from '../../../components/learning/EmptyLearningState';
import LearningPanel from '../../../components/learning/LearningPanel';

import { useAuth } from '../../../hooks/useAuth';
import { useUI } from '../../../hooks/useUI';
import StudentService from '../../../services/StudentService';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const defaultFilters = {
  search: '',
};


export default function StudentGradesPage() {
  const { user } = useAuth();
  const { showError } = useUI();

  const [searchParams] = useSearchParams();

  const courseIdFromUrl = searchParams.get('course_id') ?? '';

  const [deliveries, setDeliveries] = useState([]);
  const [filters, setFilters] = useState({
    ...defaultFilters,
    course_id: courseIdFromUrl,
  });

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

  const extractItems = (response) =>
    response?.data?.data?.data ??
    response?.data?.data ??
    response?.data?.items ??
    [];

  const loadGrades = async (params = {}, firstLoad = false) => {
    try {
      if (firstLoad) {
        setLoadingPage(true);
      } else {
        setLoadingResults(true);
      }

      const response = await StudentService.grades(user.id, {
        course_id: filters.course_id || undefined,
      });

      setDeliveries(extractItems(response));
    } catch (error) {
      console.error(error);
      showError('No se pudieron cargar tus calificaciones.');
    } finally {
      setLoadingPage(false);
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadGrades({}, true);
    }
  }, [user?.id]);

  const handleSearch = (event) => {
    event.preventDefault();

    loadGrades({
      search: filters.search,
    });
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    loadGrades();
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
        title="Cargando calificaciones"
        message="Preparando tus notas..."
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Ver Calificaciones</title>
      </Helmet>
      <div className="learning-dashboard">
        <section className="learning-hero">
          <div>
            <span className="learning-kicker">Calificaciones</span>

            <h2>Mis calificaciones</h2>

            <p>
              Consulta tus entregas calificadas, comentarios del profesor y
              archivos enviados.
            </p>
          </div>

          <div className="learning-hero-icon">
            <i className="bi bi-award-fill" />
          </div>
        </section>

        <LearningPanel
          title="Entregas calificadas"
          subtitle="Busca entre tus calificaciones recibidas."
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
                placeholder="Buscar tarea o curso..."
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
            title="Actualizando calificaciones..."
            message="Aplicando filtros..."
          >
            {deliveries.length > 0 ? (
              <div className="learning-delivery-grid mt-3">
                {deliveries.map((delivery) => {
                  const files = delivery.files ?? [];

                  return (
                    <article className="learning-delivery-card" key={delivery.id}>
                      <div className="learning-delivery-header">
                        <div className="learning-list-icon warning">
                          <i className="bi bi-award-fill" />
                        </div>

                        <div>
                          <h5>{delivery.task?.title ?? 'Tarea'}</h5>

                          <p>{delivery.task?.course?.name ?? 'Curso'}</p>
                        </div>

                        <div className="ms-auto">
                          <span className="badge bg-success-subtle text-success">
                            {delivery.grade}/10
                          </span>
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
                          <strong>{delivery.grade}/10</strong>
                        </div>

                        <div>
                          <span>Estado</span>
                          <strong>Calificada</strong>
                        </div>
                      </div>

                      {delivery.comment && (
                        <p className="learning-delivery-comment">
                          {delivery.comment}
                        </p>
                      )}

                      {files.length > 0 && (
                        <div className="learning-task-files">
                          <strong>Archivos entregados</strong>

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
                    </article>
                  );
                })}
              </div>
            ) : (
              <EmptyLearningState
                icon="bi-award"
                title="Sin calificaciones"
                message="Todavía no tienes entregas calificadas."
              />
            )}
          </ContentLoader>
        </LearningPanel>
      </div>
    </>
  );
}