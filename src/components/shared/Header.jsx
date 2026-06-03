import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../ui/Modal/Modal';

export const Header = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Set page headers based on route
  const getPageHeaders = () => {
    switch (location.pathname) {
      case '/loans':
        return { subtitle: 'Loans', title: 'Active loan & pay' };
      case '/payments':
        return { subtitle: 'Payments', title: 'Calendar & history' };
      case '/profile':
        return { subtitle: 'Account', title: 'Profile' };
      case '/statements':
        return { subtitle: 'Statements', title: 'Statements & logs' };
      case '/support':
        return { subtitle: 'Support', title: 'Help & support' };
      default:
        return { subtitle: `Welcome back, ${user?.name.split(' ')[0]}`, title: 'Your loan, at a glance' };
    }
  };

  const headers = getPageHeaders();

  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      {/* Mobile Top Welcome (Hidden on desktop) */}
      <div className="flex items-center gap-3 lg:hidden">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--gradient-success)] text-success-foreground">
          <TrendingUp className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">Welcome back</p>
          <h1 className="text-base font-semibold leading-tight text-foreground">{user?.name}</h1>
        </div>
      </div>

      {/* Desktop Top Welcome (Hidden on mobile) */}
      <div className="hidden lg:block">
        <p className="text-sm text-muted-foreground">{headers.subtitle}</p>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl text-foreground">
          {headers.title}
        </h1>
      </div>

      {/* Actions (Notifications and CTA) */}
      <div className="flex items-center gap-2">
        <button 
          aria-label="Notifications" 
          onClick={() => setIsNotifOpen(true)}
          className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-success"></span>
        </button>

        {location.pathname !== '/loans' && (
          <Link 
            to="/loans" 
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-success px-4 py-2 text-sm font-medium text-success-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
          >
            Pay EMI 
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Notifications Modal */}
      <Modal 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
        title="Notifications"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 border-b border-border pb-3">
            <span className="h-2 w-2 rounded-full bg-success mt-1.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Upcoming Auto-Debit Due</p>
              <p className="text-xs text-muted-foreground mt-0.5">Your monthly EMI of $1,240 is scheduled for auto-debit on June 5, 2026.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 border-b border-border pb-3 opacity-60">
            <span className="h-2 w-2 rounded-full bg-muted mt-1.5 shrink-0" />
            <div>
              <p className="font-medium text-sm">EMI Payment Successful</p>
              <p className="text-xs text-muted-foreground mt-0.5">EMI installment #009 of $1,240 was paid successfully on May 05, 2026.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 opacity-60">
            <span className="h-2 w-2 rounded-full bg-muted mt-1.5 shrink-0" />
            <div>
              <p className="font-medium text-sm">KYC Approved</p>
              <p className="text-xs text-muted-foreground mt-0.5">Your identity verification has been completed successfully.</p>
            </div>
          </div>
        </div>
      </Modal>
    </header>
  );
};

export default Header;
