import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ErrorModal from '../components/common/ErrorModal';

import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';

import AdminLayout from '../layouts/admin/AdminLayout';
import LearningLayout from '../layouts/learning/LearningLayout';

import LoginPage from '../pages/auth/LoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import TeacherDashboardPage from '../pages/teacher/TeacherDashboardPage';
import StudentDashboardPage from '../pages/student/StudentDashboardPage';

import AdminUsersPage from '../pages/admin/users/AdminUsersPage';
import AdminCoursesPage from '../pages/admin/courses/AdminCoursesPage';
import AdminCourseDetailPage from '../pages/admin/courses/AdminCourseDetailPage';
import AdminRolesPage from '../pages/admin/roles/AdminRolesPage';
import AdminCourseEnrollmentsPage from '../pages/admin/enrollments/AdminCourseEnrollmentsPage';
import AdminNotificationsPage from '../pages/admin/notifications/AdminNotificationsPage';
import AdminEnrollmentsPage from '../pages/admin/enrollments/AdminEnrollmentsPage';
import AdminFilesPage from '../pages/admin/files/AdminFilesPage';
import TeacherCoursesPage from '../pages/teacher/courses/TeacherCoursesPage';
import TeacherCourseDetailPage from '../pages/teacher/courses/TeacherCourseDetailPage';
import TeacherCourseTasksPage from '../pages/teacher/tasks/TeacherCourseTasksPage';

import { getHomeByRole } from '../utils/redirectByRole';

import AdminRoute from './AdminRoute';
import PrivateRoute from './PrivateRoute';
import StudentRoute from './StudentRoute';
import TeacherRoute from './TeacherRoute';

function RootRedirect() {
  const { user } = useAuth();

  return <Navigate to={getHomeByRole(user)} replace />;
}

export default function AppRouter() {
  const { errorModal, closeError } = useUI();

  return (
    <BrowserRouter>
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
              <Route path="/admin/courses" element={<AdminCoursesPage />} />
              <Route path="/admin/courses/:courseId" element={<AdminCourseDetailPage />} />
              <Route
                path="/admin/courses/:courseId/enrollments"
                element={<AdminCourseEnrollmentsPage />}
              />
              <Route path="/admin/roles" element={<AdminRolesPage />} />
              <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
              <Route path="/admin/enrollments" element={<AdminEnrollmentsPage />} />
              <Route path="/admin/files" element={<AdminFilesPage />} />
            </Route>
          </Route>

          <Route element={<TeacherRoute />}>
            <Route element={<LearningLayout />}>
              <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
              <Route path="/teacher/courses" element={<TeacherCoursesPage />} />
              <Route path="/teacher/courses/:courseId" element={<TeacherCourseDetailPage />} />
              <Route path="/teacher/courses/:courseId/tasks" element={<TeacherCourseTasksPage />} />
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