import { useState, useEffect } from 'react';

export interface WipTimelineEntry {
  id: number;
  text: string;
  timestamp: Date;
}

export interface Wip {
  id: number;
  title: string;
  status: 'Active' | 'Paused' | 'Done';
  timeStarted: string;
  estimate?: string;
  priority: number; // 0 = highest priority (P0), 10 = lowest priority (P10)
  tags: string[];
  lastUpdated: Date;
  timeline: WipTimelineEntry[];
}

export interface ParsedCommand {
  title: string;
  tags: string[];
  estimate: string | null;
  priority: number;
}

// Storage utilities
const STORAGE_KEY = 'wip-tracker-data';

const saveToStorage = (data: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const loadFromStorage = (): Wip[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    return parsed.map((wip: any) => ({
      ...wip,
      lastUpdated: new Date(wip.lastUpdated),
      timeline: wip.timeline.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }))
    }));
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return [];
  }
};

// Start with empty state - no initial WIPs
const getInitialWips = (): Wip[] => {
  const stored = loadFromStorage();
  return stored;
};

export function useWipTracker() {
  const [wips, setWips] = useState<Wip[]>(getInitialWips);
  const [expandedWips, setExpandedWips] = useState<Record<number, boolean>>({});
  const [nextId, setNextId] = useState(() => {
    const stored = loadFromStorage();
    if (stored.length === 0) return 1;
    
    // Find the highest ID from both WIPs and timeline entries
    const wipIds = stored.map(w => w.id);
    const timelineIds = stored.flatMap(w => w.timeline.map(t => t.id));
    const allIds = [...wipIds, ...timelineIds];
    
    return Math.max(...allIds) + 1;
  });

  // Save to localStorage whenever wips change
  useEffect(() => {
    saveToStorage(wips);
  }, [wips]);

  function parseCommand(input: string): ParsedCommand {
    const tagRegex = /#(\w+)/g;
    const estimateRegex = /~(\w+)/g;
    const priorityRegex = /p(\d+)/gi;

    const tags = Array.from(input.matchAll(tagRegex), m => m[1]);
    const estimateMatch = input.match(estimateRegex);
    const priorityMatch = input.match(priorityRegex);

    const priority = priorityMatch ? parseInt(priorityMatch[0].slice(1)) : 3;

    const cleanTitle = input
      .replace(tagRegex, '')
      .replace(estimateRegex, '')
      .replace(priorityRegex, '')
      .trim();

    const estimate = estimateMatch ? estimateMatch[0].slice(1) : null;

    return { title: cleanTitle, tags, estimate, priority };
  }

  const addWip = (input: string) => {
    if (!input.trim()) return;
    
    const { title, tags, estimate, priority } = parseCommand(input);
    
    const newWip: Wip = {
      id: nextId,
      title,
      status: "Active",
      timeStarted: "Just now",
      estimate: estimate || undefined,
      priority,
      tags,
      lastUpdated: new Date(),
      timeline: []
    };

    setWips(prev => [newWip, ...prev]);
    setNextId(prev => prev + 1);
  };

    const updateWipStatus = (id: number, status: Wip['status']) => {
    setWips(prev => prev.map(wip => 
      wip.id === id 
        ? { ...wip, status, lastUpdated: new Date() }
        : wip
    ));
  };

  const updateWipPriority = (id: number, priority: number) => {
    setWips(prev => prev.map(wip => 
      wip.id === id 
        ? { ...wip, priority: Math.max(0, Math.min(10, priority)), lastUpdated: new Date() }
        : wip
    ));
  };

  const clearAllData = () => {
    setWips([]);
    setExpandedWips({});
    setNextId(1);
    localStorage.removeItem(STORAGE_KEY);
  };

  const addTimelineEntry = (wipId: number, text: string) => {
    if (!text.trim()) return;

    const newTimelineEntry: WipTimelineEntry = {
      id: nextId,
      text: text.trim(),
      timestamp: new Date()
    };

    setWips(prev => prev.map(wip => 
      wip.id === wipId 
        ? { 
            ...wip, 
            timeline: [...wip.timeline, newTimelineEntry],
            lastUpdated: new Date() 
          }
        : wip
    ));
    
    setNextId(prev => prev + 1);
  };

  const toggleWipExpanded = (id: number) => {
    setExpandedWips(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStaleWips = () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    return wips.filter(wip => 
      wip.status !== 'Done' && wip.lastUpdated < threeDaysAgo
    );
  };

  // Derived state
  const incompleteWips = wips.filter(wip => wip.status !== 'Done');
  const completedWips = wips.filter(wip => wip.status === 'Done');
  const activeWips = wips.filter(wip => wip.status === 'Active');
  const staleWips = getStaleWips();

  return {
    wips,
    expandedWips,
    incompleteWips,
    completedWips,
    activeWips,
    staleWips,
    addWip,
    updateWipStatus,
    updateWipPriority,
    addTimelineEntry,
    toggleWipExpanded,
    clearAllData,
    parseCommand
  };
}
