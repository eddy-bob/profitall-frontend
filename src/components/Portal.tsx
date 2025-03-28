import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  container?: HTMLElement;
}

export default function Portal({
  children,
  container,
}: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    children,
    container || document.body
  );
}

interface PortalContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PortalContainer({
  children,
  className,
}: PortalContainerProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const div = document.createElement('div');
    if (className) {
      div.className = className;
    }
    document.body.appendChild(div);
    setContainer(div);

    return () => {
      document.body.removeChild(div);
    };
  }, [className]);

  return container ? createPortal(children, container) : null;
} 