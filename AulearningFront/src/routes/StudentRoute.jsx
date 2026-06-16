import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { getHomeByRole } from '../utils/redirectByRole';

export default function StudentRoute() {
  const { user, checkingAuth, isAuthenticated } = useAuth();

  if (checkingAuth) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return user?.type === 'student'
    ? <Outlet />
    : <Navigate to={getHomeByRole(user)} replace />;
}