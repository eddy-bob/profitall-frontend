import { Fragment, ReactNode } from 'react';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';

interface TabItem {
  label: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

export default function Tabs({
  items,
  defaultIndex = 0,
  onChange,
  variant = 'default',
  className,
}: TabsProps) {
  const variants = {
    default: {
      list: 'border-b border-gray-200',
      tab: 'border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700',
      selected: 'border-primary text-primary',
      panel: 'pt-4',
    },
    pills: {
      list: 'space-x-2',
      tab: 'rounded-md py-2 px-3 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700',
      selected: 'bg-primary text-white hover:bg-primary/90 hover:text-white',
      panel: 'pt-4',
    },
    underline: {
      list: 'border-b border-gray-200',
      tab: 'py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700',
      selected: 'text-primary border-b-2 border-primary',
      panel: 'pt-4',
    },
  };

  return (
    <Tab.Group
      defaultIndex={defaultIndex}
      onChange={onChange}
    >
      <Tab.List
        className={clsx(
          'flex',
          variants[variant].list,
          className
        )}
      >
        {items.map((item) => (
          <Tab
            key={item.label}
            as={Fragment}
            disabled={item.disabled}
          >
            {({ selected }) => (
              <button
                className={clsx(
                  variants[variant].tab,
                  selected && variants[variant].selected,
                  item.disabled && 'opacity-50 cursor-not-allowed',
                  'focus:outline-none'
                )}
              >
                {item.icon && (
                  <span className="mr-2">{item.icon}</span>
                )}
                {item.label}
              </button>
            )}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels>
        {items.map((item) => (
          <Tab.Panel
            key={item.label}
            className={variants[variant].panel}
          >
            {item.content}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
} 