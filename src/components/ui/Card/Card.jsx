import React from 'react';

export const Card = ({ 
  children, 
  className = '', 
  gradient = true, 
  hoverEffect = false,
  onClick,
  ...props 
}) => {
  const baseStyle = 'relative overflow-hidden rounded-2xl border border-border p-5 shadow-[var(--shadow-card)]';
  const gradientStyle = gradient ? { background: 'var(--gradient-card)' } : {};
  const hoverStyle = hoverEffect ? 'transition-transform hover:-translate-y-0.5 cursor-pointer' : '';

  return (
    <div
      className={`${baseStyle} ${hoverStyle} ${className}`}
      style={gradientStyle}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
