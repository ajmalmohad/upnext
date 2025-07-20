import { X, Clock, Star, AlertCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Wip } from '../hooks/useWipTracker';

interface SidebarProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
  activeWips: Wip[];
  staleWips: Wip[];
}

export function Sidebar({ isVisible, onToggleVisibility, activeWips, staleWips }: SidebarProps) {
  if (!isVisible) return null;

  const highPriorityWips = activeWips
    .filter(wip => wip.priority <= 1) // P0 and P1 only
    .slice(0, 3);

  return (
    <motion.div 
      className="w-80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 h-screen sticky top-0 shadow-lg"
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 dark:from-slate-800/30 dark:to-slate-900/20 pointer-events-none" />
      
      <div className="relative p-6">
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
            <h2 className="text-lg font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">Focus</h2>
          </div>
          <motion.button 
            onClick={onToggleVisibility}
            className="p-2 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-200 group"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
          </motion.button>
        </motion.div>
        
        <div className="space-y-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <Star className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">High Priority Active</h3>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {highPriorityWips.map((wip, index) => (
                  <motion.div 
                    key={wip.id}
                    className="group p-4 bg-gradient-to-br from-white/60 to-slate-50/40 dark:from-slate-800/60 dark:to-slate-900/40 rounded-xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30 hover:shadow-lg transition-all duration-200"
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                    transition={{ delay: index * 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {wip.title}
                    </p>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-3">
                      <motion.span 
                        className="px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-300 rounded-md font-semibold border border-blue-200/50 dark:border-blue-700/30"
                        whileHover={{ scale: 1.1 }}
                      >
                        P{wip.priority}
                      </motion.span>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span className="font-medium">{wip.timeStarted}</span>
                      </div>
                      {wip.estimate && (
                        <>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span className="font-medium">{wip.estimate}</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {highPriorityWips.length === 0 && (
                <motion.div 
                  className="text-center py-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No high priority WIPs</p>
                </motion.div>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {staleWips.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0, height: 0 }}
                animate={{ y: 0, opacity: 1, height: 'auto' }}
                exit={{ y: 20, opacity: 0, height: 0 }}
                transition={{ delay: 0.5, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gentle Nudges</h3>
                </div>
                <motion.div 
                  className="p-5 bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-red-50/40 dark:from-amber-900/30 dark:via-orange-900/20 dark:to-red-900/10 rounded-xl border border-amber-200/50 dark:border-amber-700/30 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, y: -1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start space-x-3">
                    <motion.div 
                      className="w-2 h-2 bg-amber-400 rounded-full mt-2"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
                        {staleWips.length} WIP{staleWips.length > 1 ? 's' : ''} haven't been updated in 3+ days
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                        Consider updating progress or archiving
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
