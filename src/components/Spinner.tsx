import clsx from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'primary';
  className?: string;
}

export default function Spinner({
  size = 'md',
  variant = 'primary',
  className,
}: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const variantClasses = {
    light: 'text-white',
    dark: 'text-gray-900',
    primary: 'text-blue-600',
  };

  return (
    <svg
      className={clsx(
        'animate-spin',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
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
  );
}

interface LoadingProps extends SpinnerProps {
  text?: string;
}

export function Loading({
  text = 'Loading...',
  size = 'lg',
  variant = 'primary',
  className,
}: LoadingProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center space-y-2',
        className
      )}
    >
      <Spinner size={size} variant={variant} />
      {text && (
        <p className={clsx('text-sm', {
          'text-white': variant === 'light',
          'text-gray-900': variant === 'dark',
          'text-blue-600': variant === 'primary',
        })}>
          {text}
        </p>
      )}
    </div>
  );
} 