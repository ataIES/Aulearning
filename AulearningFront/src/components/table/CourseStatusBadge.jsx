export default function CourseStatusBadge({
  startDate,
  endDate,
}) {

  const today = new Date();

  const start = new Date(startDate);
  const end = new Date(endDate);

  let label = '';
  let variant = '';
  let icon = '';

  if (today < start) {

    label = 'Próximamente';
    variant = 'primary';
    icon = 'bi-clock-history';

  } else if (today > end) {

    label = 'Finalizado';
    variant = 'secondary';
    icon = 'bi-check-circle';

  } else {

    label = 'En curso';
    variant = 'success';
    icon = 'bi-play-circle';

  }

  return (

    <div className={`course-status ${variant}`}>

      <i className={`bi ${icon}`}></i>

      {label}

    </div>

  );

}