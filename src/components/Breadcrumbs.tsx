import { ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
}

export default function Breadcrumbs({
  items,
  separator = (
    <svg
      className="h-5 w-5 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  className,
}: BreadcrumbsProps) {
  return (
    <nav className={clsx('flex', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2">{separator}</span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className={clsx(
                  'flex items-center text-sm font-medium',
                  index === items.length - 1
                    ? 'text-gray-500 cursor-default'
                    : 'text-gray-700 hover:text-primary'
                )}
                aria-current={
                  index === items.length - 1 ? 'page' : undefined
                }
              >
                {item.icon && (
                  <span className="mr-2">{item.icon}</span>
                )}
                {item.label}
              </Link>
            ) : (
              <span
                className={clsx(
                  'flex items-center text-sm font-medium',
                  index === items.length - 1
                    ? 'text-gray-500'
                    : 'text-gray-700'
                )}
              >
                {item.icon && (
                  <span className="mr-2">{item.icon}</span>
                )}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 