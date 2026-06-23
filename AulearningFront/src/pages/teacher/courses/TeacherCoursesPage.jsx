import { useEffect, useState } from 'react';

import CourseCard from '../../../components/learning/CourseCard';
import EmptyLearningState from '../../../components/learning/EmptyLearningState';
import LearningPanel from '../../../components/learning/LearningPanel';
import PageLoader from '../../../components/common/PageLoader';
import ContentLoader from '../../../components/common/ContentLoader';

import { useAuth } from '../../../hooks/useAuth';
import { useUI } from '../../../hooks/useUI';
import TeacherService from '../../../services/TeacherService';

export default function TeacherCoursesPage() {
  const { user } = useAuth();
  const { showError } = useUI();

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');

  const extractItems = (response) =>
    response.data?.data?.data ??
    response.data?.data ??
    response.data?.items ??
    response.data ??
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

  const loadCourses = async (params = {}, firstLoad = false) => {
    try {
      if (firstLoad) {
        setLoadingPage(true);
      } else {
        setLoadingResults(true);
      }

      const response = await TeacherService.courses({
        teacher_id: user.id,
        per_page: 100,
        sort_by: 'name',
        sort_direction: 'asc',
        ...params,
      });

      const validCourses = extractItems(response).filter(isCourseActiveToday);

      setCourses(validCourses);
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
  }, [user]);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    loadCourses(
      {
        search,
      },
      false
    );
  };

  const handleReset = () => {
    setSearch('');
    loadCourses({}, false);
  };

  if (loadingPage) {
    return (
      <PageLoader
        title="Cargando cursos"
        message="Preparando tus cursos..."
      />
    );
  }

  return (
    <div className="learning-dashboard">
      <section className="learning-hero">
        <div>
          <span className="learning-kicker">Mis cursos</span>
          <h2>Tus cursos asignados</h2>
          <p>
            Accede a los cursos activos que tienes asignados para gestionar
            tareas, alumnos y entregas.
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
        <form className="learning-filter-bar" onSubmit={handleSubmit}>
          <div className="learning-filter-input">
            <i className="bi bi-search" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar curso..."
              disabled={loadingResults}
            />
          </div>

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
          title="Actualizando cursos..."
          message="Aplicando filtros..."
        >
          {courses.length > 0 ? (
            <div className="teacher-course-grid mt-3">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  to={`/teacher/courses/${course.id}`}
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
  );
}