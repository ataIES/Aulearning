import { NavLink } from 'react-router-dom';

export default function SidebarNavigation({
  sections = [],
  linkClassName = '',
  onClose,
}) {
  return (
    <nav className="sidebar-navigation">
      {sections.map((section) => (
        <div className="sidebar-section" key={section.title}>
          <span className="sidebar-section-title">
            {section.title}
          </span>

          <div className="sidebar-section-items">
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={linkClassName}
                onClick={onClose}
              >
                <i className={`bi ${item.icon}`} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}