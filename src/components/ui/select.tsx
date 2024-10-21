import React from 'react';

export const Select = ({ value, onValueChange, children }) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md"
    >
      {children}
    </select>
  );
};

export const SelectTrigger = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

export const SelectValue = ({ placeholder }) => {
  return <span>{placeholder}</span>;
};

export const SelectContent = ({ children }) => {
  return <>{children}</>;
};

export const SelectItem = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};