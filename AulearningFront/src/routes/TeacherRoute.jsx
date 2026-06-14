import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';

export default function TeacherRoute() {
  const { user, checkingAuth, isAuthenticated } = useAuth();

  if (checkingAuth) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return user?.type === 'teacher'
    ? <Outlet />
    : <Navigate to="/login" replace />;
}