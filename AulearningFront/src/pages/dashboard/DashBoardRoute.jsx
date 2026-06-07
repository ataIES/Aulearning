import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AdminDashboardPage from './AdminDashboardPage';
import TeacherDashBoardPage from './TeacherDashBoardPage';
import StudentDashBoardPage from './StudentDashBoardPage';

export default function DashBoardRouter() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  if (user.type === 'admin') {
    return <AdminDashboardPage />;
  }

  if (user.type === 'teacher') {
    return <TeacherDashboardPage />;
  }

  if (user.type === 'student') {
    return <StudentDashboardPage />;
  }

  return <Navigate to="/login" replace />;
}