import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { useAuth } from '../../hooks/useAuth';

import '../../styles/login.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [remember, setRemember] = useState(false);
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

      <main className="login-page">
        <section className="login-card">

          {/* ZONA IZQUIERDA */}
          <div className="login-brand-panel">

            <div className="login-brand-content">

              <div className="login-logo-container">
                <img
                  src="/branding/aulearning-logo.png"
                  alt="Aulearning"
                  className="login-logo"
                />
              </div>

              <h1 className="login-brand-title">
                Aulearning
              </h1>

              <p className="login-brand-description">
                Plataforma educativa para gestionar cursos, tareas,
                entregas y comunicación académica.
              </p>

              <div className="login-features">

                <div className="login-feature">
                  <span className="login-feature-icon">
                    <i className="bi bi-check-lg" />
                  </span>

                  <span>Gestión académica centralizada</span>
                </div>

                <div className="login-feature">
                  <span className="login-feature-icon">
                    <i className="bi bi-check-lg" />
                  </span>

                  <span>Acceso personalizado por rol</span>
                </div>

                <div className="login-feature">
                  <span className="login-feature-icon">
                    <i className="bi bi-check-lg" />
                  </span>

                  <span>Entorno seguro y responsive</span>
                </div>

              </div>
            </div>

          </div>

          {/* ZONA DERECHA */}
          <div className="login-form-panel">

            <div className="login-form-container">

              <div className="login-form-header">
                <h2>Iniciar sesión</h2>

                <p>
                  Accede a tu panel de Aulearning
                </p>
              </div>

              {error && (
                <div className="login-error">
                  <i className="bi bi-exclamation-circle-fill" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* EMAIL */}
                <div className="login-form-group">
                  <label htmlFor="email">
                    Correo electrónico
                  </label>

                  <div className="login-input-wrapper">
                    <i className="bi bi-envelope login-input-icon" />

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

                {/* PASSWORD */}
                <div className="login-form-group">
                  <label htmlFor="password">
                    Contraseña
                  </label>

                  <div className="login-input-wrapper">
                    <i className="bi bi-lock login-input-icon" />

                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* RECUÉRDAME */}
                <div className="login-options">
                  <label className="login-remember">
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

                {/* BOTÓN */}
                <button
                  type="submit"
                  className="login-submit-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        aria-hidden="true"
                      />

                      <span>Entrando...</span>
                    </>
                  ) : (
                    <>
                      <span>Entrar</span>
                      <i className="bi bi-arrow-right" />
                    </>
                  )}
                </button>

              </form>

            </div>

          </div>

        </section>
      </main>
    </>
  );
}