import * as Tabs from '@radix-ui/react-tabs';

interface TabItem {
  value: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export function TabsComponent({ items, value, onValueChange, children }: TabsProps) {
  return (
    <Tabs.Root value={value} onValueChange={onValueChange} className="w-full">
      <div className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <div className="px-8">
          <Tabs.List className="flex space-x-8">
            {items.map((item) => (
              <Tabs.Trigger
                key={item.value}
                value={item.value}
                className="py-4 px-1 border-b-2 font-medium text-sm transition-colors data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700 dark:data-[state=active]:text-blue-400 dark:data-[state=inactive]:text-gray-400 dark:hover:text-gray-300"
              >
                {item.label} {item.count !== undefined && `(${item.count})`}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </div>
      </div>
      {children}
    </Tabs.Root>
  );
}
