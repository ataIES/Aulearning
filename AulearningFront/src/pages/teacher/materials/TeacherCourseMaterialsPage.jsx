import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import ConfirmModal from '../../../components/common/ConfirmModal';
import ContentLoader from '../../../components/common/ContentLoader';
import PageLoader from '../../../components/common/PageLoader';
import EmptyLearningState from '../../../components/learning/EmptyLearningState';
import LearningPanel from '../../../components/learning/LearningPanel';

import { useUI } from '../../../hooks/useUI';
import TeacherService from '../../../services/TeacherService';

import MaterialFormModal from './MaterialFormModal';

const defaultFilters = {
  search: '',
  task_id: '',
};

export default function TeacherCourseMaterialsPage() {
  const { courseId } = useParams();
  const { showError } = useUI();

  const [course, setCourse] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const buildFilters = () => {
    const params = {
      course_id: courseId,
      per_page: 200,
    };

    if (filters.search) params.search = filters.search;
    if (filters.task_id) params.task_id = filters.task_id;

    return params;
  };

  const loadPage = async () => {
    try {
      setLoadingPage(true);

      const [courseResponse, tasksResponse, materialsResponse] =
        await Promise.all([
          TeacherService.courseDetail(courseId),
          TeacherService.courseTasks(courseId, {
            per_page: 200,
          }),
          TeacherService.courseMaterials({
            course_id: courseId,
            per_page: 200,
          }),
        ]);

      setCourse(extractData(courseResponse));
      setTasks(extractItems(tasksResponse));
      setMaterials(extractItems(materialsResponse));
    } catch (error) {
      console.error(error);
      showError('No se pudieron cargar los materiales del curso.');
    } finally {
      setLoadingPage(false);
    }
  };

  const loadMaterials = async (params = {}) => {
    try {
      setLoadingResults(true);

      const response = await TeacherService.courseMaterials({
        course_id: courseId,
        per_page: 200,
        ...params,
      });

      setMaterials(extractItems(response));
    } catch (error) {
      console.error(error);
      showError('No se pudieron actualizar los materiales.');
    } finally {
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, [courseId]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    event.stopPropagation();

    loadMaterials(buildFilters());
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    loadMaterials();
  };

  const openForm = () => {
    setFormErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    if (uploading) return;

    setShowForm(false);
    setFormErrors({});
  };

  const handleUpload = async (payload) => {
    try {
      setUploading(true);
      setFormErrors({});

      await TeacherService.uploadMaterial(payload);

      setShowForm(false);

      await loadMaterials(buildFilters());
    } catch (error) {
      const response = error.response?.data;

      if (response?.errors) {
        setFormErrors(response.errors);

        const firstKey = Object.keys(response.errors)[0];
        const firstMessage = response.errors[firstKey]?.[0];

        showError(firstMessage ?? response.message, 'Error de validación');
        return;
      }

      showError(response?.message ?? 'No se pudo subir el material.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!materialToDelete) return;

    try {
      setDeleting(true);

      await TeacherService.deleteMaterial(materialToDelete.id);

      setMaterialToDelete(null);

      await loadMaterials(buildFilters());
    } catch {
      showError('No se pudo eliminar el material.');
    } finally {
      setDeleting(false);
    }
  };

  const getFileUrl = (file) => {
    if (file.url) return file.url;

    if (file.path?.startsWith('http')) {
      return file.path;
    }

    return `${import.meta.env.VITE_API_URL?.replace('/api/v1', '')}/storage/${file.path}`;
  };

  if (loadingPage) {
    return (
      <PageLoader
        title="Cargando materiales"
        message="Preparando archivos y recursos del curso..."
      />
    );
  }

  return (
    <div className="learning-dashboard">
      <section className="learning-hero">
        <div>
          <span className="learning-kicker">Materiales del curso</span>

          <h2>{course?.name ?? 'Curso'}</h2>

          <p>
            Sube, consulta y gestiona los recursos compartidos con tus alumnos.
          </p>
        </div>

        <div className="learning-hero-icon">
          <i className="bi bi-folder2-open" />
        </div>
      </section>

      <LearningPanel
        title="Materiales"
        subtitle="Filtra por tarea o busca archivos concretos."
        action={
          <div className="d-flex gap-2">
            <Link
              to={`/teacher/courses/${courseId}`}
              className="btn btn-outline-secondary btn-sm"
            >
              Volver
            </Link>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={openForm}
              disabled={loadingResults}
            >
              <i className="bi bi-upload me-1" />
              Subir material
            </button>
          </div>
        }
      >
        <form className="learning-filter-bar" onSubmit={handleSearch}>
          <div className="learning-filter-input">
            <i className="bi bi-search" />

            <input
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
              placeholder="Buscar archivo..."
              disabled={loadingResults}
            />
          </div>

          <select
            className="form-select learning-filter-select"
            value={filters.task_id}
            onChange={(event) => updateFilter('task_id', event.target.value)}
            disabled={loadingResults}
          >
            <option value="">Todas las tareas</option>

            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>

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
          title="Actualizando materiales..."
          message="Aplicando filtros..."
        >
          {materials.length > 0 ? (
            <div className="learning-material-grid mt-3">
              {materials.map((file) => (
                <article className="learning-material-card" key={file.id}>
                  <div className="learning-material-icon">
                    <i className="bi bi-file-earmark-text-fill" />
                  </div>

                  <div className="learning-material-info">
                    <h5>{file.name}</h5>

                    <p>
                      {file.task?.title ?? 'Sin tarea'} ·{' '}
                      {file.mime_type ?? 'Archivo'}
                    </p>

                    <small>
                      {file.size
                        ? `${(file.size / 1024).toFixed(1)} KB`
                        : 'Tamaño desconocido'}
                    </small>
                  </div>

                  <div className="learning-material-actions">
                    <a
                      href={getFileUrl(file)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-primary btn-sm"
                    >
                      Descargar
                    </a>

                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => setMaterialToDelete(file)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyLearningState
              icon="bi-folder-x"
              title="Sin materiales"
              message="Todavía no hay archivos subidos para este curso."
            />
          )}
        </ContentLoader>
      </LearningPanel>

      <MaterialFormModal
        show={showForm}
        tasks={tasks}
        errors={formErrors}
        loading={uploading}
        onClose={closeForm}
        onSubmit={handleUpload}
      />

      <ConfirmModal
        show={Boolean(materialToDelete)}
        title="Eliminar material"
        message={`¿Seguro que quieres eliminar "${materialToDelete?.name ?? ''}"?`}
        confirmText="Eliminar"
        loading={deleting}
        onClose={() => setMaterialToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}