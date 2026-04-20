import React from 'react';

export default function Card({
  children,
  className = '',
  padding = 'p-6',
  hover = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm
        ${hover ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        transition-all duration-200
        ${padding}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
