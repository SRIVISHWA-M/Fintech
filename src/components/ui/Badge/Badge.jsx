import React from 'react';

export const Badge = ({ 
  children, 
  variant = 'default', 
  className = '',
  icon: Icon
}) => {
  const variantClasses = {
    default: 'bg-accent text-secondary',
    success: 'bg-success/15 text-success',
    danger: 'bg-destructive/15 text-destructive',
    info: 'bg-primary/10 text-primary'
  };

  const baseStyle = 'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium leading-none';

  return (
    <span className={`${baseStyle} ${variantClasses[variant] || variantClasses.default} ${className}`}>
      {Icon && <Icon className="h-3 w-3 shrink-0" />}
      {children}
    </span>
  );
};

export default Badge;
