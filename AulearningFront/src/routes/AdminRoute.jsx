import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { getHomeByRole } from '../utils/redirectByRole';

export default function AdminRoute() {
  const { user, checkingAuth, isAuthenticated } = useAuth();

  if (checkingAuth) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return user?.type === 'admin'
    ? <Outlet />
    : <Navigate to={getHomeByRole(user)} replace />;
}