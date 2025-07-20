import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface CollapsibleSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  trigger: ReactNode;
  children: ReactNode;
}

export function CollapsibleSection({ isOpen, onToggle, trigger, children }: CollapsibleSectionProps) {
  return (
    <Collapsible.Root open={isOpen} onOpenChange={onToggle}>
      <Collapsible.Trigger asChild>
        <button
          onClick={onToggle}
          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          {trigger}
        </button>
      </Collapsible.Trigger>
      <Collapsible.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
