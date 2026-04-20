import React, { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      error,
      type = 'text',
      id,
      className = '',
      helperText,
      icon: Icon,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-4 w-4 text-gray-400" />
            </div>
          )}
          {type === 'textarea' ? (
            <textarea
              ref={ref}
              id={inputId}
              className={`w-full rounded-xl border transition-all duration-200 px-4 py-2.5 text-sm
                ${
                  error
                    ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-400'
                    : 'border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange'
                }
                bg-white dark:bg-surface-dark text-gray-900 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
                ${Icon ? 'pl-10' : ''}
                ${className}`}
              rows={3}
              {...props}
            />
          ) : type === 'select' ? (
            <select
              ref={ref}
              id={inputId}
              className={`w-full rounded-xl border transition-all duration-200 px-4 py-2.5 text-sm appearance-none
                ${
                  error
                    ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-400'
                    : 'border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange'
                }
                bg-white dark:bg-surface-dark text-gray-900 dark:text-gray-100
                ${Icon ? 'pl-10' : ''}
                ${className}`}
              {...props}
            />
          ) : (
            <input
              ref={ref}
              type={type}
              id={inputId}
              className={`w-full rounded-xl border transition-all duration-200 px-4 py-2.5 text-sm
                ${
                  error
                    ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-400'
                    : 'border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange'
                }
                bg-white dark:bg-surface-dark text-gray-900 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
                ${Icon ? 'pl-10' : ''}
                ${className}`}
              {...props}
            />
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
