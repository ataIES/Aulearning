import { Link } from 'react-router-dom';

import LearningPanel from '../../../components/learning/LearningPanel';
import QuickAction from '../../../components/learning/QuickAction';

import { useAuth } from '../../../hooks/useAuth';
import { Helmet } from 'react-helmet-async';

export default function StudentProfilePage() {
  const { user } = useAuth();

  const initial = user?.name?.charAt(0)?.toUpperCase() ?? 'U';

  return (
    <>
      <Helmet>
        <title>Mi Perfil</title>
      </Helmet>
      <div className="learning-dashboard">
        <section className="learning-profile-hero">
          <div className="learning-profile-avatar">
            {initial}
          </div>

          <div>
            <span className="learning-kicker">Perfil alumno</span>

            <h2>
              {user?.name ?? 'Alumno'} {user?.last_name ?? ''}
            </h2>

            <p>{user?.email}</p>
          </div>
        </section>

        <div className="row g-4">
          <div className="col-xl-7">
            <LearningPanel
              title="Información personal"
              subtitle="Datos básicos de tu cuenta de alumno."
            >
              <div className="learning-profile-info">
                <div>
                  <span>Nombre</span>
                  <strong>{user?.name ?? '-'}</strong>
                </div>

                <div>
                  <span>Apellidos</span>
                  <strong>{user?.last_name ?? '-'}</strong>
                </div>

                <div>
                  <span>Correo electrónico</span>
                  <strong>{user?.email ?? '-'}</strong>
                </div>

                <div>
                  <span>Rol</span>
                  <strong>Alumno</strong>
                </div>
              </div>
            </LearningPanel>
          </div>

          <div className="col-xl-5">
            <LearningPanel
              title="Accesos rápidos"
              subtitle="Accede rápidamente a tus zonas principales."
            >
              <div className="learning-actions">
                <QuickAction
                  to="/student/dashboard"
                  icon="bi-speedometer2"
                  label="Ir al dashboard"
                />

                <QuickAction
                  to="/student/courses"
                  icon="bi-journal-bookmark-fill"
                  label="Mis cursos"
                />

                <QuickAction
                  to="/student/tasks"
                  icon="bi-list-task"
                  label="Mis tareas"
                />

                <QuickAction
                  to="/student/grades"
                  icon="bi-award-fill"
                  label="Mis calificaciones"
                />
              </div>
            </LearningPanel>
          </div>
        </div>
      </div>
    </>
  );
}