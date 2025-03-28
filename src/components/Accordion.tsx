import { Fragment, ReactNode } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import clsx from 'clsx';

interface AccordionItem {
  title: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: number[];
  variant?: 'default' | 'bordered' | 'separated';
  className?: string;
}

export default function Accordion({
  items,
  defaultOpen = [],
  variant = 'default',
  className,
}: AccordionProps) {
  const variants = {
    default: {
      wrapper: 'divide-y divide-gray-200',
      button: 'flex w-full items-center justify-between py-4 text-left text-sm font-medium text-gray-900 hover:text-primary',
      panel: 'pb-4 pt-2 text-sm text-gray-500',
    },
    bordered: {
      wrapper: 'border border-gray-200 rounded-lg divide-y divide-gray-200',
      button: 'flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium text-gray-900 hover:text-primary',
      panel: 'px-4 pb-4 pt-2 text-sm text-gray-500',
    },
    separated: {
      wrapper: 'space-y-2',
      button: 'flex w-full items-center justify-between rounded-lg bg-gray-50 px-4 py-4 text-left text-sm font-medium text-gray-900 hover:bg-gray-100',
      panel: 'px-4 pb-4 pt-2 text-sm text-gray-500',
    },
  };

  return (
    <div className={clsx(variants[variant].wrapper, className)}>
      {items.map((item, index) => (
        <Disclosure
          key={index}
          as="div"
          defaultOpen={defaultOpen.includes(index)}
        >
          {({ open }) => (
            <>
              <Disclosure.Button
                className={clsx(
                  variants[variant].button,
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
                disabled={item.disabled}
              >
                <span className="flex items-center">
                  {item.icon && (
                    <span className="mr-3">{item.icon}</span>
                  )}
                  {item.title}
                </span>
                <svg
                  className={clsx(
                    'h-5 w-5 text-gray-400 transition-transform',
                    open && 'transform rotate-180'
                  )}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Disclosure.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0"
                enterTo="transform opacity-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100"
                leaveTo="transform opacity-0"
              >
                <Disclosure.Panel className={variants[variant].panel}>
                  {item.content}
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
} 