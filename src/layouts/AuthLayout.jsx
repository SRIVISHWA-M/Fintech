import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 rounded-2xl border border-border" style={{ background: 'var(--gradient-card)' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
