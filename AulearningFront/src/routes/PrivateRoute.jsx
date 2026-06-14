import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';

export default function PrivateRoute() {
  const { checkingAuth, isAuthenticated } = useAuth();

  if (checkingAuth) {
    return <Loader />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}