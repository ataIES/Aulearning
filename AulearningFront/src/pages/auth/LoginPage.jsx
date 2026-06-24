import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import LoginLoader from '../../components/common/LoginLoader';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import { getHomeByRole } from '../../utils/redirectByRole';
import { Helmet } from 'react-helmet-async';

export default function LoginPage() {
  const navigate = useNavigate();

  const { login, isAuthenticated, checkingAuth, user } = useAuth();
  const { showError } = useUI();

  const [loginLoading, setLoginLoading] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
  });

  if (checkingAuth) {
    return (
      <LoginLoader
        title="Comprobando sesión"
        message="Verificando si ya tienes una sesión activa..."
      />
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getHomeByRole(user)} replace />;
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const getErrorMessage = (error) => {
    const response = error.response?.data;

    if (response?.errors) {
      const firstKey = Object.keys(response.errors)[0];

      return response.errors[firstKey]?.[0] ?? 'Error de validación.';
    }

    return response?.message ?? 'No se pudo iniciar sesión.';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      setLoginLoading(true);

      const loggedUser = await login(
        {
          email: form.email,
          password: form.password,
        },
        form.remember
      );

      navigate(getHomeByRole(loggedUser), {
        replace: true,
      });
    } catch (error) {
      showError(getErrorMessage(error), 'No se pudo iniciar sesión');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <>
    <Helmet>
        <title>Iniciar sesión</title>
      </Helmet>
      {loginLoading && (
        <LoginLoader
          title="Iniciando sesión"
          message="Validando credenciales y preparando tu panel..."
        />
      )}

      <main className="login-page">
        <section className="login-card">
          <div className="login-info">
            <div className="login-logo">A</div>

            <h1>Aulearning</h1>

            <p>
              Plataforma educativa para gestionar cursos, tareas,
              entregas y comunicación académica.
            </p>

            <div className="login-points">
              <span>
                <i className="bi bi-check-circle-fill" />
                Gestión académica centralizada
              </span>

              <span>
                <i className="bi bi-check-circle-fill" />
                Acceso personalizado por rol
              </span>

              <span>
                <i className="bi bi-check-circle-fill" />
                Entorno seguro y responsive
              </span>
            </div>
          </div>

          <div className="login-form-area">
            <div className="login-form-title">
              <h2>Iniciar sesión</h2>
              <p>Accede a tu panel de Aulearning</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <fieldset disabled={loginLoading}>
                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>

                  <div className="input-icon">
                    <i className="bi bi-envelope" />

                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="tu@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Contraseña</label>

                  <div className="input-icon">
                    <i className="bi bi-lock" />

                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-check mb-4">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="form-check-input"
                    checked={form.remember}
                    onChange={handleChange}
                  />

                  <label className="form-check-label" htmlFor="remember">
                    Recuérdame
                  </label>
                </div>

                <button
                  className="btn btn-primary login-submit"
                  type="submit"
                >
                  Entrar
                  <i className="bi bi-arrow-right" />
                </button>
              </fieldset>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}