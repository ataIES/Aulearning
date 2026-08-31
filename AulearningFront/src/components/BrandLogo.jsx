export default function BrandLogo({
  compact = false,
  className = '',
}) {
  return (
    <div className={`au-brand ${compact ? 'au-brand--compact' : ''} ${className}`}>
      <img
        src="/branding/aulearning-logo.png"
        alt="Aulearning"
        className="au-brand__image"
      />
    </div>
  );
}
