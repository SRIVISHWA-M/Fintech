import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  className = '' 
}) => {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" 
        onClick={onClose} 
      />

      {/* Modal Dialog Content */}
      <div 
        className={`relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border p-6 shadow-xl animate-in fade-in-0 zoom-in-95 duration-200 ${className}`}
        style={{ background: 'var(--gradient-card)' }}
      >
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
          <button 
            className="grid h-8 w-8 place-items-center rounded-full border border-border bg-accent text-muted-foreground hover:text-foreground transition-colors"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="text-sm text-foreground">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
