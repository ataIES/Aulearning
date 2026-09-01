import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';

import '../../styles/login.css';

export default function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();
  const { showError } = useUI();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const redirectByRole = (user) => {
    const role = (
      user?.role?.name ||
      user?.role_name ||
      user?.rol?.name ||
      user?.type ||
      ''
    )
      .toString()
      .trim()
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

    showError(
      'El usuario autenticado no tiene un rol válido para acceder a la aplicación.',
      'Rol no válido'
    );
  };

  const getErrorMessage = (error) => {
    const responseData = error?.response?.data;

    /*
     * Laravel ValidationException:
     *
     * {
     *   message: "...",
     *   errors: {
     *      email: ["..."],
     *      password: ["..."]
     *   }
     * }
     */
    if (responseData?.errors) {
      const messages = Object.values(responseData.errors)
        .flat()
        .filter(Boolean);

      if (messages.length > 0) {
        return messages.join(' ');
      }
    }

    if (responseData?.message) {
      return responseData.message;
    }

    if (!error?.response) {
      return 'No se ha podido conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.';
    }

    return 'Se ha producido un error al iniciar sesión.';
  };

  const getErrorTitle = (error) => {
    const status = error?.response?.status;

    if (status === 422) {
      return 'Error de validación';
    }

    if (status === 401) {
      return 'Credenciales incorrectas';
    }

    if (status === 403) {
      return 'Acceso no autorizado';
    }

    if (status >= 500) {
      return 'Error del servidor';
    }

    return 'Error al iniciar sesión';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = form.email.trim();
    const password = form.password;

    /*
     * Validación básica en frontend.
     */
    if (!email || !password) {
      showError(
        'Debes introducir el correo electrónico y la contraseña.',
        'Campos obligatorios'
      );

      return;
    }

    /*
     * El LoginRequest de Laravel exige mínimo 8 caracteres.
     */
    if (password.length < 8) {
      showError(
        'La contraseña debe tener al menos 8 caracteres.',
        'Error de validación'
      );

      return;
    }

    try {
      setLoading(true);

      /*
       * IMPORTANTE:
       * Tu LoginRequest de Laravel espera:
       *
       * email
       * password
       */
      const user = await login(
        {
          email,
          password,
        },
        remember
      );

      if (!user) {
        showError(
          'El servidor ha iniciado la sesión, pero no se ha recibido correctamente la información del usuario.',
          'Error de autenticación'
        );

        return;
      }

      redirectByRole(user);
    } catch (error) {

      showError(
        getErrorMessage(error),
        getErrorTitle(error)
      );
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

          {/* ============================
              PANEL IZQUIERDO
          ============================ */}

          <div className="login-brand-panel">
            <div className="login-brand-content">

              <div className="login-logo-container">
                <img
                  src="/branding/aulearning-logo.png"
                  alt="Logotipo de Aulearning"
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

                  <span>
                    Gestión académica centralizada
                  </span>
                </div>

                <div className="login-feature">
                  <span className="login-feature-icon">
                    <i className="bi bi-check-lg" />
                  </span>

                  <span>
                    Acceso personalizado por rol
                  </span>
                </div>

                <div className="login-feature">
                  <span className="login-feature-icon">
                    <i className="bi bi-check-lg" />
                  </span>

                  <span>
                    Entorno seguro y responsive
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* ============================
              PANEL DERECHO
          ============================ */}

          <div className="login-form-panel">
            <div className="login-form-container">

              <div className="login-form-header">
                <h2>Iniciar sesión</h2>

                <p>
                  Accede a tu panel de Aulearning
                </p>
              </div>

              <form onSubmit={handleSubmit}>

                {/* CORREO */}

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

                {/* CONTRASEÑA */}

                <div className="login-form-group">
                  <label htmlFor="password">
                    Contraseña
                  </label>

                  <div className="login-input-wrapper">

                    <i className="bi bi-lock login-input-icon" />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      disabled={loading}
                    />

                    <button
                      type="button"
                      className="login-password-toggle"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      disabled={loading}
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

                    <span>
                      Recuérdame
                    </span>

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

                      <span>
                        Iniciando sesión...
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        Entrar
                      </span>

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