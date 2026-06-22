import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import LearningHeader from '../../components/learning/LearningHeader';
import LearningSidebar from './LearningSidebar';

export default function LearningLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="learning-layout">
      <LearningSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="learning-main">
        <LearningHeader
          title="Dashboard"
          subtitle="Bienvenido a tu espacio académico"
          onToggleSidebar={() => setSidebarOpen(true)}
        />

        <section className="learning-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}