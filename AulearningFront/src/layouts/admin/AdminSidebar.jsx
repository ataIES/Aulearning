import SidebarNavigation from '../../components/common/SidebarNavigation';
import UserProfileCard from '../../components/common/UserProfileCard';
import { adminNavigation } from '../../navigation';

export default function AdminSidebar({ open, onClose }) {
  return (
    <>
      <div
        className={`sidebar-backdrop ${open ? 'show' : ''}`}
        onClick={onClose}
      />

      <aside className={`admin-sidebar ${open ? 'show' : ''}`}>
        <UserProfileCard />

        <SidebarNavigation
          sections={adminNavigation}
          linkClassName="admin-link"
          onClose={onClose}
        />
      </aside>
    </>
  );
}