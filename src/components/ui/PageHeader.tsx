import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, children }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-foreground/5 mb-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-primary/80">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-sm md:text-base mt-2 font-medium max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap gap-3 w-full md:w-auto shrink-0">
          {children}
        </div>
      )}
    </div>
  );
};
