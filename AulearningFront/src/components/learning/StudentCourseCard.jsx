import { Link } from 'react-router-dom';

export default function StudentCourseCard({ course, to }) {
  return (
    <Link to={to} className="teacher-course-card">
      <div className="teacher-course-icon">
        <i className="bi bi-journal-bookmark-fill" />
      </div>

      <div>
        <h5>{course.name}</h5>

        <p>
          {course.teacher
            ? `${course.teacher.name ?? ''} ${course.teacher.last_name ?? ''}`
            : 'Profesor no asignado'}
        </p>

        <div className="teacher-course-meta">
          <span>
            <i className="bi bi-list-task" />
            {course.tasks_count ?? 0} tareas
          </span>

          <span>
            <i className="bi bi-clock-history" />
            {course.pending_tasks_count ?? 0} pendientes
          </span>
        </div>
      </div>
    </Link>
  );
}