import { useEffect, useState } from 'react';

import LoadingButton from '../../../components/common/LoadingButton';
import { useUI } from '../../../hooks/useUI';

const emptyForm = {
  comment: '',
  files: [],
};

const ALLOWED_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'webp',
  'pdf',
  'doc',
  'docx',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function SubmitTaskModal({
  show,
  task,
  delivery,
  errors = {},
  loading = false,
  onClose,
  onSubmit,
}) {
  const { showError } = useUI();

  const [form, setForm] = useState(emptyForm);
  const [removedFiles, setRemovedFiles] = useState([]);

  const isEditing = Boolean(delivery);

  useEffect(() => {
    if (show) {
      setForm({
        comment: delivery?.comment ?? '',
        files: [],
      });

      setRemovedFiles([]);
    }
  }, [show, delivery]);

  if (!show) return null;

  const fieldError = (field) => {
    if (errors?.[field]?.[0]) {
      return errors[field][0];
    }

    const nestedKey = Object.keys(errors ?? {}).find((key) =>
      key.startsWith(`${field}.`)
    );

    return nestedKey ? errors[nestedKey]?.[0] : null;
  };

  const validateFile = (file) => {
    const extension = file.name
      .split('.')
      .pop()
      ?.toLowerCase();

    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      return 'Solo se permiten imágenes, archivos PDF y documentos Word.';
    }

    if (file.size > MAX_FILE_SIZE) {
      return `El archivo "${file.name}" no puede superar los 10 MB.`;
    }

    return null;
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (files) {
      const selectedFiles = Array.from(files);

      for (const file of selectedFiles) {
        const validationError = validateFile(file);

        if (validationError) {
          showError(
            validationError,
            'Archivo no válido'
          );

          event.target.value = '';

          setForm((prev) => ({
            ...prev,
            [name]: [],
          }));

          return;
        }
      }

      setForm((prev) => ({
        ...prev,
        [name]: selectedFiles,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemoveFile = (fileId) => {
    setRemovedFiles((prev) =>
      prev.includes(fileId)
        ? prev
        : [...prev, fileId]
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    onSubmit({
      ...form,
      removed_files: removedFiles,
    });
  };

  return (
    <div className="form-modal-backdrop">
      <div className="form-modal">
        <div className="form-modal-header">
          <div>
            <h4>
              {isEditing
                ? 'Actualizar entrega'
                : 'Entregar tarea'}
            </h4>

            <p>{task?.title ?? 'Tarea'}</p>
          </div>

          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            disabled={loading}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
        >
          {delivery?.files?.length > 0 && (
            <div className="mb-3">
              <label className="form-label">
                Archivos entregados
              </label>

              <div className="task-current-files">
                {delivery.files
                  .filter(
                    (file) =>
                      !removedFiles.includes(file.id)
                  )
                  .map((file) => (
                    <div
                      key={file.id}
                      className="task-current-file d-flex align-items-center justify-content-between"
                    >
                      <a
                        href={file.url ?? file.path}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="bi bi-paperclip me-1" />
                        {file.name}
                      </a>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          handleRemoveFile(file.id)
                        }
                        disabled={loading}
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">
              Comentario
            </label>

            <textarea
              name="comment"
              rows="4"
              className={`form-control ${
                fieldError('comment')
                  ? 'is-invalid'
                  : ''
              }`}
              value={form.comment}
              onChange={handleChange}
              disabled={loading}
              placeholder="Añade un comentario para el profesor..."
            />

            {fieldError('comment') && (
              <div className="invalid-feedback">
                {fieldError('comment')}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label">
              {isEditing
                ? 'Añadir nuevos archivos'
                : 'Archivos'}
            </label>

            <input
              type="file"
              name="files"
              multiple
              accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
              className={`form-control ${
                fieldError('files')
                  ? 'is-invalid'
                  : ''
              }`}
              onChange={handleChange}
              disabled={loading}
            />

            <small className="text-muted">
              Imágenes, PDF o Word. Máximo 10 MB por archivo.
            </small>

            {fieldError('files') && (
              <div className="invalid-feedback">
                {fieldError('files')}
              </div>
            )}
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>

            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Guardando entrega..."
              icon="bi-upload"
            >
              {isEditing
                ? 'Actualizar entrega'
                : 'Entregar tarea'}
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}