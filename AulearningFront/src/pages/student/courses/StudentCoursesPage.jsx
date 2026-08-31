import { useEffect, useState } from 'react';

import ContentLoader from '../../../components/common/ContentLoader';
import PageLoader from '../../../components/common/PageLoader';
import EmptyLearningState from '../../../components/learning/EmptyLearningState';
import LearningPanel from '../../../components/learning/LearningPanel';
import StudentCourseCard from '../../../components/learning/StudentCourseCard';

import { useAuth } from '../../../hooks/useAuth';
import { useUI } from '../../../hooks/useUI';
import StudentService from '../../../services/StudentService';
import { Helmet } from 'react-helmet-async';

const defaultFilters = {
  search: '',
};

export default function StudentCoursesPage() {
  const { user } = useAuth();
  const { showError } = useUI();

  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

  const extractItems = (response) =>
    response?.data?.data?.data ??
    response?.data?.data ??
    response?.data?.items ??
    response?.data ??
    response?.items ??
    [];

  const isCourseActiveToday = (course) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = course.start_date ? new Date(course.start_date) : null;
    const endDate = course.end_date ? new Date(course.end_date) : null;

    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(0, 0, 0, 0);

    return (!startDate || startDate <= today) && (!endDate || endDate >= today);
  };

  const normalizeCourse = (item) => {
    const course = item.course ?? item;

    return {
      ...course,
      pending_tasks_count:
        course.pending_tasks_count ??
        item.pending_tasks_count ??
        course.pending_tasks ??
        item.pending_tasks ??
        0,
    };
  };

  const prepareCourses = (items) =>
    items
      .map(normalizeCourse)
      .filter(isCourseActiveToday)
      .sort((a, b) =>
        (a.name ?? '').localeCompare(b.name ?? '', 'es', {
          sensitivity: 'base',
        })
      );

  const loadCourses = async (params = {}, firstLoad = false) => {
    try {
      if (firstLoad) {
        setLoadingPage(true);
      } else {
        setLoadingResults(true);
      }

      const response = await StudentService.courses(user.id, {
        per_page: 100,
        sort_by: 'name',
        sort_direction: 'asc',
        ...params,
      });

      setCourses(prepareCourses(extractItems(response)));
    } catch (error) {
      console.error(error);
      showError('No se pudieron cargar tus cursos.');
    } finally {
      setLoadingPage(false);
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadCourses({}, true);
    }
  }, [user?.id]);

  const handleSearch = (event) => {
    event.preventDefault();

    loadCourses({
      search: filters.search,
    });
  };

  const handleReset = () => {
    setFilters({ ...defaultFilters });
    loadCourses();
  };

  if (loadingPage) {
    return (
      <PageLoader
        title="Cargando cursos"
        message="Preparando tus cursos matriculados..."
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Mis Cursos</title>
      </Helmet>
      <div className="learning-dashboard">
        <section className="learning-hero">
          <div>
            <span className="learning-kicker">Mis cursos</span>

            <h2>Cursos activos matriculados</h2>

            <p>
              Accede a tus cursos activos, tareas, materiales y próximas entregas.
            </p>
          </div>

          <div className="learning-hero-icon">
            <i className="bi bi-journal-bookmark-fill" />
          </div>
        </section>

        <LearningPanel
          title="Cursos activos"
          subtitle="Solo se muestran cursos cuya fecha actual está entre la fecha de inicio y fin."
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
                placeholder="Buscar curso..."
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
            title="Actualizando cursos..."
            message="Aplicando filtros..."
          >
            {courses.length > 0 ? (
              <div className="teacher-course-grid mt-3">
                {courses.map((course) => (
                  <StudentCourseCard
                    key={course.id}
                    course={course}
                    to={`/student/courses/${course.id}`}
                  />
                ))}
              </div>
            ) : (
              <EmptyLearningState
                icon="bi-journal-x"
                title="Sin cursos activos"
                message="No tienes cursos activos actualmente."
              />
            )}
          </ContentLoader>
        </LearningPanel>
      </div>
    </>
  );
}