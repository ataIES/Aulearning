import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ErrorModal from '../components/common/ErrorModal';
import Loader from '../components/common/Loader';

import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';

import AdminLayout from '../layouts/admin/AdminLayout';
import LearningLayout from '../layouts/learning/LearningLayout';

import LoginPage from '../pages/auth/LoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import TeacherDashboardPage from '../pages/teacher/TeacherDashboardPage';
import StudentDashboardPage from '../pages/student/StudentDashboardPage';

import { getHomeByRole } from '../utils/redirectByRole';

import AdminRoute from './AdminRoute';
import PrivateRoute from './PrivateRoute';
import StudentRoute from './StudentRoute';
import TeacherRoute from './TeacherRoute';
import AdminUsersPage from '../pages/admin/users/AdminUsersPage';

function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={getHomeByRole(user)} replace />;
}

export default function AppRouter() {
  const { loading, errorModal, closeError } = useUI();

  return (
    <BrowserRouter>
      {loading && <Loader />}

      <ErrorModal
        show={errorModal.show}
        title={errorModal.title}
        message={errorModal.message}
        onClose={closeError}
      />

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<RootRedirect />} />

          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </Route>
          </Route>

          <Route element={<TeacherRoute />}>
            <Route element={<LearningLayout />}>
              <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
            </Route>
          </Route>

          <Route element={<StudentRoute />}>
            <Route element={<LearningLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboardPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}