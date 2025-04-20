import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, leftIcon, rightIcon, className = '', ...props }, ref) => {
    const inputStyles = `
      block rounded-md border ${error ? 'border-red-500' : 'border-gray-300'} 
      px-4 py-2 text-gray-900 shadow-sm 
      focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
      ${leftIcon ? 'pl-10' : ''} 
      ${rightIcon ? 'pr-10' : ''}
      ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    `;
    
    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <div className={`${widthStyles} ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`${inputStyles} ${widthStyles}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;