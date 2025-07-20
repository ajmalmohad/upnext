import { Play, Pause, Check, Clock, Calendar, Hash, MessageCircle } from 'lucide-react';
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
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {wip.title}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(wip.status)}`}>
                {wip.status}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getWeightColor(wip.weight)}`}>
                W{wip.weight}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{wip.timeStarted}</span>
              </div>
              {wip.estimate && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{wip.estimate}</span>
                </div>
              )}
              {wip.tags.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Hash className="w-4 h-4" />
                  <span>{wip.tags.join(', ')}</span>
                </div>
              )}
            </div>
            
            {wip.timeline.length > 0 && (
              <div className="mb-3">
                <CollapsibleSection
                  isOpen={isExpanded}
                  onToggle={onToggleExpanded}
                  trigger={
                    <>
                      <MessageCircle className="w-4 h-4" />
                      <span>{wip.timeline.length} update{wip.timeline.length > 1 ? 's' : ''}</span>
                    </>
                  }
                >
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="space-y-4">
                      {wip.timeline.map((update, index) => (
                        <div key={update.id} className="flex space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            {index < wip.timeline.length - 1 && (
                              <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600 ml-0.75 mt-1"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 dark:text-gray-100 mb-1">{update.text}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(update.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleSection>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 ml-6">
            <button 
              onClick={onUpdate}
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
            >
              Update
            </button>
            {wip.status !== 'Done' && (
              <>
                {wip.status === 'Active' ? (
                  <button 
                    onClick={() => onUpdateStatus('Paused')}
                    className="p-1.5 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950 rounded-lg transition-colors"
                    title="Pause WIP"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={() => onUpdateStatus('Active')}
                    className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 rounded-lg transition-colors"
                    title="Resume WIP"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={() => onUpdateStatus('Done')}
                  className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 rounded-lg transition-colors"
                  title="Mark as Done"
                >
                  <Check className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
