import { ReactNode } from 'react';
import clsx from 'clsx';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  className?: string;
}

interface FormGroupProps {
  children: ReactNode;
  className?: string;
}

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?: boolean;
  className?: string;
}

interface FormErrorProps {
  children: ReactNode;
  className?: string;
}

interface FormHintProps {
  children: ReactNode;
  className?: string;
}

export function Form({ children, className, ...props }: FormProps) {
  return (
    <form className={clsx('space-y-6', className)} {...props}>
      {children}
    </form>
  );
}

export function FormGroup({ children, className }: FormGroupProps) {
  return (
    <div className={clsx('space-y-2', className)}>
      {children}
    </div>
  );
}

export function FormLabel({
  children,
  required,
  className,
  ...props
}: FormLabelProps) {
  return (
    <label
      className={clsx(
        'block text-sm font-medium text-gray-700',
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-red-500" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

export function FormError({ children, className }: FormErrorProps) {
  return (
    <p className={clsx('mt-1 text-sm text-red-600', className)}>
      {children}
    </p>
  );
}

export function FormHint({ children, className }: FormHintProps) {
  return (
    <p className={clsx('mt-1 text-sm text-gray-500', className)}>
      {children}
    </p>
  );
} 