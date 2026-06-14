import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';

export default function StudentRoute() {
  const { user, checkingAuth, isAuthenticated } = useAuth();

  if (checkingAuth) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return user?.type === 'student'
    ? <Outlet />
    : <Navigate to="/login" replace />;
}