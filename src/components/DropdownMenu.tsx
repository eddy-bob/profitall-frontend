import { Fragment, ReactNode } from 'react';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';

interface DropdownMenuProps {
  trigger: ReactNode;
  items: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: ReactNode;
    variant?: 'default' | 'danger';
    disabled?: boolean;
  }[];
  align?: 'left' | 'right';
  className?: string;
}

export default function DropdownMenu({
  trigger,
  items,
  align = 'right',
  className,
}: DropdownMenuProps) {
  return (
    <Menu as="div" className={clsx('relative inline-block text-left', className)}>
      <Menu.Button as={Fragment}>{trigger}</Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={clsx(
            'absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
            align === 'left' ? 'left-0' : 'right-0'
          )}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <Menu.Item key={index} disabled={item.disabled}>
                {({ active }) => {
                  const Component = item.href ? 'a' : 'button';
                  return (
                    <Component
                      href={item.href}
                      onClick={item.onClick}
                      className={clsx(
                        'group flex w-full items-center px-4 py-2 text-sm',
                        active
                          ? item.variant === 'danger'
                            ? 'bg-red-50 text-red-900'
                            : 'bg-gray-100 text-gray-900'
                          : item.variant === 'danger'
                          ? 'text-red-700'
                          : 'text-gray-700',
                        item.disabled && 'cursor-not-allowed opacity-50'
                      )}
                    >
                      {item.icon && (
                        <span
                          className={clsx(
                            'mr-3 h-5 w-5',
                            item.variant === 'danger'
                              ? 'text-red-600'
                              : 'text-gray-400 group-hover:text-gray-500'
                          )}
                        >
                          {item.icon}
                        </span>
                      )}
                      {item.label}
                    </Component>
                  );
                }}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 