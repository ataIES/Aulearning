import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import LearningHeader from './LearningHeader';
import LearningSidebar from './LearningSidebar';

export default function LearningLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="learning-shell">
      <LearningSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="learning-main">
        <LearningHeader
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <section className="learning-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}