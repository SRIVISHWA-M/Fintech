import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, ArrowUpRight, Receipt, User } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur lg:hidden">
      <div 
        className="mx-auto grid max-w-md grid-cols-5 items-end px-3 pt-2" 
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}
      >
        {/* Home */}
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 py-1 text-[10px] ${
              isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          Home
        </NavLink>

        {/* Loans */}
        <NavLink 
          to="/loans" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 py-1 text-[10px] ${
              isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'
            }`
          }
        >
          <Wallet className="h-5 w-5" />
          Loans
        </NavLink>

        {/* Floating Pay EMI Button */}
        <NavLink 
          to="/loans" 
          aria-label="Pay" 
          className="mx-auto -mt-6 grid h-12 w-12 place-items-center rounded-full bg-success text-success-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-95"
        >
          <ArrowUpRight className="h-5 w-5" />
        </NavLink>

        {/* History */}
        <NavLink 
          to="/payments" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 py-1 text-[10px] ${
              isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'
            }`
          }
        >
          <Receipt className="h-5 w-5" />
          History
        </NavLink>

        {/* Profile */}
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 py-1 text-[10px] ${
              isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'
            }`
          }
        >
          <User className="h-5 w-5" />
          Profile
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
