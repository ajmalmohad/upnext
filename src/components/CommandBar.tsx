import { useState } from 'react';
import { Plus, Sparkles, Command } from 'lucide-react';
import { motion } from 'framer-motion';
import { Modal } from './ui/Modal';

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: string) => void;
}

export function CommandBar({ isOpen, onClose, onSubmit }: CommandBarProps) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    onSubmit(input);
    setInput("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Task"
      description="Use #tags, ~2h for estimates, p0 for priority (0=urgent, 1=high, 2=medium, 3=low)"
    >
      <motion.div 
        className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.2 }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Plus className="w-5 h-5 text-blue-500" />
        </motion.div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add new task... (try: 'fix login bug #frontend ~2h p0')"
          className="flex-1 outline-none focus:outline-none text-lg placeholder-slate-400 dark:placeholder-slate-500 bg-transparent dark:text-slate-100 font-medium border-none focus:ring-0 focus:border-none focus:shadow-none"
          style={{ boxShadow: 'none', outline: 'none', border: 'none' }}
          autoFocus
        />
      </motion.div>
      
      <motion.div 
        className="flex items-center justify-between mt-4 p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg border border-slate-200/30 dark:border-slate-700/30"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1">
            <Command className="w-3 h-3" />
            <span>⏎ to submit</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs font-mono">esc</span>
            <span>to cancel</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-blue-500" />
          <span className="text-xs text-slate-500 dark:text-slate-400">AI-powered parsing</span>
        </div>
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
          disabled={!input.trim()}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 backdrop-blur-sm flex items-center space-x-2"
          whileHover={{ 
            scale: !input.trim() ? 1 : 1.05, 
            y: !input.trim() ? 0 : -1,
            boxShadow: !input.trim() ? undefined : "0 20px 40px -12px rgba(59, 130, 246, 0.35)"
          }}
          whileTap={{ scale: !input.trim() ? 1 : 0.95 }}
        >
          <Plus className="w-4 h-4" />
          <span>Add WIP</span>
        </motion.button>
      </div>
    </Modal>
  );
}
