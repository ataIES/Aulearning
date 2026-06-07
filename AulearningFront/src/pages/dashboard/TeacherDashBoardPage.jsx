export default function TeacherDashBoardPage() {
  return (
    <div>
      <div className="page-title">
        <h3>Dashboard profesor</h3>
        <p>Gestiona tus cursos, tareas y alumnos</p>
      </div>

      <div className="row g-4">
        <DashboardCard icon="bi-journal-bookmark" title="Mis cursos" text="Cursos que impartes actualmente" />
        <DashboardCard icon="bi-list-task" title="Tareas" text="Crea y corrige actividades" />
        <DashboardCard icon="bi-award" title="Calificaciones" text="Gestiona notas de tus alumnos" />
        <DashboardCard icon="bi-chat-dots" title="Mensajes" text="Comunicación con estudiantes" />
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