import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, Receipt, User, Zap } from 'lucide-react';
import { authStore } from '../../store/authStore';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Loans', path: '/loans', icon: Wallet },
  { name: 'Payments', path: '/payments', icon: Receipt },
  { name: 'Profile', path: '/profile', icon: User },
];

export const Sidebar = () => {
  const user = authStore.getState().user;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AS';

  return (
    <aside style={{ display: 'none', width: '14rem', flexShrink: 0 }} className="sidebar-desktop">
      <div style={{ position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '2.25rem', height: '2.25rem', borderRadius: '0.75rem',
            background: 'var(--gradient-success)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Zap size={15} color="var(--success-foreground)" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Nova Finance</span>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {NAV_ITEMS.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                padding: '0.625rem 0.875rem',
                borderRadius: '0.75rem',
                fontSize: '0.875rem', fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
                background: isActive ? 'var(--accent)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                position: 'relative'
              })}
              onMouseEnter={e => {
                const isActive = e.currentTarget.style.background !== 'transparent';
                if (!isActive) {
                  e.currentTarget.style.background = 'oklch(from var(--accent) l c h / 0.6)';
                  e.currentTarget.style.color = 'var(--foreground)';
                }
              }}
              onMouseLeave={e => {
                const link = e.currentTarget;
                const isActive = link.classList.contains('active') || link.getAttribute('aria-current') === 'page';
                if (!isActive) {
                  link.style.background = 'transparent';
                  link.style.color = 'var(--muted-foreground)';
                }
              }}
            >
              <Icon size={16} />
              {name}
            </NavLink>
          ))}
        </nav>

        {/* User Profile mini card */}
        <div style={{
          marginTop: 'auto', paddingTop: '1.25rem',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '0.625rem'
        }}>
          <div style={{
            width: '2rem', height: '2rem', borderRadius: '0.5rem',
            background: 'var(--gradient-success)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.6875rem', fontWeight: 700, color: 'var(--success-foreground)'
          }}>
            {initials}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Aarav Shah'}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)' }}>
              {user?.customerId || 'NV-48211'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
