import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-brand-orange hover:bg-brand-orange-dark text-white focus:ring-brand-orange shadow-md hover:shadow-lg active:scale-[0.98]',
    secondary:
      'bg-gray-100 dark:bg-surface-dark hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-gray-300 active:scale-[0.98]',
    outline:
      'border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white focus:ring-brand-orange active:scale-[0.98]',
    danger:
      'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400 shadow-md hover:shadow-lg active:scale-[0.98]',
    success:
      'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400 shadow-md hover:shadow-lg active:scale-[0.98]',
    ghost:
      'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-300 active:scale-[0.98]',
    gold:
      'bg-brand-gold hover:bg-brand-gold-dark text-white focus:ring-brand-gold shadow-md hover:shadow-lg active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
