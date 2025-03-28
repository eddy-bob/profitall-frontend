import { Fragment, ReactNode, useState } from 'react';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export default function Tooltip({
  content,
  children,
  position = 'top',
  className,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const positions = {
    top: '-top-2 left-1/2 -translate-x-1/2 -translate-y-full',
    right: 'top-1/2 -right-2 translate-x-full -translate-y-1/2',
    bottom: '-bottom-2 left-1/2 -translate-x-1/2 translate-y-full',
    left: 'top-1/2 -left-2 -translate-x-full -translate-y-1/2',
  };

  const arrows = {
    top: 'bottom-[-0.5rem] left-1/2 -translate-x-1/2 border-t-gray-900',
    right: 'left-[-0.5rem] top-1/2 -translate-y-1/2 border-r-gray-900',
    bottom: 'top-[-0.5rem] left-1/2 -translate-x-1/2 border-b-gray-900',
    left: 'right-[-0.5rem] top-1/2 -translate-y-1/2 border-l-gray-900',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="inline-block">{children}</div>
      <Transition
        as={Fragment}
        show={isOpen}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div
          className={clsx(
            'absolute z-50',
            positions[position],
            className
          )}
        >
          <div className="relative">
            <div className="bg-gray-900 text-white text-sm rounded-md py-1 px-2 max-w-xs">
              {content}
            </div>
            <div
              className={clsx(
                'absolute w-3 h-3 border-4 border-transparent',
                arrows[position]
              )}
            />
          </div>
        </div>
      </Transition>
    </div>
  );
} 