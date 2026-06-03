import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Breadcrumb from './Breadcrumb';

export const PageTitle = ({ 
  title, 
  breadcrumb = [], 
  backPath = '/' 
}) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center gap-3">
      <button 
        aria-label="Back" 
        onClick={() => navigate(backPath)}
        className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <div>
        <Breadcrumb items={breadcrumb} />
        <h1 className="text-lg font-semibold leading-tight sm:text-2xl md:text-3xl text-foreground">
          {title}
        </h1>
      </div>
    </header>
  );
};

export default PageTitle;
