import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ContentLoader from '../../../components/common/ContentLoader';
import PageLoader from '../../../components/common/PageLoader';
import EmptyLearningState from '../../../components/learning/EmptyLearningState';
import LearningPanel from '../../../components/learning/LearningPanel';

import { useAuth } from '../../../hooks/useAuth';
import { useUI } from '../../../hooks/useUI';
import TeacherService from '../../../services/TeacherService';

const defaultFilters = {
  search: '',
};

export default function TeacherStudentsPage() {
  const { user } = useAuth();
  const { showError } = useUI();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

  const extractItems = (response) =>
    response?.data?.data?.data ??
    response?.data?.data ??
    response?.data?.items ??
    [];

  const loadStudents = async (params = {}, firstLoad = false) => {
    try {
      if (firstLoad) {
        setLoadingPage(true);
      } else {
        setLoadingResults(true);
      }

      const response = await TeacherService.teacherStudents(user.id, params);

      setEnrollments(extractItems(response));
    } catch (error) {
      console.error(error);
      showError('No se pudieron cargar tus alumnos.');
    } finally {
      setLoadingPage(false);
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadStudents({}, true);
    }
  }, [user?.id]);

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

  const uniqueEnrollments = enrollments.filter((enrollment, index, array) => {
    const student = enrollment.student ?? enrollment.user;
    return (
      student?.id &&
      array.findIndex((item) => {
        const itemStudent = item.student ?? item.user;
        return itemStudent?.id === student.id;
      }) === index
    );
  });

  if (loadingPage) {
    return (
      <PageLoader
        title="Cargando alumnos"
        message="Preparando tus alumnos..."
      />
    );
  }

  return (
    <div className="learning-dashboard">
      <section className="learning-hero">
        <div>
          <span className="learning-kicker">Mis alumnos</span>

          <h2>Alumnos de tus cursos</h2>

          <p>
            Consulta todos los alumnos matriculados en los cursos que tienes asignados.
          </p>
        </div>

        <div className="learning-hero-icon">
          <i className="bi bi-people-fill" />
        </div>
      </section>

      <LearningPanel
        title="Alumnos"
        subtitle="Busca alumnos de todos tus cursos."
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
          title="Actualizando alumnos..."
          message="Aplicando filtros..."
        >
          {uniqueEnrollments.length > 0 ? (
            <div className="learning-student-grid mt-3">
              {uniqueEnrollments.map((enrollment) => {
                const student = enrollment.student ?? enrollment.user ?? {};
                const course = enrollment.course ?? {};

                return (
                  <article className="learning-student-card" key={`${student.id}-${enrollment.id}`}>
                    <div className="learning-student-avatar">
                      {(student.name ?? 'A').charAt(0).toUpperCase()}
                    </div>

                    <div className="learning-student-info">
                      <h5>
                        {student.name ?? 'Alumno'} {student.last_name ?? ''}
                      </h5>

                      <p>{student.email ?? 'Sin email'}</p>

                      <small>
                        Curso: {course.name ?? 'Sin curso'}
                      </small>
                    </div>

                    <div className="learning-student-actions">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          navigate(`/teacher/courses/${course.id}/deliveries?student_id=${student.id}`)
                        }
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
              message="Todavía no tienes alumnos asociados a tus cursos."
            />
          )}
        </ContentLoader>
      </LearningPanel>
    </div>
  );
}