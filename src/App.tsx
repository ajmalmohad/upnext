import { useState, useEffect } from 'react';
import { Plus, Sparkles, Zap } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useWipTracker } from './hooks/useWipTracker';
import { CommandBar } from './components/CommandBar';
import { UpdateModal } from './components/UpdateModal';
import { WipCard } from './components/WipCard';
import { Sidebar } from './components/Sidebar';
import type { Wip } from './hooks/useWipTracker';

export default function WIPTracker() {
  const {
    wips,
    expandedWips,
    incompleteWips,
    completedWips,
    activeWips,
    staleWips,
    addWip,
    updateWipStatus,
    updateWipPriority,
    updateWipTitle,
    deleteWip,
    addTimelineEntry,
    deleteTimelineEntry,
    updateTimelineEntry,
    toggleWipExpanded,
    clearAllData
  } = useWipTracker();

  const [activeTab, setActiveTab] = useState("incomplete");
  const [showCommandBar, setShowCommandBar] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedWip, setSelectedWip] = useState<Wip | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 10]);

    // Command bar keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandBar(true);
      }
      // Clear all data shortcut (for testing)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        if (confirm('Are you sure you want to clear all WIP data? This cannot be undone.')) {
          clearAllData();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearAllData]);

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 font-system font-sans antialiased"
    >
      {/* Optimized Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/15 to-pink-200/15 rounded-full blur-3xl opacity-50" />
      </div>

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
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.16, 1, 0.3, 1] 
              }}
            >
              <Sidebar
                isVisible={showSidebar}
                onToggleVisibility={() => setShowSidebar(!showSidebar)}
                activeWips={activeWips}
                staleWips={staleWips}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-500 ease-out ${showSidebar ? 'ml-0' : 'ml-0'}`}>
          {/* Glassmorphism Header */}
          <motion.div 
            style={{ 
              opacity: headerOpacity,
              backdropFilter: `blur(${headerBlur}px)`
            }}
            className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 px-8 py-6"
          >
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-between"
            >
              <div>
                <motion.h1 
                  className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  upnext
                </motion.h1>
                <motion.p 
                  className="text-slate-600 dark:text-slate-400 mt-1 flex items-center space-x-4"
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <span className="inline-flex items-center space-x-1">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    <span>{incompleteWips.length} incomplete</span>
                  </span>
                  <span className="inline-flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>{completedWips.length} completed</span>
                  </span>
                  <span className="inline-flex items-center space-x-1 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    <span>⌘K to add</span>
                  </span>
                </motion.p>
              </div>
              <div className="flex items-center space-x-3">
                <AnimatePresence>
                  {!showSidebar && (
                    <motion.button 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onClick={() => setShowSidebar(true)}
                      className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-xl text-sm transition-all duration-200 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:scale-105"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Show Focus
                    </motion.button>
                  )}
                </AnimatePresence>
                <motion.button 
                  onClick={() => setShowCommandBar(true)}
                  className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-105 backdrop-blur-sm"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                  <span className="font-medium">Add WIP</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Tabs */}
          <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
            <motion.div 
              className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/30"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="px-8">
                <Tabs.List className="flex space-x-8">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Tabs.Trigger
                      value="incomplete"
                      className="group relative py-4 px-1 font-medium text-sm transition-all duration-200 data-[state=active]:text-blue-600 data-[state=inactive]:text-slate-500 hover:text-slate-700 dark:data-[state=active]:text-blue-400 dark:data-[state=inactive]:text-slate-400 dark:hover:text-slate-300"
                    >
                      <span className="relative z-10">
                        Incomplete ({incompleteWips.length})
                      </span>
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ 
                          scaleX: activeTab === 'incomplete' ? 1 : 0,
                          opacity: activeTab === 'incomplete' ? 1 : 0 
                        }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </Tabs.Trigger>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Tabs.Trigger
                      value="completed"
                      className="group relative py-4 px-1 font-medium text-sm transition-all duration-200 data-[state=active]:text-blue-600 data-[state=inactive]:text-slate-500 hover:text-slate-700 dark:data-[state=active]:text-blue-400 dark:data-[state=inactive]:text-slate-400 dark:hover:text-slate-300"
                    >
                      <span className="relative z-10">
                        Completed ({completedWips.length})
                      </span>
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ 
                          scaleX: activeTab === 'completed' ? 1 : 0,
                          opacity: activeTab === 'completed' ? 1 : 0 
                        }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </Tabs.Trigger>
                  </motion.div>
                </Tabs.List>
              </div>
            </motion.div>

            <Tabs.Content value={activeTab} className="p-8 min-h-[60vh]">
              <motion.div 
                className={`space-y-4 max-w-4xl mx-auto ${currentWips.length === 0 ? 'flex items-center justify-center min-h-[50vh]' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, staggerChildren: 0.1 }}
              >
                <AnimatePresence mode="popLayout">
                  {currentWips
                    .sort((a, b) => a.priority - b.priority) // P0 first, then P1, P2, etc.
                    .map((wip, index) => (
                      <motion.div
                        key={wip.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0, 
                          scale: 1 
                        }}
                        exit={{ 
                          opacity: 0, 
                          y: -20, 
                          scale: 0.95,
                          transition: { duration: 0.2 }
                        }}
                        transition={{ 
                          delay: index * 0.05, 
                          duration: 0.4,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                        layout
                        whileHover={{ 
                          y: -2, 
                          scale: 1.02,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <WipCard
                          wip={wip}
                          isExpanded={expandedWips[wip.id] || false}
                          onToggleExpanded={() => toggleWipExpanded(wip.id)}
                          onUpdateStatus={(status) => updateWipStatus(wip.id, status)}
                          onUpdatePriority={(priority) => updateWipPriority(wip.id, priority)}
                          onUpdateTitle={(title) => updateWipTitle(wip.id, title)}
                          onDelete={() => deleteWip(wip.id)}
                          onUpdateTimelineEntry={(entryId, text) => updateTimelineEntry(wip.id, entryId, text)}
                          onDeleteTimelineEntry={(entryId) => deleteTimelineEntry(wip.id, entryId)}
                          onUpdate={() => handleUpdateWip(wip)}
                        />
                      </motion.div>
                    ))}
                </AnimatePresence>

                {currentWips.length === 0 && (
                  <motion.div 
                    className="text-center w-full"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.div 
                      className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Zap className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                    </motion.div>
                    <motion.h3 
                      className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      No {activeTab === 'incomplete' ? 'incomplete' : 'completed'} WIPs
                    </motion.h3>
                    <motion.p 
                      className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    >
                      {activeTab === 'incomplete' 
                        ? wips.length === 0 
                          ? "Welcome to WIP Tracker! Start by pressing ⌘K to add your first work-in-progress item."
                          : "Ready to tackle something amazing? Start by adding what you're working on and watch your progress unfold."
                        : "Complete some WIPs to see your achievements here. Every finished task is a step closer to your goals!"
                      }
                    </motion.p>
                    {activeTab === 'incomplete' && (
                      <motion.button 
                        onClick={() => setShowCommandBar(true)}
                        className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 font-medium"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                        whileHover={{ 
                          scale: 1.05, 
                          y: -2,
                          boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.35)"
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="flex items-center space-x-2">
                          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                          <span>Add Your First WIP</span>
                        </span>
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </motion.div>
  );
}
