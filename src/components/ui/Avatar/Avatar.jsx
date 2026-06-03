import React from 'react';

export const Avatar = ({ 
  initials = 'A', 
  src = null, 
  size = 'md', 
  className = '', 
  badge = null 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-2xl'
  };

  const badgeSizeClasses = {
    sm: 'h-2 w-2 -bottom-0.5 -right-0.5',
    md: 'h-3 w-3 -bottom-0.5 -right-0.5',
    lg: 'h-5 w-5 -bottom-1 -right-1 border-2 border-card'
  };

  return (
    <div className={`relative shrink-0 ${className}`}>
      <div 
        className={`grid place-items-center rounded-2xl bg-[var(--gradient-success)] font-semibold text-success-foreground ${sizeClasses[size] || sizeClasses.md}`}
      >
        {src ? <img src={src} alt="avatar" className="h-full w-full object-cover rounded-2xl" /> : initials}
      </div>
      {badge && (
        <span 
          className={`absolute grid place-items-center rounded-full bg-success text-success-foreground ${badgeSizeClasses[size] || badgeSizeClasses.md}`}
        >
          {badge}
        </span>
      )}
    </div>
  );
};

export default Avatar;
