import React from 'react';

const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {children}
    </div>
  );
};

const CardTitle = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return (
    <h4 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h4>
  );
};

const CardContent = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardContent };
