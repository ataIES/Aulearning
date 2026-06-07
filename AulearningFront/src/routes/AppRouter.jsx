import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AlertModal from '../components/common/AlertModal';
import Loader from '../components/common/Loader';
import AppLayout from '../components/layouts/AppLayout';
import { useUI } from '../hooks/useUI';
import LoginPage from '../pages/auth/LoginPage';
import PrivateRoute from './PrivateRoute';
import DashBoardRouter from '../pages/dashboard/DashBoardRoute';

export default function AppRouter() {
  const { loading, alert, closeAlert } = useUI();

  return (
    <BrowserRouter>
      {loading && <Loader />}
      <AlertModal alert={alert} onClose={closeAlert} />

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashBoardRouter />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
