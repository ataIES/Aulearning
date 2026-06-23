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
  sort_by: 'name',
  sort_direction: 'asc',
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
    response?.data?.data ?? response?.data ?? response ?? null;

  const extractItems = (response) =>
    response?.data?.data?.data ??
    response?.data?.data ??
    response?.data?.items ??
    response?.items ??
    response ??
    [];

  const sortEnrollmentsByStudentName = (items) =>
    [...items].sort((a, b) => {
      const studentA = a.student ?? a.user ?? {};
      const studentB = b.student ?? b.user ?? {};

      const nameA = `${studentA.name ?? ''} ${studentA.last_name ?? ''}`.trim();
      const nameB = `${studentB.name ?? ''} ${studentB.last_name ?? ''}`.trim();

      return nameA.localeCompare(nameB, 'es', { sensitivity: 'base' });
    });

  const loadPage = async () => {
    try {
      setLoadingPage(true);

      const [courseResponse, studentsResponse] = await Promise.all([
        TeacherService.courseDetail(courseId),
        TeacherService.courseStudents(courseId, {
          per_page: 200,
          sort_by: 'name',
          sort_direction: 'asc',
        }),
      ]);

      setCourse(extractData(courseResponse));

      const items = extractItems(studentsResponse);
      setEnrollments(sortEnrollmentsByStudentName(items));
    } catch (error) {
      console.error(error);
      showError('No se pudieron cargar los alumnos del curso.');
    } finally {
      setLoadingPage(false);
    }
  };

  const loadStudents = async (customFilters = filters) => {
    try {
      setLoadingResults(true);

      const response = await TeacherService.courseStudents(courseId, {
        per_page: 200,
        sort_by: customFilters.sort_by,
        sort_direction: customFilters.sort_direction,
        search: customFilters.search || undefined,
      });

      const items = extractItems(response);
      setEnrollments(sortEnrollmentsByStudentName(items));
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

    loadStudents(filters);
  };

  const handleReset = () => {
    const reset = { ...defaultFilters };

    setFilters(reset);
    loadStudents(reset);
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