import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { getHomeByRole } from '../utils/redirectByRole';

export default function TeacherRoute() {
  const { user, checkingAuth, isAuthenticated } = useAuth();

  if (checkingAuth) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return user?.type === 'teacher'
    ? <Outlet />
    : <Navigate to={getHomeByRole(user)} replace />;
}