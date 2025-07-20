import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
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
        <button className="flex items-center space-x-2 text-sm font-medium transition-colors duration-150 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </motion.div>
          <div className="flex items-center space-x-2">
            {trigger}
          </div>
        </button>
      </Collapsible.Trigger>
      <Collapsible.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
