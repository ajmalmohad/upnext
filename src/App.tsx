import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { useWipTracker } from './hooks/useWipTracker';
import { CommandBar } from './components/CommandBar';
import { UpdateModal } from './components/UpdateModal';
import { WipCard } from './components/WipCard';
import { Sidebar } from './components/Sidebar';
import type { Wip } from './hooks/useWipTracker';

export default function WIPTracker() {
  const {
    expandedWips,
    incompleteWips,
    completedWips,
    activeWips,
    staleWips,
    addWip,
    updateWipStatus,
    addTimelineEntry,
    toggleWipExpanded
  } = useWipTracker();

  const [activeTab, setActiveTab] = useState("incomplete");
  const [showCommandBar, setShowCommandBar] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedWip, setSelectedWip] = useState<Wip | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  // Command bar keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandBar(true);
      }
      if (e.key === 'Escape') {
        setShowCommandBar(false);
        setShowUpdateModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddWip = (input: string) => {
    addWip(input);
  };

  const handleUpdateWip = (wip: Wip) => {
    setSelectedWip(wip);
    setShowUpdateModal(true);
  };

  const handleSaveUpdate = (wipId: number, text: string) => {
    addTimelineEntry(wipId, text);
    setShowUpdateModal(false);
    setSelectedWip(null);
  };

  const currentWips = activeTab === 'incomplete' ? incompleteWips : completedWips;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <CommandBar
        isOpen={showCommandBar}
        onClose={() => setShowCommandBar(false)}
        onSubmit={handleAddWip}
      />

      <UpdateModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        wip={selectedWip}
        onSubmit={handleSaveUpdate}
      />

      <div className="flex">
        <Sidebar
          isVisible={showSidebar}
          onToggleVisibility={() => setShowSidebar(!showSidebar)}
          activeWips={activeWips}
          staleWips={staleWips}
        />

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">WIP Tracker</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {incompleteWips.length} incomplete • {completedWips.length} completed • Press ⌘K to add WIP
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {!showSidebar && (
                  <button 
                    onClick={() => setShowSidebar(true)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm transition-colors"
                  >
                    Show Focus
                  </button>
                )}
                <button 
                  onClick={() => setShowCommandBar(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add WIP</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="px-8">
                <Tabs.List className="flex space-x-8">
                  <Tabs.Trigger
                    value="incomplete"
                    className="py-4 px-1 border-b-2 font-medium text-sm transition-colors data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700 dark:data-[state=active]:text-blue-400 dark:data-[state=inactive]:text-gray-400 dark:hover:text-gray-300"
                  >
                    Incomplete ({incompleteWips.length})
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="completed"
                    className="py-4 px-1 border-b-2 font-medium text-sm transition-colors data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700 dark:data-[state=active]:text-blue-400 dark:data-[state=inactive]:text-gray-400 dark:hover:text-gray-300"
                  >
                    Completed ({completedWips.length})
                  </Tabs.Trigger>
                </Tabs.List>
              </div>
            </div>

            <Tabs.Content value={activeTab} className="p-8">
              <div className="space-y-4 max-w-4xl">
                {currentWips
                  .sort((a, b) => b.weight - a.weight)
                  .map(wip => (
                    <WipCard
                      key={wip.id}
                      wip={wip}
                      isExpanded={expandedWips[wip.id] || false}
                      onToggleExpanded={() => toggleWipExpanded(wip.id)}
                      onUpdateStatus={(status) => updateWipStatus(wip.id, status)}
                      onUpdate={() => handleUpdateWip(wip)}
                    />
                  ))}

                {currentWips.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No {activeTab === 'incomplete' ? 'incomplete' : 'completed'} WIPs
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {activeTab === 'incomplete' 
                        ? "Start by adding what you're working on"
                        : "Complete some WIPs to see them here"
                      }
                    </p>
                    {activeTab === 'incomplete' && (
                      <button 
                        onClick={() => setShowCommandBar(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Your First WIP
                      </button>
                    )}
                  </div>
                )}
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
}
