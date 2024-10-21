import React from 'react';

export const Tabs = ({ value, onValueChange, children }) => {
  return <div>{children}</div>;
};

export const TabsContent = ({ value, children }) => {
  return <div>{children}</div>;
};

export const TabsList = ({ children }) => {
  return <div className="flex space-x-2 mb-4">{children}</div>;
};

export const TabsTrigger = ({ value, children, className }) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg ${className}`}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  );
};