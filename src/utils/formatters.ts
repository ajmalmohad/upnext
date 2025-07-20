import type { Wip } from '../hooks/useWipTracker';

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

export const getStatusColor = (status: Wip['status']): string => {
  switch (status) {
    case 'Active': 
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800';
    case 'Paused': 
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800';
    case 'Done': 
      return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
    default: 
      return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
  }
};

export const getPriorityColor = (priority: number): string => {
  if (priority === 0) return 'bg-red-100/80 text-red-800 border-red-200/60 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800/40';
  if (priority === 1) return 'bg-orange-100/80 text-orange-800 border-orange-200/60 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800/40';
  if (priority === 2) return 'bg-blue-100/80 text-blue-800 border-blue-200/60 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/40';
  if (priority === 3) return 'bg-slate-100/80 text-slate-700 border-slate-200/60 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/40';
  return 'bg-slate-100/80 text-slate-600 border-slate-200/60 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/40';
};
