import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import Header from '../components/shared/Header';
import Navbar from '../components/shared/Navbar';

export const DashboardLayout = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)' }}>
      <div style={{
        margin: '0 auto',
        maxWidth: '80rem',
        display: 'flex',
        gap: '2rem',
        padding: '1.25rem 1rem 7rem',
      }} className="dashboard-container">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Header />
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <Navbar />
    </div>
  );
};

export default DashboardLayout;
