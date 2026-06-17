export default function LearningPanel({
  title,
  subtitle,
  action,
  children,
}) {
  return (
    <section className="learning-panel">
      <div className="learning-panel-header">
        <div>
          <h4>{title}</h4>
          {subtitle && <p>{subtitle}</p>}
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}