import { Play, Pause, Check, Clock, Calendar, Hash, MessageCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CollapsibleSection } from './ui/CollapsibleSection';
import { formatTimeAgo, getStatusColor, getWeightColor } from '../utils/formatters';
import type { Wip } from '../hooks/useWipTracker';

interface WipCardProps {
  wip: Wip;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onUpdateStatus: (status: Wip['status']) => void;
  onUpdate: () => void;
}

export function WipCard({ 
  wip, 
  isExpanded, 
  onToggleExpanded, 
  onUpdateStatus, 
  onUpdate 
}: WipCardProps) {
  const getStatusIcon = (status: Wip['status']) => {
    switch (status) {
      case 'Active':
        return <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />;
      case 'Paused':
        return <div className="w-2 h-2 bg-yellow-400 rounded-full" />;
      case 'Done':
        return <div className="w-2 h-2 bg-blue-400 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-slate-300 rounded-full" />;
    }
  };

  return (
    <motion.div 
      className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ 
        y: -4, 
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <motion.div 
              className="flex items-center space-x-3 mb-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <span>{wip.title}</span>
              </h3>
              
              <div className="flex items-center space-x-2">
                <motion.div 
                  className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-sm ${getStatusColor(wip.status)}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {getStatusIcon(wip.status)}
                  <span>{wip.status}</span>
                </motion.div>
                
                <motion.span 
                  className={`px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-sm ${getWeightColor(wip.weight)}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  W{wip.weight}
                </motion.span>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center text-sm text-slate-600 dark:text-slate-400 space-x-6 mb-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="font-medium">{wip.timeStarted}</span>
              </div>
              {wip.estimate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">{wip.estimate}</span>
                </div>
              )}
              {wip.tags.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-slate-400" />
                  <div className="flex flex-wrap gap-1">
                    {wip.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
            
            {wip.timeline.length > 0 && (
              <motion.div 
                className="mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <CollapsibleSection
                  isOpen={isExpanded}
                  onToggle={onToggleExpanded}
                  trigger={
                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-medium">{wip.timeline.length} update{wip.timeline.length > 1 ? 's' : ''}</span>
                    </div>
                  }
                >
                  <div 
                    className="mt-4 p-5 bg-gradient-to-br from-slate-50/80 to-slate-100/50 dark:from-slate-800/80 dark:to-slate-900/50 rounded-xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50"
                  >
                    <div className="space-y-4">
                      {wip.timeline.map((update, index) => (
                        <div 
                          key={update.id} 
                          className="flex space-x-4"
                        >
                          <div className="flex-shrink-0 flex flex-col items-center">
                            <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-md" />
                            {index < wip.timeline.length - 1 && (
                              <div className="w-0.5 h-8 bg-gradient-to-b from-blue-300 to-slate-300 dark:to-slate-600 mt-2"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-900 dark:text-slate-100 mb-2 font-medium leading-relaxed">{update.text}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{formatTimeAgo(update.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleSection>
              </motion.div>
            )}
          </div>

          <motion.div 
            className="flex items-center space-x-2 ml-6"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <motion.button 
              onClick={onUpdate}
              className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200/50 dark:border-slate-700/50 transition-all duration-200 backdrop-blur-sm font-medium"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              Update
            </motion.button>
            
            {wip.status !== 'Done' && (
              <>
                {wip.status === 'Active' ? (
                  <motion.button 
                    onClick={() => onUpdateStatus('Paused')}
                    className="p-2.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl transition-all duration-200 backdrop-blur-sm border border-amber-200/50 dark:border-amber-700/30"
                    title="Pause WIP"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Pause className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button 
                    onClick={() => onUpdateStatus('Active')}
                    className="p-2.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-xl transition-all duration-200 backdrop-blur-sm border border-green-200/50 dark:border-green-700/30"
                    title="Resume WIP"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Play className="w-4 h-4" />
                  </motion.button>
                )}
                <motion.button 
                  onClick={() => onUpdateStatus('Done')}
                  className="p-2.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-xl transition-all duration-200 backdrop-blur-sm border border-green-200/50 dark:border-green-700/30"
                  title="Mark as Done"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Check className="w-4 h-4" />
                </motion.button>
              </>
            )}
          </motion.div>
        </div>
        
        {wip.status === 'Done' && (
          <motion.div
            className="absolute top-4 right-4 opacity-20 dark:opacity-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: "backOut" }}
          >
            <Sparkles className="w-6 h-6 text-green-500" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
