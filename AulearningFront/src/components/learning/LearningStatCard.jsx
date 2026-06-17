export default function LearningStatCard({
  icon,
  value,
  label,
  variant = 'blue',
}) {
  return (
    <div className={`learning-stat-card ${variant}`}>
      <i className={`bi ${icon}`} />

      <div>
        <h3>{value ?? 0}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
}