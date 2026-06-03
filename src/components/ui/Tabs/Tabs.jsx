import React from 'react';

export const Tabs = ({ 
  tabs = [], 
  activeTab, 
  onChange, 
  className = '' 
}) => {
  return (
    <div className={`flex border-b border-border mb-4 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              isActive 
                ? 'border-success text-foreground' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
