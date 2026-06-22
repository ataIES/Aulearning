import { useEffect, useState } from 'react';

import ConfirmModal from '../../../components/common/ConfirmModal';
import PageLoader from '../../../components/common/PageLoader';
import DataTable from '../../../components/table/DataTable';
import TableActionButtons from '../../../components/table/TableActionButtons';
import TableEntityCell from '../../../components/table/TableEntityCell';
import TablePagination from '../../../components/table/TablePagination';
import TableToolbar from '../../../components/table/TableToolbar';
import TableUserCell from '../../../components/table/TableUserCell';

import { useUI } from '../../../hooks/useUI';

import CourseService from '../../../services/CourseService';
import EnrollmentService from '../../../services/EnrollmentService';
import UserService from '../../../services/UserService';

import EnrollmentFormModal from './EnrollmentFormModal';

const defaultFilters = {
  search: '',
  student_id: '',
  course_id: '',
  teacher_id: '',
  per_page: 10,
  page: 1,
};

export default function AdminEnrollmentsPage() {
  const { showError } = useUI();

  const [pageLoading, setPageLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  const [enrollments, setEnrollments] = useState([]);
  const [meta, setMeta] = useState(null);

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [enrollmentToDelete, setEnrollmentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const extractItems = (response) =>
    response.data?.data?.data ??
    response.data?.data ??
    response.data?.items ??
    [];

  const buildParams = () => {
    const params = {
      page: filters.page,
      per_page: filters.per_page,
    };

    if (filters.search) params.search = filters.search;
    if (filters.student_id) params.student_id = filters.student_id;
    if (filters.course_id) params.course_id = filters.course_id;
    if (filters.teacher_id) params.teacher_id = filters.teacher_id;

    return params;
  };

  const loadBaseData = async () => {
    try {
      setTableLoading(true);

      const [studentsResponse, teachersResponse, coursesResponse] =
        await Promise.all([
          UserService.paginate({ type: 'student', per_page: 300 }),
          UserService.paginate({ type: 'teacher', per_page: 300 }),
          CourseService.paginate({ per_page: 300 }),
        ]);

      setStudents(extractItems(studentsResponse));
      setTeachers(extractItems(teachersResponse));
      setCourses(extractItems(coursesResponse));

      await loadEnrollments();
    } catch (error) {
      console.error(error);
      showError('No se pudieron cargar alumnos, profesores, cursos o matrículas.');
    } finally {
      setPageLoading(false);
      setTableLoading(false);
    }
  };

  const loadEnrollments = async () => {
    try {
      setTableLoading(true);

      const response = await EnrollmentService.paginate(buildParams());

      setEnrollments(response.data?.data ?? response.data?.items ?? []);
      setMeta(response.data?.meta ?? response.data?.pagination ?? null);
    } catch (error) {
      console.error(error);
      showError('No se pudieron cargar las matrículas.');
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadBaseData();
  }, []);

  useEffect(() => {
    if (!pageLoading) {
      loadEnrollments();
    }
  }, [filters.page, filters.per_page]);

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

  const openCreate = () => {
    setFormErrors({});
    setShowForm(true);
  };

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      setFormErrors({});

      await EnrollmentService.create(payload);

      setShowForm(false);

      await loadEnrollments();
    } catch (error) {
      const response = error.response?.data;

      if (response?.errors) {
        setFormErrors(response.errors);

        const firstKey = Object.keys(response.errors)[0];
        const firstMessage = response.errors[firstKey]?.[0];

        showError(firstMessage ?? response.message, 'Error de validación');
        return;
      }

      showError(response?.message ?? 'No se pudo crear la matrícula.');
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
          name={`${enrollment.student?.name ?? ''} ${enrollment.student?.last_name ?? ''
            }`}
          email={enrollment.student?.email}
        />
      ),
    },
    {
      label: 'Curso',
      render: (enrollment) => (
        <TableEntityCell
          icon="bi-journal-bookmark-fill"
          title={enrollment.course?.name ?? 'Curso eliminado'}
          subtitle={enrollment.course?.id ? `CUR-${enrollment.course.id}` : '-'}
          variant="blue"
        />
      ),
    },
    {
      label: 'Profesor',
      render: (enrollment) =>
        enrollment.course?.teacher ? (
          <TableUserCell
            name={`${enrollment.course.teacher.name ?? ''} ${enrollment.course.teacher.last_name ?? ''
              }`}
            email={enrollment.course.teacher.email}
          />
        ) : (
          <span className="text-muted">Sin profesor</span>
        ),
    },
    {
      label: 'Fecha',
      render: (enrollment) =>
        enrollment.enrollment_date
          ? new Date(enrollment.enrollment_date).toLocaleDateString()
          : '-',
    },
    {
      label: 'Estado',
      render: (enrollment) =>
        enrollment.active ? (
          <span className="badge bg-success-subtle text-success">Activa</span>
        ) : (
          <span className="badge bg-secondary-subtle text-secondary">
            Inactiva
          </span>
        ),
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
      <TableToolbar
        title="Matrículas"
        subtitle="Gestiona todas las matrículas de la plataforma."
        search={filters.search}
        searchPlaceholder="Buscar por alumno, curso o profesor..."
        onSearchChange={(value) => updateFilter('search', value)}
        onSearchSubmit={handleSearch}
        createLabel="Nueva matrícula"
        onCreate={openCreate}
        createDisabled={tableLoading || pageLoading}
        loading={tableLoading || pageLoading}
        filters={
          <>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.student_id}
                onChange={(event) =>
                  updateFilter('student_id', event.target.value)
                }
              >
                <option value="">Todos los alumnos</option>

                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} {student.last_name ?? ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.course_id}
                onChange={(event) =>
                  updateFilter('course_id', event.target.value)
                }
              >
                <option value="">Todos los cursos</option>

                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.teacher_id}
                onChange={(event) =>
                  updateFilter('teacher_id', event.target.value)
                }
              >
                <option value="">Todos los profesores</option>

                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} {teacher.last_name ?? ''}
                  </option>
                ))}
              </select>
            </div>

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
          </>
        }
        actions={
          <button
            type="button"
            className="btn btn-outline-secondary"
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
          loading={tableLoading || pageLoading}
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

      <EnrollmentFormModal
        show={showForm}
        students={students}
        courses={courses}
        errors={formErrors}
        loading={saving}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        show={Boolean(enrollmentToDelete)}
        title="Eliminar matrícula"
        message="¿Seguro que quieres eliminar esta matrícula?"
        confirmText="Eliminar"
        loading={deleting}
        onClose={() => setEnrollmentToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}