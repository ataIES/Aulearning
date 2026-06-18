import { Link } from 'react-router-dom';

import LearningPanel from '../../../components/learning/LearningPanel';
import QuickAction from '../../../components/learning/QuickAction';

import { useAuth } from '../../../hooks/useAuth';

export default function TeacherProfilePage() {
  const { user } = useAuth();

  const initial = user?.name?.charAt(0)?.toUpperCase() ?? 'U';

  return (
    <div className="learning-dashboard">
      <section className="learning-profile-hero">
        <div className="learning-profile-avatar">
          {initial}
        </div>

        <div>
          <span className="learning-kicker">Perfil docente</span>

          <h2>
            {user?.name ?? 'Profesor'} {user?.last_name ?? ''}
          </h2>

          <p>{user?.email}</p>
        </div>
      </section>

      <div className="row g-4">
        <div className="col-xl-7">
          <LearningPanel
            title="Información personal"
            subtitle="Datos básicos de tu cuenta docente."
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
                <strong>Profesor</strong>
              </div>
            </div>
          </LearningPanel>
        </div>

        <div className="col-xl-5">
          <LearningPanel
            title="Accesos rápidos"
            subtitle="Vuelve rápidamente a tus zonas principales."
          >
            <div className="learning-actions">
              <QuickAction
                to="/teacher/dashboard"
                icon="bi-speedometer2"
                label="Ir al dashboard"
              />

              <QuickAction
                to="/teacher/courses"
                icon="bi-journal-bookmark-fill"
                label="Mis cursos"
              />

              <QuickAction
                to="/teacher/students"
                icon="bi-people-fill"
                label="Mis alumnos"
              />
            </div>
          </LearningPanel>
        </div>

      </div>
    </div>
  );
}