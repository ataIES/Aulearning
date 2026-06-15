import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import ConfirmModal from '../../../components/common/ConfirmModal';
import LoadingButton from '../../../components/common/LoadingButton';
import DataTable from '../../../components/table/DataTable';
import TableActionButtons from '../../../components/table/TableActionButtons';
import TablePagination from '../../../components/table/TablePagination';
import TableToolbar from '../../../components/table/TableToolbar';
import TableUserCell from '../../../components/table/TableUserCell';

import { useUI } from '../../../hooks/useUI';
import CourseService from '../../../services/CourseService';
import EnrollmentService from '../../../services/EnrollmentService';
import UserService from '../../../services/UserService';

const defaultFilters = {
  search: '',
  per_page: 10,
  page: 1,
};

export default function AdminCourseEnrollmentsPage() {
  const { courseId } = useParams();
  const { showError } = useUI();

  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [tableLoading, setTableLoading] = useState(false);

  const [enrollmentToDelete, setEnrollmentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const buildParams = () => {
    const params = {
      course_id: courseId,
      page: filters.page,
      per_page: filters.per_page,
    };

    if (filters.search) {
      params.search = filters.search;
    }

    return params;
  };

  const loadCourse = async () => {
    try {
      const response = await CourseService.find(courseId);
      setCourse(response.data);
    } catch {
      showError('No se pudo cargar el curso.');
    }
  };

  const loadEnrollments = async () => {
    try {
      setTableLoading(true);

      const response = await EnrollmentService.paginate(buildParams());

      setEnrollments(response.data?.data ?? response.data?.items ?? []);
      setMeta(response.data?.meta ?? response.data?.pagination ?? null);
    } catch {
      showError('No se pudieron cargar las matrículas.');
    } finally {
      setTableLoading(false);
    }
  };

  const loadAvailableStudents = async () => {
    try {
      const response = await UserService.paginate({
        type: 'student',
        active: 1,
        per_page: 200,
      });

      setStudents(response.data?.data ?? response.data?.items ?? []);
    } catch {
      showError('No se pudieron cargar los alumnos.');
    }
  };

  useEffect(() => {
    loadCourse();
    loadAvailableStudents();
  }, [courseId]);

  useEffect(() => {
    loadEnrollments();
  }, [courseId, filters.page, filters.per_page]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    event.stopPropagation();
    loadEnrollments();
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setTimeout(loadEnrollments, 0);
  };

  const handleEnroll = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!selectedStudentId) {
      showError('Selecciona un alumno para matricular.');
      return;
    }

    try {
      setSaving(true);

      await EnrollmentService.create({
        course_id: Number(courseId),
        student_id: Number(selectedStudentId),
      });

      setSelectedStudentId('');

      await loadEnrollments();
    } catch (error) {
      const response = error.response?.data;

      if (response?.errors) {
        const firstKey = Object.keys(response.errors)[0];
        const firstMessage = response.errors[firstKey]?.[0];

        showError(firstMessage ?? response.message, 'Error de validación');
        return;
      }

      showError(response?.message ?? 'No se pudo matricular el alumno.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!enrollmentToDelete) return;

    try {
      setDeleting(true);

      await EnrollmentService.delete(enrollmentToDelete.id);

      setEnrollmentToDelete(null);
      await loadEnrollments();
    } catch {
      showError('No se pudo eliminar la matrícula.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      label: 'Alumno',
      render: (enrollment) => (
        <TableUserCell
          name={`${enrollment.student?.name ?? ''} ${
            enrollment.student?.last_name ?? ''
          }`}
          email={enrollment.student?.email}
        />
      ),
    },
    {
      label: 'Fecha matrícula',
      render: (enrollment) =>
        enrollment.enrollment_date
          ? new Date(enrollment.enrollment_date).toLocaleDateString()
          : '-',
    },
    {
      label: 'Acciones',
      render: (enrollment) => (
        <TableActionButtons
          onDelete={() => setEnrollmentToDelete(enrollment)}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="admin-dashboard-header">
        <div>
          <h3>Matricular alumnos</h3>
          <p>
            Curso: <strong>{course?.name ?? `#${courseId}`}</strong>
          </p>
        </div>

        <Link className="btn btn-outline-secondary" to="/admin/courses">
          <i className="bi bi-arrow-left me-1" />
          Volver a cursos
        </Link>
      </div>

      <div className="admin-panel-card mb-3">
        <form onSubmit={handleEnroll} noValidate>
          <div className="row g-2 align-items-end">
            <div className="col-md-8">
              <label className="form-label">Alumno</label>

              <select
                className="form-select"
                value={selectedStudentId}
                onChange={(event) => setSelectedStudentId(event.target.value)}
              >
                <option value="">Selecciona un alumno...</option>

                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} {student.last_name ?? ''} — {student.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <LoadingButton
                type="submit"
                loading={saving}
                loadingText="Matriculando..."
                icon="bi-person-plus-fill"
                className="w-100"
              >
                Matricular alumno
              </LoadingButton>
            </div>
          </div>
        </form>
      </div>

      <TableToolbar
        title="Alumnos matriculados"
        subtitle="Consulta y elimina matrículas del curso."
        search={filters.search}
        searchPlaceholder="Buscar alumno..."
        onSearchChange={(value) => updateFilter('search', value)}
        onSearchSubmit={handleSearch}
        filters={
          <div className="col-md-2">
            <select
              className="form-select"
              value={filters.per_page}
              onChange={(event) =>
                updateFilter('per_page', event.target.value)
              }
            >
              <option value="10">10 por página</option>
              <option value="15">15 por página</option>
              <option value="25">25 por página</option>
              <option value="50">50 por página</option>
            </select>
          </div>
        }
        actions={
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={handleReset}
          >
            <i className="bi bi-arrow-clockwise" />
          </button>
        }
      />

      <div className="admin-panel-card">
        <DataTable
          columns={columns}
          data={enrollments}
          loading={tableLoading}
        />

        <TablePagination
          meta={meta}
          onPageChange={(page) =>
            setFilters((prev) => ({
              ...prev,
              page,
            }))
          }
        />
      </div>

      <ConfirmModal
        show={Boolean(enrollmentToDelete)}
        title="Eliminar matrícula"
        message="¿Seguro que quieres quitar este alumno del curso?"
        confirmText="Eliminar"
        loading={deleting}
        onClose={() => setEnrollmentToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}