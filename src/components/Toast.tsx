import { ReactNode } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import clsx from 'clsx';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'loading';
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  icon?: ReactNode;
}

export function Toast() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: '',
        duration: 5000,
        style: {
          background: '#fff',
          color: '#363636',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10B981',
            secondary: '#fff',
          },
        },
        error: {
          duration: 3000,
          iconTheme: {
            primary: '#EF4444',
            secondary: '#fff',
          },
        },
        loading: {
          duration: Infinity,
        },
      }}
    />
  );
}

export function showToast({
  message,
  type = 'success',
  duration,
  position = 'top-right',
  icon,
}: ToastProps) {
  const toastOptions = {
    duration,
    position,
    icon,
  };

  switch (type) {
    case 'success':
      return toast.success(message, toastOptions);
    case 'error':
      return toast.error(message, toastOptions);
    case 'loading':
      return toast.loading(message, toastOptions);
    default:
      return toast(message, toastOptions);
  }
}

interface CustomToastProps {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export function CustomToast({ children, onClose, className }: CustomToastProps) {
  return (
    <div
      className={clsx(
        'max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5',
        className
      )}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            {children}
          </div>
        </div>
      </div>
      {onClose && (
        <div className="flex border-l border-gray-200">
          <button
            onClick={onClose}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
} 