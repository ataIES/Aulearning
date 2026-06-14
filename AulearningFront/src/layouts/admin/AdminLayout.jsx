import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-shell">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="admin-main">
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}