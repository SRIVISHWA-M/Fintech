import React from 'react';

export const Loader = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div className={`flex items-center justify-center py-6 ${className}`}>
      <div 
        className={`animate-spin rounded-full border-t-transparent border-success ${sizeClasses[size] || sizeClasses.md}`}
      />
    </div>
  );
};

export default Loader;
