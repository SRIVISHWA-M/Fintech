import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  onClick,
  ...props 
}) => {
  // Map variant to styling classes
  const variantClasses = {
    primary: 'bg-foreground text-background font-semibold hover:opacity-90',
    secondary: 'bg-accent text-foreground hover:bg-accent/80',
    success: 'bg-success text-success-foreground font-semibold hover:opacity-90 shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5',
    destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
    outline: 'border border-border text-muted-foreground hover:text-foreground'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm font-medium',
    lg: 'px-6 py-3 text-base'
  };

  const baseStyle = 'inline-flex items-center justify-center gap-2 rounded-full cursor-pointer transition-colors transition-transform active:scale-95 disabled:opacity-60 disabled:hover:translate-y-0 disabled:active:scale-100 disabled:cursor-not-allowed';

  return (
    <button
      className={`${baseStyle} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
