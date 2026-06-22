import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ConfirmModal from '../../../components/common/ConfirmModal';
import CourseStatusBadge from '../../../components/table/CourseStatusBadge';
import DataTable from '../../../components/table/DataTable';
import TableActionButtons from '../../../components/table/TableActionButtons';
import TableEntityCell from '../../../components/table/TableEntityCell';
import TablePagination from '../../../components/table/TablePagination';
import TableStatPill from '../../../components/table/TableStatPill';
import TableToolbar from '../../../components/table/TableToolbar';
import TableUserCell from '../../../components/table/TableUserCell';

import { useUI } from '../../../hooks/useUI';
import CourseService from '../../../services/CourseService';
import UserService from '../../../services/UserService';

import CourseFormModal from './CourseFormModal';

const defaultFilters = {
  search: '',
  per_page: 10,
  page: 1,
};

export default function AdminCoursesPage() {
  const navigate = useNavigate();
  const { showError } = useUI();

  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [tableLoading, setTableLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [teachersLoading, setTeachersLoading] = useState(false);

  const buildParams = () => {
    const params = {
      page: filters.page,
      per_page: filters.per_page,
    };

    if (filters.search) {
      params.search = filters.search;
    }

    return params;
  };

  const loadCourses = async () => {
    try {
      setTableLoading(true);

      const response = await CourseService.paginate(buildParams());

      setCourses(response.data?.data ?? response.data?.items ?? []);
      setMeta(response.data?.meta ?? response.data?.pagination ?? null);
      setTeachers(response.data?.data ?? response.data?.data ?? []);
    } catch {
      showError('No se pudo cargar la lista de cursos.');
    } finally {
      setTableLoading(false);
    }
  };

  const loadTeachers = async () => {
    try {
      setTeachersLoading(true);

      const response = await UserService.paginate({
        type: 'teacher',
        per_page: 200,
      });

      const items =
        response.data?.data?.data ??
        response.data?.data ??
        response.data?.items ??
        [];

      setTeachers(items);
    } catch (error) {
      console.error(error);
      showError('No se pudieron cargar los profesores.');
    } finally {
      setTeachersLoading(false);
    }
  };
  useEffect(() => {
    loadCourses();
  }, [filters.page, filters.per_page]);

  useEffect(() => {
    loadTeachers();
  }, []);

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
    loadCourses();
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setTimeout(loadCourses, 0);
  };

  const openCreate = () => {
    setSelectedCourse(null);
    setFormErrors({});
    setShowForm(true);
  };

  const openEdit = (course) => {
    setSelectedCourse(course);
    setFormErrors({});
    setShowForm(true);
  };

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      setFormErrors({});

      if (selectedCourse) {
        await CourseService.update(selectedCourse.id, payload);
      } else {
        await CourseService.create(payload);
      }

      setShowForm(false);
      setSelectedCourse(null);

      await loadCourses();
    } catch (error) {
      const response = error.response?.data;

      if (response?.errors) {
        setFormErrors(response.errors);

        const firstKey = Object.keys(response.errors)[0];
        const firstMessage = response.errors[firstKey]?.[0];

        showError(firstMessage ?? response.message, 'Error de validación');
        return;
      }

      showError(response?.message ?? 'No se pudo guardar el curso.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;

    try {
      setDeleting(true);

      await CourseService.delete(courseToDelete.id);

      setCourseToDelete(null);
      await loadCourses();
    } catch {
      showError('No se pudo eliminar el curso.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      label: 'Curso',
      render: (course) => (
        <TableEntityCell
          icon="bi-journal-bookmark-fill"
          title={course.name}
          subtitle={course.code ?? `CUR-${course.id}`}
          variant="blue"
        />
      ),
    },
    {
      label: 'Profesor',
      render: (course) =>
        course.teacher ? (
          <TableUserCell
            name={`${course.teacher.name ?? ''} ${course.teacher.last_name ?? ''}`}
            email={course.teacher.email}
          />
        ) : (
          <span className="text-muted">Sin profesor asignado</span>
        ),
    },
    {
      label: 'Alumnos',
      render: (course) => (
        <TableStatPill
          icon="bi-people-fill"
          value={course.enrollments_count ?? 0}
          variant="green"
        />
      ),
    },
    {
      label: 'Tareas',
      render: (course) => (
        <TableStatPill
          icon="bi-list-task"
          value={course.tasks_count ?? 0}
          variant="purple"
        />
      ),
    },
    {
      label: 'Periodo',
      render: (course) => (
        <div className="course-period">
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
      ),
    },
    {
      label: 'Estado',
      render: (course) => (
        <CourseStatusBadge
          startDate={course.start_date}
          endDate={course.end_date}
        />
      ),
    },
    {
      label: 'Acciones',
      render: (course) => (
        <TableActionButtons
          onEdit={() => openEdit(course)}
          onView={() => navigate(`/admin/courses/${course.id}`)}
          onDelete={() => setCourseToDelete(course)}
          extra={[
            {
              title: 'Matricular alumnos',
              icon: 'bi-person-plus-fill',
              variant: 'success',
              onClick: () =>
                navigate(`/admin/courses/${course.id}/enrollments`),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div>
      <TableToolbar
        title="Cursos"
        subtitle="Gestiona la ficha base de los cursos, sus profesores y sus matrículas."
        search={filters.search}
        searchPlaceholder="Buscar curso..."
        onSearchChange={(value) => updateFilter('search', value)}
        onSearchSubmit={handleSearch}
        createLabel="Nuevo curso"
        onCreate={openCreate}
        loading={tableLoading || teachersLoading}
        createDisabled={tableLoading || teachersLoading}
        filters={
          <>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.per_page}
                onChange={(event) => updateFilter('per_page', event.target.value)}
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
            className="btn btn-outline-secondary"
            type="button"
            onClick={handleReset}
          >
            <i className="bi bi-arrow-clockwise" />
          </button>
        }
      />

      <div className="admin-panel-card">
        <DataTable columns={columns} data={courses} loading={tableLoading} />

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

      <CourseFormModal
        show={showForm}
        course={selectedCourse}
        teachers={teachers}
        errors={formErrors}
        loading={saving}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        show={Boolean(courseToDelete)}
        title="Eliminar curso"
        message={`¿Seguro que quieres eliminar el curso ${courseToDelete?.name ?? ''
          }?`}
        confirmText="Eliminar"
        loading={deleting}
        onClose={() => setCourseToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}