import { forwardRef } from 'react';
import clsx from 'clsx';

interface Option {
  value: string | number;
  label: string;
  description?: string;
}

interface RadioGroupProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  options: Option[];
  label?: string;
  error?: string;
  className?: string;
}

const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  ({ options, label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div
          className={clsx(
            'space-y-4',
            className
          )}
        >
          {options.map((option) => (
            <div key={option.value} className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  ref={ref}
                  type="radio"
                  value={option.value}
                  className={clsx(
                    'h-4 w-4 border-gray-300 text-primary focus:ring-primary',
                    error && 'border-red-500 focus:ring-red-500'
                  )}
                  {...props}
                />
              </div>
              <div className="ml-3">
                <label
                  htmlFor={`${props.name}-${option.value}`}
                  className={clsx(
                    'text-sm font-medium text-gray-700',
                    props.disabled && 'opacity-50'
                  )}
                >
                  {option.label}
                </label>
                {option.description && (
                  <p className="text-sm text-gray-500">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup; 