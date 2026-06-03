import React from 'react';

export const Table = ({ children, className = '', ...props }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full text-sm border-collapse ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children, className = '', ...props }) => {
  return (
    <thead className={`border-y border-border bg-background/30 text-xs uppercase tracking-wider text-muted-foreground ${className}`} {...props}>
      {children}
    </thead>
  );
};

export const TableBody = ({ children, className = '', ...props }) => {
  return (
    <tbody className={`divide-y divide-border ${className}`} {...props}>
      {children}
    </tbody>
  );
};

export const TableRow = ({ children, className = '', ...props }) => {
  return (
    <tr className={`border-b border-border last:border-0 hover:bg-accent/10 transition-colors ${className}`} {...props}>
      {children}
    </tr>
  );
};

export const TableCell = ({ children, className = '', align = 'left', isHeader = false, ...props }) => {
  const Tag = isHeader ? 'th' : 'td';
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const paddingStyle = isHeader ? 'px-6 py-3 font-medium' : 'px-6 py-4';

  return (
    <Tag className={`${paddingStyle} ${alignClasses[align]} ${className}`} {...props}>
      {children}
    </Tag>
  );
};

export default Table;
