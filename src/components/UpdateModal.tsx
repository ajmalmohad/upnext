import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Modal } from './ui/Modal';
import type { Wip } from '../hooks/useWipTracker';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  wip: Wip | null;
  onSubmit: (wipId: number, text: string) => void;
}

export function UpdateModal({ isOpen, onClose, wip, onSubmit }: UpdateModalProps) {
  const [updateText, setUpdateText] = useState("");

  const handleSubmit = () => {
    if (wip && updateText.trim()) {
      onSubmit(wip.id, updateText.trim());
      setUpdateText("");
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  if (!wip) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Update"
      description={wip.title}
    >
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <motion.div
            className="absolute top-3 left-3 z-10"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </motion.div>
          <textarea
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What progress did you make? Any blockers or next steps?"
            className="w-full h-32 pl-12 pr-4 py-3 bg-gradient-to-br from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-xl resize-none outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm placeholder-slate-400 dark:placeholder-slate-500 dark:text-slate-100 font-medium leading-relaxed"
            autoFocus
          />
        </div>
        
        <motion.div 
          className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg border border-slate-200/30 dark:border-slate-700/30"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1">
              <span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">⌘⏎</span>
              <span>to submit</span>
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md font-medium">
              {updateText.length} chars
            </span>
          </div>
        </motion.div>
      </motion.div>

      <div className="flex justify-end space-x-3 mt-6">
        <motion.button 
          onClick={onClose}
          className="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-200 font-medium backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        </motion.button>
        <motion.button 
          onClick={handleSubmit}
          disabled={!updateText.trim()}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 backdrop-blur-sm flex items-center space-x-2"
          whileHover={{ 
            scale: !updateText.trim() ? 1 : 1.05, 
            y: !updateText.trim() ? 0 : -1,
            boxShadow: !updateText.trim() ? undefined : "0 20px 40px -12px rgba(59, 130, 246, 0.35)"
          }}
          whileTap={{ scale: !updateText.trim() ? 1 : 0.95 }}
        >
          <Send className="w-4 h-4" />
          <span>Add Update</span>
        </motion.button>
      </div>
    </Modal>
  );
}
