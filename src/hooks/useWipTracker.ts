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
  weight: number;
  tags: string[];
  lastUpdated: Date;
  timeline: WipTimelineEntry[];
}

export interface ParsedCommand {
  title: string;
  tags: string[];
  estimate: string | null;
  weight: number;
}

const initialWips: Wip[] = [
  {
    id: 1,
    title: "Build Stripe refund webhook",
    status: "Active",
    timeStarted: "2 hours ago",
    estimate: "2h",
    weight: 8,
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
    weight: 5,
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
    weight: 6,
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

  const parseCommand = (input: string): ParsedCommand => {
    const tagRegex = /#(\w+)/g;
    const timeRegex = /~(\d+[hmd])/g;
    const weightRegex = /w(\d+)/g;
    
    const tags = [...input.matchAll(tagRegex)].map(match => match[1]);
    const timeMatch = input.match(timeRegex);
    const weightMatch = input.match(weightRegex);
    const estimate = timeMatch ? timeMatch[0].slice(1) : null;
    const weight = weightMatch ? parseInt(weightMatch[0].slice(1)) : 5;
    
    const cleanTitle = input
      .replace(tagRegex, '')
      .replace(timeRegex, '')
      .replace(weightRegex, '')
      .trim();
    
    return { title: cleanTitle, tags, estimate, weight };
  };

  const addWip = (input: string) => {
    if (!input.trim()) return;
    
    const { title, tags, estimate, weight } = parseCommand(input);
    
    const newWip: Wip = {
      id: Date.now(),
      title,
      status: "Active",
      timeStarted: "Just now",
      estimate: estimate || undefined,
      weight,
      tags,
      lastUpdated: new Date(),
      timeline: []
    };

    setWips(prev => [newWip, ...prev]);
  };

  const updateWipStatus = (id: number, newStatus: Wip['status']) => {
    setWips(prev => prev.map(wip => 
      wip.id === id ? { ...wip, status: newStatus, lastUpdated: new Date() } : wip
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
    addTimelineEntry,
    toggleWipExpanded,
    parseCommand
  };
}
