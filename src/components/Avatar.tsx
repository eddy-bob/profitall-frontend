import { useMemo } from 'react';
import clsx from 'clsx';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'rounded';
  className?: string;
}

export default function Avatar({
  src,
  alt,
  name,
  size = 'md',
  variant = 'circle',
  className,
}: AvatarProps) {
  const initials = useMemo(() => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [name]);

  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-14 w-14 text-xl',
  };

  const variants = {
    circle: 'rounded-full',
    rounded: 'rounded-lg',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={clsx(
          'object-cover',
          sizes[size],
          variants[variant],
          className
        )}
      />
    );
  }

  return (
    <div
      className={clsx(
        'inline-flex items-center justify-center bg-primary text-white font-medium',
        sizes[size],
        variants[variant],
        className
      )}
    >
      {initials}
    </div>
  );
} 