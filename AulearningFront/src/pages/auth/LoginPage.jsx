import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { useAuth } from '../../hooks/useAuth';

import "../../styles/login.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError('');
    }
  };

  const redirectByRole = (user) => {
    const role = (
      user?.role?.name ||
      user?.role_name ||
      user?.type ||
      ''
    )
      .toString()
      .toLowerCase();

    if (['admin', 'administrador'].includes(role)) {
      navigate('/admin/dashboard', { replace: true });
      return;
    }

    if (['teacher', 'profesor'].includes(role)) {
      navigate('/teacher/dashboard', { replace: true });
      return;
    }

    if (['student', 'alumno'].includes(role)) {
      navigate('/student/dashboard', { replace: true });
      return;
    }

    navigate('/', { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError('Introduce el correo electrónico y la contraseña.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const user = await login(
        {
          correo: form.email.trim(),
          contrasenia: form.password,
        },
        remember
      );

      redirectByRole(user);
    } catch (err) {
      console.error('Error de login:', err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.correo?.[0] ||
        'Correo o contraseña incorrectos.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Iniciar sesión | Aulearning</title>
      </Helmet>

      <main className="au-login-page">
        <section className="au-login-card">

          {/* PARTE IZQUIERDA */}
          <div className="au-login-brand">
            <div className="au-login-logo-box">
              <img
                src="/branding/aulearning-logo.png"
                alt="Aulearning"
                className="au-login-logo"
              />
            </div>

            <div className="au-login-brand-content">
              <h1>Aulearning</h1>

              <p>
                Plataforma educativa para gestionar cursos, tareas,
                entregas y comunicación académica.
              </p>

              <ul className="au-login-features">
                <li>
                  <span className="au-feature-icon">
                    <i className="bi bi-check-lg" />
                  </span>
                  Gestión académica centralizada
                </li>

                <li>
                  <span className="au-feature-icon">
                    <i className="bi bi-check-lg" />
                  </span>
                  Acceso personalizado por rol
                </li>

                <li>
                  <span className="au-feature-icon">
                    <i className="bi bi-check-lg" />
                  </span>
                  Entorno seguro y responsive
                </li>
              </ul>
            </div>
          </div>

          {/* PARTE DERECHA */}
          <div className="au-login-form-section">
            <div className="au-login-form-container">
              <div className="au-login-heading">
                <h2>Iniciar sesión</h2>
                <p>Accede a tu panel de Aulearning</p>
              </div>

              {error && (
                <div className="au-login-error" role="alert">
                  <i className="bi bi-exclamation-circle-fill" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="au-form-group">
                  <label htmlFor="email">
                    Correo electrónico
                  </label>

                  <div className="au-input-wrapper">
                    <i className="bi bi-envelope au-input-icon" />

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      autoComplete="email"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="au-form-group">
                  <label htmlFor="password">
                    Contraseña
                  </label>

                  <div className="au-input-wrapper">
                    <i className="bi bi-lock au-input-icon" />

                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Introduce tu contraseña"
                      autoComplete="current-password"
                      disabled={loading}
                    />

                    <button
                      type="button"
                      className="au-password-toggle"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      aria-label={
                        showPassword
                          ? 'Ocultar contraseña'
                          : 'Mostrar contraseña'
                      }
                    >
                      <i
                        className={`bi ${
                          showPassword
                            ? 'bi-eye-slash'
                            : 'bi-eye'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="au-login-options">
                  <label className="au-remember">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(event) =>
                        setRemember(event.target.checked)
                      }
                      disabled={loading}
                    />

                    <span>Recuérdame</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="au-login-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        aria-hidden="true"
                      />
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar
                      <i className="bi bi-arrow-right" />
                    </>
                  )}
                </button>
              </form>

              <div className="au-login-footer">
                <span>Aulearning</span>
                <span className="au-login-footer-dot">•</span>
                <span>Plataforma educativa</span>
              </div>
            </div>
          </div>

        </section>
      </main>
    </>
  );
}