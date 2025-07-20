import { X, Clock } from 'lucide-react';
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
    .filter(wip => wip.weight >= 7)
    .slice(0, 3);

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Focus</h2>
          <button 
            onClick={onToggleVisibility}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">High Priority Active</h3>
            <div className="space-y-2">
              {highPriorityWips.map(wip => (
                <div key={wip.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {wip.title}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-2">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium border`}>
                      W{wip.weight}
                    </span>
                    <Clock className="w-3 h-3" />
                    <span>{wip.timeStarted}</span>
                    {wip.estimate && (
                      <>
                        <span>•</span>
                        <span>{wip.estimate}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {highPriorityWips.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No high priority WIPs</p>
              )}
            </div>
          </div>

          {staleWips.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Gentle Nudges</h3>
              <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-100 dark:border-orange-800">
                <p className="text-sm text-orange-800 dark:text-orange-300 mb-2">
                  {staleWips.length} WIP{staleWips.length > 1 ? 's' : ''} haven't been updated in 3+ days
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  Consider updating progress or archiving
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
