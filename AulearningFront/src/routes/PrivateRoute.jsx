import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

export default function PrivateRoute() {
  const { checkingAuth, isAuthenticated } = useAuth();

  if (checkingAuth) {
    return null;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}