import { useState } from 'react';

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

const initialWips: Wip[] = [
  {
    id: 1,
    title: "Build Stripe refund webhook",
    status: "Active",
    timeStarted: "2 hours ago",
    estimate: "2h",
    priority: 0, // P0 - highest priority
    tags: ["backend", "urgent"],
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
    timeline: [
      {
        id: 1,
        text: "Set up endpoint structure, need to handle edge cases",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 2,
        text: "Added basic error handling and validation",
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      }
    ]
  },
  {
    id: 2,
    title: "Fix mobile responsive header",
    status: "Paused",
    timeStarted: "Yesterday",
    estimate: "1h",
    priority: 2, // P2 - medium priority
    tags: ["frontend", "bug"],
    lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000),
    timeline: [
      {
        id: 1,
        text: "Identified the flexbox issue causing header collapse on mobile",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: 3,
    title: "Write API documentation",
    status: "Done",
    timeStarted: "3 days ago",
    estimate: "3h",
    priority: 1, // P1 - high priority
    tags: ["docs"],
    lastUpdated: new Date(Date.now() - 30 * 60 * 1000),
    timeline: [
      {
        id: 1,
        text: "Completed auth section, working on endpoints",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        text: "Added examples for all endpoints",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: 3,
        text: "Final review and publishing to team",
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      }
    ]
  }
];

export function useWipTracker() {
  const [wips, setWips] = useState<Wip[]>(initialWips);
  const [expandedWips, setExpandedWips] = useState<Record<number, boolean>>({});

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
      id: Date.now(),
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

  const addTimelineEntry = (wipId: number, text: string) => {
    if (!text.trim()) return;

    const newTimelineEntry: WipTimelineEntry = {
      id: Date.now(),
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
    parseCommand
  };
}
