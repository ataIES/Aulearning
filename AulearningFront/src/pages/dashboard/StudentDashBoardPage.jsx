export default function StudentDashBoardPage() {
  return (
    <div>
      <div className="page-title">
        <h3>Dashboard alumno</h3>
        <p>Consulta tus cursos, tareas y calificaciones</p>
      </div>

      <div className="row g-4">
        <DashboardCard icon="bi-journal-bookmark" title="Mis cursos" text="Cursos en los que estás inscrito" />
        <DashboardCard icon="bi-list-task" title="Tareas pendientes" text="Actividades por entregar" />
        <DashboardCard icon="bi-award" title="Mis notas" text="Consulta tus calificaciones" />
        <DashboardCard icon="bi-bell" title="Avisos" text="Notificaciones importantes" />
      </div>
    </div>
  );
}

function DashboardCard({ icon, title, text }) {
  return (
    <div className="col-md-3">
      <div className="dashboard-card">
        <i className={`bi ${icon}`} />
        <h5>{title}</h5>
        <p>{text}</p>
      </div>
    </div>
  );
}