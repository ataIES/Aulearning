import { Link } from 'react-router-dom';

export default function CourseCard({
  course,
  to,
}) {
  return (
    <Link to={to} className="teacher-course-card">
      <div className="teacher-course-icon">
        <i className="bi bi-journal-bookmark-fill" />
      </div>

      <div>
        <h5>{course.name}</h5>
        <p>{course.code ?? `CUR-${course.id}`}</p>

        <div className="teacher-course-meta">
          <span>
            <i className="bi bi-people" />
            {course.enrollments_count ?? 0} alumnos
          </span>

          <span>
            <i className="bi bi-list-task" />
            {course.tasks_count ?? 0} tareas
          </span>
        </div>
      </div>
    </Link>
  );
}