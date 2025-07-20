import { useState } from 'react';
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

  if (!wip) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Update"
      description={wip.title}
    >
      <textarea
        value={updateText}
        onChange={(e) => setUpdateText(e.target.value)}
        placeholder="What progress did you make? Any blockers or next steps?"
        className="w-full h-32 p-3 border border-gray-200 dark:border-gray-700 rounded-lg resize-none outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-transparent dark:text-gray-100 dark:placeholder-gray-400"
        autoFocus
      />
      <div className="flex justify-end space-x-3 mt-4">
        <button 
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          disabled={!updateText.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add Update
        </button>
      </div>
    </Modal>
  );
}
