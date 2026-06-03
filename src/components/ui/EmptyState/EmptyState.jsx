import React from 'react';

export const EmptyState = ({ 
  title = 'No records found', 
  description = 'There is currently no data to display here.', 
  icon: Icon,
  className = '' 
}) => {
  return (
    <div className={`border-t border-border px-5 py-10 text-center sm:px-6 ${className}`}>
      {Icon && (
        <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-accent text-muted-foreground mb-3">
          <Icon className="h-4 w-4" />
        </div>
      )}
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
};

export default EmptyState;
