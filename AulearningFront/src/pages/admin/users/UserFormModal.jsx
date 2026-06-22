import LoadingButton from '../../../components/common/LoadingButton';
import { useEffect, useState } from 'react';

const emptyForm = {
  name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirmation: '',
  type: 'student',
  active: true,
};

export default function UserFormModal({
  show,
  user,
  errors = {},
  loading = false,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const isEditing = Boolean(user);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? '',
        last_name: user.last_name ?? '',
        email: user.email ?? '',
        password: '',
        password_confirmation: '',
        type: user.type ?? 'student',
        active: Boolean(user.active),
      });
    } else {
      setForm(emptyForm);
    }

    setLocalError('');
    setShowPassword(false);
  }, [user, show]);

  if (!show) return null;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validatePassword = () => {
    if (!isEditing && !form.password) {
      return 'La contraseña es obligatoria.';
    }

    if (form.password && form.password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (form.password !== form.password_confirmation) {
      return 'Las contraseñas no coinciden.';
    }

    return '';
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const passwordError = validatePassword();

    if (passwordError) {
      setLocalError(passwordError);
      return;
    }

    const payload = { ...form };

    if (isEditing && !payload.password) {
      delete payload.password;
      delete payload.password_confirmation;
    }

    onSubmit(payload);
  };

  const fieldError = (field) => errors?.[field]?.[0];

  return (
    <div className="error-modal-backdrop">
      <div className="form-modal">
        <div className="form-modal-header">
          <div>
            <h4>{isEditing ? 'Editar usuario' : 'Nuevo usuario'}</h4>
            <p>
              {isEditing
                ? 'Actualiza los datos del usuario.'
                : 'Crea un nuevo usuario en la plataforma.'}
            </p>
          </div>

          <button className="btn-close" onClick={onClose} />
        </div>

        {localError && (
          <div className="alert alert-danger py-2">
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Nombre</label>
              <input
                name="name"
                className={`form-control ${fieldError('name') ? 'is-invalid' : ''}`}
                value={form.name}
                onChange={handleChange}
                required
              />
              {fieldError('name') && (
                <div className="invalid-feedback">{fieldError('name')}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Apellidos</label>
              <input
                name="last_name"
                className={`form-control ${fieldError('last_name') ? 'is-invalid' : ''}`}
                value={form.last_name}
                onChange={handleChange}
                required
              />
              {fieldError('last_name') && (
                <div className="invalid-feedback">{fieldError('last_name')}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              name="email"
              className={`form-control ${fieldError('email') ? 'is-invalid' : ''}`}
              value={form.email}
              onChange={handleChange}
              required
            />
            {fieldError('email') && (
              <div className="invalid-feedback">{fieldError('email')}</div>
            )}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Contraseña {isEditing && <small className="text-muted">(opcional)</small>}
              </label>

              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`form-control ${fieldError('password') ? 'is-invalid' : ''}`}
                  value={form.password}
                  onChange={handleChange}
                  required={!isEditing}
                  placeholder={isEditing ? 'Dejar vacío para no cambiar' : 'Mínimo 8 caracteres'}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                </button>
              </div>

              {fieldError('password') && (
                <div className="invalid-feedback d-block">
                  {fieldError('password')}
                </div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Confirmar contraseña</label>

              <input
                type={showPassword ? 'text' : 'password'}
                name="password_confirmation"
                className="form-control"
                value={form.password_confirmation}
                onChange={handleChange}
                required={!isEditing || Boolean(form.password)}
                placeholder="Repite la contraseña"
              />
            </div>
          </div>

          <small className="password-hint">
            Usa mínimo 8 caracteres. Para editar un usuario, deja la contraseña vacía si no quieres cambiarla.
          </small>

          <div className="row mt-3">
            <div className="col-md-6 mb-3">
              <label className="form-label">Tipo</label>
              <select
                name="type"
                className={`form-select ${fieldError('type') ? 'is-invalid' : ''}`}
                value={form.type}
                onChange={handleChange}
              >
                <option value="admin">Administrador</option>
                <option value="teacher">Profesor</option>
                <option value="student">Alumno</option>
              </select>
              {fieldError('type') && (
                <div className="invalid-feedback">{fieldError('type')}</div>
              )}
            </div>

            <div className="col-md-6 mb-3 d-flex align-items-end">
              <div className="form-check form-switch">
                <input
                  id="active"
                  name="active"
                  type="checkbox"
                  className="form-check-input"
                  checked={form.active}
                  onChange={handleChange}
                />
                <label htmlFor="active" className="form-check-label">
                  Usuario activo
                </label>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-2">
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
              loadingText="Guardando usuario..."
              icon="bi-check-lg"
            >
              Guardar usuario
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}