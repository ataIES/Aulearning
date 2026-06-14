import SidebarNavigation from '../../components/common/SidebarNavigation';
import UserProfileCard from '../../components/common/UserProfileCard';
import { useAuth } from '../../hooks/useAuth';
import {
  studentNavigation,
  teacherNavigation,
} from '../../navigation';

export default function LearningSidebar({ open, onClose }) {
  const { user } = useAuth();

  const sections =
    user?.type === 'teacher'
      ? teacherNavigation
      : studentNavigation;

  return (
    <>
      <div
        className={`sidebar-backdrop ${open ? 'show' : ''}`}
        onClick={onClose}
      />

      <aside className={`learning-sidebar ${open ? 'show' : ''}`}>
        <UserProfileCard />

        <SidebarNavigation
          sections={sections}
          linkClassName="learning-link"
          onClose={onClose}
        />
      </aside>
    </>
  );
}