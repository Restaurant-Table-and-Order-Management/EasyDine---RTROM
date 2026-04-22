import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

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
            <div className="relative">
              <input
                ref={ref}
                type={inputType}
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
                  ${isPassword ? 'pr-10' : ''}
                  ${className}`}
                {...props}
              />
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
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
