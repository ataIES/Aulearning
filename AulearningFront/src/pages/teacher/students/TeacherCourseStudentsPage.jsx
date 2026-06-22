import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import ContentLoader from '../../../components/common/ContentLoader';
import PageLoader from '../../../components/common/PageLoader';
import EmptyLearningState from '../../../components/learning/EmptyLearningState';
import LearningPanel from '../../../components/learning/LearningPanel';

import { useUI } from '../../../hooks/useUI';
import TeacherService from '../../../services/TeacherService';

const defaultFilters = {
  search: '',
};

export default function TeacherCourseStudentsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { showError } = useUI();

  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

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

      const [courseResponse, studentsResponse] = await Promise.all([
        TeacherService.courseDetail(courseId),
        TeacherService.courseStudents(courseId, {
          per_page: 200,
        }),
      ]);

      setCourse(extractData(courseResponse));
      setEnrollments(extractItems(studentsResponse));
    } catch (error) {
      console.error(error);
      showError('No se pudieron cargar los alumnos del curso.');
    } finally {
      setLoadingPage(false);
    }
  };

  const loadStudents = async (params = {}) => {
    try {
      setLoadingResults(true);

      const response = await TeacherService.courseStudents(courseId, {
        per_page: 200,
        ...params,
      });

      setEnrollments(extractItems(response));
    } catch (error) {
      console.error(error);
      showError('No se pudieron actualizar los alumnos.');
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

    loadStudents({
      search: filters.search,
    });
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    loadStudents();
  };

  const goToDeliveries = (studentId) => {
    navigate(`/teacher/courses/${courseId}/deliveries?student_id=${studentId}`);
  };

  if (loadingPage) {
    return (
      <PageLoader
        title="Cargando alumnos"
        message="Preparando alumnos matriculados..."
      />
    );
  }

  return (
    <div className="learning-dashboard">
      <section className="learning-hero">
        <div>
          <span className="learning-kicker">Alumnos del curso</span>

          <h2>{course?.name ?? 'Curso'}</h2>

          <p>
            Consulta los alumnos matriculados y accede rápidamente a sus entregas.
          </p>
        </div>

        <div className="learning-hero-icon">
          <i className="bi bi-people-fill" />
        </div>
      </section>

      <LearningPanel
        title="Alumnos"
        subtitle="Busca alumnos matriculados en este curso."
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
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  search: event.target.value,
                }))
              }
              placeholder="Buscar alumno..."
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
          title="Actualizando alumnos..."
          message="Aplicando filtros..."
        >
          {enrollments.length > 0 ? (
            <div className="learning-student-grid mt-3">
              {enrollments.map((enrollment) => {
                const student = enrollment.student ?? enrollment.user ?? {};

                return (
                  <article className="learning-student-card" key={enrollment.id}>
                    <div className="learning-student-avatar">
                      {(student.name ?? 'A').charAt(0).toUpperCase()}
                    </div>

                    <div className="learning-student-info">
                      <h5>
                        {student.name ?? 'Alumno'} {student.last_name ?? ''}
                      </h5>

                      <p>{student.email ?? 'Sin email'}</p>

                      <small>
                        Matrícula:{' '}
                        {enrollment.enrollment_date
                          ? new Date(enrollment.enrollment_date).toLocaleDateString()
                          : '-'}
                      </small>
                    </div>

                    <div className="learning-student-actions">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => goToDeliveries(student.id)}
                      >
                        Ver entregas
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyLearningState
              icon="bi-people"
              title="Sin alumnos"
              message="No hay alumnos matriculados en este curso."
            />
          )}
        </ContentLoader>
      </LearningPanel>
    </div>
  );
}