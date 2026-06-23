import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import PageLoader from '../../../components/common/PageLoader';
import CourseStatusBadge from '../../../components/table/CourseStatusBadge';
import TableStatPill from '../../../components/table/TableStatPill';
import TableUserCell from '../../../components/table/TableUserCell';

import { useUI } from '../../../hooks/useUI';
import CourseService from '../../../services/CourseService';

export default function AdminCourseDetailPage() {
  const { courseId } = useParams();
  const { showError } = useUI();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCourse = async () => {
    try {
      setLoading(true);

      const response = await CourseService.find(courseId);

      setCourse(response.data);
    } catch {
      showError('No se pudo cargar el curso.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  if (loading) {
    return (
      <PageLoader
        title="Cargando curso"
        message="Preparando la información del curso..."
      />
    );
  }

  if (!course) return null;

  return (
    <div>
      <div className="course-detail-header">
        <div>
          <Link to="/admin/courses" className="btn btn-outline-secondary mb-3">
            <i className="bi bi-arrow-left me-1" />
            Volver a cursos
          </Link>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div className="course-detail-icon">
              <i className="bi bi-journal-bookmark-fill" />
            </div>

            <div>
              <h3>{course.name}</h3>
              <p>{course.code ?? `CUR-${course.id}`}</p>
            </div>
          </div>
        </div>

        <CourseStatusBadge
          startDate={course.start_date}
          endDate={course.end_date}
        />
      </div>

      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="admin-stat-card no-link">
            <div className="admin-stat-icon">
              <i className="bi bi-people-fill" />
            </div>

            <div>
              <h4>{course.enrollments_count ?? 0}</h4>
              <p>Alumnos</p>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="admin-stat-card no-link">
            <div className="admin-stat-icon">
              <i className="bi bi-list-task" />
            </div>

            <div>
              <h4>{course.tasks_count ?? 0}</h4>
              <p>Tareas</p>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <Link
            to={`/admin/courses/${course.id}/enrollments`}
            className="admin-stat-card"
          >
            <div className="admin-stat-icon">
              <i className="bi bi-person-plus-fill" />
            </div>

            <div>
              <h4>Gestionar</h4>
              <p>Matrículas</p>
            </div>
          </Link>
        </div>

        <div className="col-xl-3 col-md-6">
          <Link to="/admin/courses" className="admin-stat-card">
            <div className="admin-stat-icon">
              <i className="bi bi-arrow-left-circle" />
            </div>

            <div>
              <h4>Volver</h4>
              <p>Listado</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-7">
          <div className="admin-panel-card">
            <div className="admin-panel-header">
              <h5>Información del curso</h5>
            </div>

            <div className="course-info-grid">
              <div>
                <small>Profesor</small>

                {course.teacher ? (
                  <TableUserCell
                    name={`${course.teacher.name ?? ''} ${course.teacher.last_name ?? ''}`}
                    email={course.teacher.email}
                  />
                ) : (
                  <strong className="text-muted">Sin profesor asignado</strong>
                )}
              </div>

              <div>
                <small>Periodo</small>

                <div className="course-period mt-2">
                  <div>
                    <small>Inicio</small>
                    <strong>
                      {course.start_date
                        ? new Date(course.start_date).toLocaleDateString()
                        : '-'}
                    </strong>
                  </div>

                  <i className="bi bi-arrow-right" />

                  <div>
                    <small>Fin</small>
                    <strong>
                      {course.end_date
                        ? new Date(course.end_date).toLocaleDateString()
                        : '-'}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="course-info-description">
                <small>Descripción</small>
                <p>{course.description || 'Sin descripción.'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-5">
          <div className="admin-panel-card">
            <div className="admin-panel-header">
              <h5>Acciones rápidas</h5>
            </div>

            <div className="d-grid gap-2">
              <Link
                className="btn btn-primary"
                to={`/admin/courses/${course.id}/enrollments`}
              >
                <i className="bi bi-person-plus-fill me-2" />
                Matricular alumnos
              </Link>

              <Link className="btn btn-outline-primary" to="/admin/courses">
                <i className="bi bi-pencil-square me-2" />
                Editar desde listado
              </Link>
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="admin-panel-card">
            <div className="admin-panel-header">
              <h5>Últimos alumnos matriculados</h5>

              <Link to={`/admin/courses/${course.id}/enrollments`}>
                Ver matrículas
              </Link>
            </div>

            {(course.enrollments ?? []).length > 0 ? (
              <div className="course-detail-list">
                {course.enrollments.slice(0, 5).map((enrollment) => (
                  <div className="course-detail-list-item" key={enrollment.id}>
                    <TableUserCell
                      name={`${enrollment.student?.name ?? ''} ${enrollment.student?.last_name ?? ''}`}
                      email={enrollment.student?.email}
                    />

                    <TableStatPill
                      icon="bi-calendar-check"
                      value={
                        enrollment.enrollment_date
                          ? new Date(enrollment.enrollment_date).toLocaleDateString()
                          : '-'
                      }
                      variant="blue"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0">No hay alumnos matriculados.</p>
            )}
          </div>
        </div>

        <div className="col-xl-6">
          <div className="admin-panel-card">
            <div className="admin-panel-header">
              <h5>Últimas tareas</h5>
            </div>

            {(course.tasks ?? []).length > 0 ? (
              <div className="course-detail-list">
                {course.tasks.slice(0, 5).map((task) => (
                  <div className="course-detail-list-item" key={task.id}>
                    <div>
                      <strong>{task.title}</strong>
                      <small className="d-block text-muted">
                        {task.type ?? 'Tarea'}
                      </small>
                    </div>

                    <span className="badge bg-primary-subtle text-primary">
                      #{task.id}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0">No hay tareas en este curso.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}