import React from 'react';

export const Slider = ({ value, onValueChange, min, max, step, className }) => {
  return (
    <input
      type="range"
      value={value[0]}
      onChange={(e) => onValueChange([parseFloat(e.target.value)])}
      min={min}
      max={max}
      step={step}
      className={`w-full ${className}`}
    />
  );
};