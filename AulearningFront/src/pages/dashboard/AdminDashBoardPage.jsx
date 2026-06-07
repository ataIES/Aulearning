import { useEffect, useState } from 'react';
import DashboardService from '../../services/DashboardService';
import { useUI } from '../../hooks/useUI';

export default function AdminDashboardPage() {
  const { setLoading, showError } = useUI();
  const [dashboard, setDashboard] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await DashboardService.getAdminDashboard();

      setDashboard(response.data);
    } catch {
      showError('No se pudo cargar el dashboard de administrador.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const cards = [
    ['Usuarios', 'users', 'bi-people'],
    ['Cursos', 'courses', 'bi-journal-bookmark'],
    ['Tareas', 'tasks', 'bi-list-task'],
    ['Archivos', 'files', 'bi-folder2-open'],
    ['Notas', 'grades', 'bi-award'],
    ['Notificaciones', 'notifications', 'bi-bell'],
    ['Chats', 'chat_groups', 'bi-chat-dots'],
    ['Mensajes', 'messages', 'bi-envelope'],
  ];

  const getItemLabel = (item) => {
    return (
      item.name ||
      item.title ||
      item.email ||
      item.content ||
      `Registro #${item.id}`
    );
  };

  if (!dashboard) {
    return null;
  }

  return (
    <div>
      <div className="page-title">
        <h3>Dashboard administrador</h3>
        <p>
          Últimas actualizaciones de los últimos 3 días
        </p>
      </div>

      <div className="row g-4 mb-4">
        {cards.map(([title, key, icon]) => (
          <div className="col-md-3" key={key}>
            <div className="dashboard-card">
              <i className={`bi ${icon}`} />
              <h5>{title}</h5>
              <h2>{dashboard.summary[key] ?? 0}</h2>
              <p>Nuevos registros</p>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {cards.map(([title, key]) => (
          <div className="col-md-6" key={key}>
            <div className="card p-3 h-100">
              <h5 className="mb-3">
                Últimos {title}
              </h5>

              {dashboard.latest[key]?.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {dashboard.latest[key].map((item) => (
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center"
                      key={item.id}
                    >
                      <span className="text-truncate me-3">
                        {getItemLabel(item)}
                      </span>

                      <small className="text-muted">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : ''}
                      </small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted mb-0">
                  Sin actualizaciones recientes.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}