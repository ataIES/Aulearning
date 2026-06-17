import { useEffect, useState } from 'react';

import CourseCard from '../../../components/learning/CourseCard';
import EmptyLearningState from '../../../components/learning/EmptyLearningState';
import LearningPanel from '../../../components/learning/LearningPanel';
import PageLoader from '../../../components/common/PageLoader';

import { useAuth } from '../../../hooks/useAuth';
import { useUI } from '../../../hooks/useUI';
import TeacherService from '../../../services/TeacherService';
import ContentLoader from '../../../components/common/ContentLoader';

export default function TeacherCoursesPage() {
  const { user } = useAuth();
  const { showError } = useUI();

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');

  const extractItems = (response) =>
    response.data?.data ??
    response.data?.items ??
    response.data ??
    [];

  const loadCourses = async (
    params = {},
    firstLoad = false,
  ) => {
    try {
      if (firstLoad) {
        setLoadingPage(true);
      } else {
        setLoadingResults(true);
      }

      const response = await TeacherService.courses({
        teacher_id: user.id,
        per_page: 100,
        ...params,
      });

      setCourses(extractItems(response));
    } catch (error) {
      console.error(error);

      showError(
        'No se pudieron cargar tus cursos.'
      );
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
            Accede a los cursos que tienes asignados para gestionar tareas,
            alumnos y entregas.
          </p>
        </div>

        <div className="learning-hero-icon">
          <i className="bi bi-journal-bookmark-fill" />
        </div>
      </section>

      <LearningPanel
        title="Cursos"
        subtitle="Busca y accede rápidamente a cualquiera de tus cursos."
      >
        <form className="learning-filter-bar" onSubmit={handleSubmit}>
          <div className="learning-filter-input">
            <i className="bi bi-search" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar curso..."
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Buscar
          </button>

          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={handleReset}
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
              title="Sin cursos"
              message="No tienes cursos asignados actualmente."
            />
          )}
        </ContentLoader>
      </LearningPanel>
    </div>
  );
}