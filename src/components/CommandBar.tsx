import { useState } from 'react';
import { Plus } from 'lucide-react';
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
      title="Add New WIP"
      description="Use #tags, ~2h for estimates, w8 for weight (1-10)"
    >
      <div className="flex items-center space-x-3">
        <Plus className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add new WIP... (try: 'Fix login bug #frontend ~2h w8')"
          className="flex-1 text-lg placeholder-gray-400 outline-none bg-transparent dark:text-gray-100"
          autoFocus
        />
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <button 
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add WIP
        </button>
      </div>
    </Modal>
  );
}
