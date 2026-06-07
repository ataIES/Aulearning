import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import Loader from '../../components/common/Loader';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, checkingAuth } = useAuth();
  const { setLoading, showError, showSuccess } = useUI();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});

  if (checkingAuth) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    setFieldErrors({
      ...fieldErrors,
      [event.target.name]: null,
    });
  };

  const getBackendErrorMessage = (error) => {
    const response = error.response?.data;

    if (response?.errors) {
      const firstKey = Object.keys(response.errors)[0];
      return response.errors[firstKey]?.[0] ?? 'Error de validación.';
    }

    return response?.message ?? 'No se pudo iniciar sesión.';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setFieldErrors({});

    try {
      await login(form);

      navigate('/dashboard');
    } catch (error) {
      const response = error.response?.data;

      if (response?.errors) {
        setFieldErrors(response.errors);
      }

      showError(getBackendErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <div className="brand-logo mx-auto mb-3">A</div>
          <h3>Aulearning</h3>
          <p>Accede al panel de gestión</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
              value={form.email}
              onChange={handleChange}
              placeholder="admin@aulearning.test"
            />

            {fieldErrors.email && (
              <div className="invalid-feedback">
                {fieldErrors.email[0]}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
              value={form.password}
              onChange={handleChange}
              placeholder="********"
            />

            {fieldErrors.password && (
              <div className="invalid-feedback">
                {fieldErrors.password[0]}
              </div>
            )}
          </div>

          <button className="btn btn-primary w-100" type="submit">
            <i className="bi bi-box-arrow-in-right me-2" />
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}