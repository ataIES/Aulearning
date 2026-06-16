import { Link } from 'react-router-dom';

import DashboardService from '../../services/DashboardService';
import useDashboard from '../../hooks/useDashboard';
import PageLoader from '../../components/common/PageLoader';

export default function AdminDashboardPage() {
  const dashboard = useDashboard(() => DashboardService.admin());

  if (!dashboard) {
    return (
      <PageLoader
        title="Cargando dashboard"
        message="Obteniendo las estadísticas principales..."
      />
    );
  }

  const cards = [
    {
      title: 'Usuarios',
      value: dashboard.summary?.users ?? 0,
      icon: 'bi-people',
      to: '/admin/users',
    },
    {
      title: 'Cursos',
      value: dashboard.summary?.courses ?? 0,
      icon: 'bi-journal-bookmark',
      to: '/admin/courses',
    },
    {
      title: 'Tareas',
      value: dashboard.summary?.tasks ?? 0,
      icon: 'bi-list-task',
      to: '/admin/tasks',
    },
    {
      title: 'Archivos',
      value: dashboard.summary?.files ?? 0,
      icon: 'bi-folder2-open',
      to: '/admin/files',
    },
  ];

  const latestGroups = [
    {
      title: 'Últimos usuarios',
      items: dashboard.latest?.users ?? [],
      to: '/admin/users',
    },
    {
      title: 'Últimos cursos',
      items: dashboard.latest?.courses ?? [],
      to: '/admin/courses',
    },
    {
      title: 'Últimas tareas',
      items: dashboard.latest?.tasks ?? [],
      to: '/admin/tasks',
    },
    {
      title: 'Últimos archivos',
      items: dashboard.latest?.files ?? [],
      to: '/admin/files',
    },
  ];

  const getItemLabel = (item) => {
    return item.name || item.title || item.email || `Registro #${item.id}`;
  };

  return (
    <div>
      <div className="admin-dashboard-header">
        <div>
          <h3>Dashboard administrador</h3>
          <p>Resumen de actividad de los últimos 3 días.</p>
        </div>

        <span className="admin-period-badge">
          Últimos 3 días
        </span>
      </div>

      <div className="row g-3 mb-4">
        {cards.map((card) => (
          <div className="col-xl-3 col-md-6" key={card.title}>
            <Link to={card.to} className="admin-stat-card">
              <div className="admin-stat-icon">
                <i className={`bi ${card.icon}`} />
              </div>

              <div>
                <h4>{card.value}</h4>
                <p>{card.title}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {latestGroups.map((group) => (
          <div className="col-xl-6" key={group.title}>
            <div className="admin-panel-card">
              <div className="admin-panel-header">
                <h5>{group.title}</h5>
                <Link to={group.to}>Ver todo</Link>
              </div>

              {group.items.length > 0 ? (
                <div className="admin-latest-list">
                  {group.items.map((item) => (
                    <div className="admin-latest-item" key={item.id}>
                      <div>
                        <strong>{getItemLabel(item)}</strong>
                        <small>
                          {item.created_at
                            ? new Date(item.created_at).toLocaleString()
                            : ''}
                        </small>
                      </div>

                      <span>#{item.id}</span>
                    </div>
                  ))}
                </div>
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