import { ReactNode } from 'react';
import clsx from 'clsx';
import Button from './Button';

interface ErrorMessageProps {
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'inline' | 'block';
  className?: string;
}

export default function ErrorMessage({
  title = 'Error',
  message,
  action,
  variant = 'block',
  className,
}: ErrorMessageProps) {
  if (variant === 'inline') {
    return (
      <div
        className={clsx(
          'rounded-md bg-red-50 p-4',
          className
        )}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              {title}
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{message}</p>
            </div>
            {action && (
              <div className="mt-4">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'rounded-md bg-red-50 p-4 text-center',
        className
      )}
    >
      <svg
        className="mx-auto h-12 w-12 text-red-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h3 className="mt-2 text-lg font-medium text-red-800">
        {title}
      </h3>
      <p className="mt-1 text-sm text-red-700">{message}</p>
      {action && (
        <div className="mt-6">
          <Button
            variant="danger"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}

interface ApiErrorMessageProps {
  error: {
    status?: number;
    message?: string;
  };
  onRetry?: () => void;
  className?: string;
}

export function ApiErrorMessage({
  error,
  onRetry,
  className,
}: ApiErrorMessageProps) {
  const getErrorMessage = () => {
    switch (error.status) {
      case 401:
        return 'You are not authorized to access this resource.';
      case 403:
        return 'You do not have permission to access this resource.';
      case 404:
        return 'The requested resource was not found.';
      case 500:
        return 'An internal server error occurred.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  };

  return (
    <ErrorMessage
      title="Error"
      message={getErrorMessage()}
      action={
        onRetry
          ? {
              label: 'Try again',
              onClick: onRetry,
            }
          : undefined
      }
      className={className}
    />
  );
} 