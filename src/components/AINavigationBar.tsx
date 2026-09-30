import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Search,
  BookOpen,
  FileCheck2,
  Clock,
  CheckCircle,
  Award,
  ArrowRight,
  Bot,
  Command,
  X
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { ActiveTab } from '../types';

export const AINavigationBar: React.FC = () => {
  const { executeAINavigation, setAiDrawerOpen, currentUser } = usePortal();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcut: '/' or 'Ctrl+K' focuses this AI Navigation Bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key === 'k')) &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const q = query.toLowerCase().trim();

    // Instant local routing for standard queries
    if (q.includes('note') || q.includes('material') || q.includes('unit') || q.includes('ppt') || q.includes('book')) {
      if (q.includes('ml') || q.includes('machine learning')) {
        executeAINavigation('notes', { subjectCode: 'CS3551' }, 'Navigated to Machine Learning Notes (Dr. K. Meenakshi)');
      } else if (q.includes('cn') || q.includes('network')) {
        executeAINavigation('notes', { subjectCode: 'CS3591' }, 'Navigated to Computer Networks Notes');
      } else {
        executeAINavigation('notes', {}, 'Navigated to Faculty Notes Management');
      }
    } else if (q.includes('apply od') || q.includes('apply on-duty') || q.includes('new od') || q.includes('request od')) {
      executeAINavigation('od-apply', {}, 'Opened On-Duty (OD) Application Form');
    } else if (q.includes('pending od') || q.includes('track od') || q.includes('od status') || q.includes('my od')) {
      executeAINavigation('od-track', {}, 'Opened OD Tracking & Status Timeline');
    } else if (q.includes('attendance') || q.includes('present') || q.includes('absent') || q.includes('condonation')) {
      executeAINavigation('attendance', {}, 'Opened Attendance Register & OD Hours Credit');
    } else if (q.includes('timetable') || q.includes('schedule') || q.includes('period') || q.includes('class time')) {
      executeAINavigation('timetable', {}, 'Opened Weekly Class Timetable (CS-302)');
    } else if (q.includes('mark') || q.includes('score') || q.includes('cat') || q.includes('cgpa')) {
      executeAINavigation('marks', {}, 'Opened CAT-1 Assessment Marks & University Scores');
    } else if (q.includes('fee') || q.includes('receipt') || q.includes('tuition')) {
      executeAINavigation('fees', {}, 'Opened College Fee Portal & Receipts');
    } else if (q.includes('announcement') || q.includes('notice') || q.includes('circular')) {
      executeAINavigation('announcements', {}, 'Opened Classroom Announcements & Notices');
    } else {
      // Pass to server AI endpoint
      try {
        const res = await fetch('/api/ai/navigate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q, currentRole: currentUser.role }),
        });
        const data = await res.json();
        if (data.targetRoute) {
          executeAINavigation(data.targetRoute as ActiveTab, data.filterParams, data.reply);
        } else {
          setAiDrawerOpen(true);
        }
      } catch (err) {
        setAiDrawerOpen(true);
      }
    }

    setQuery('');
    inputRef.current?.blur();
  };

  const quickNavShortcuts = [
    {
      label: 'Where are my notes?',
      icon: <BookOpen className="w-3.5 h-3.5 text-blue-500" />,
      onClick: () => executeAINavigation('notes', { subjectCode: 'CS3551' }, 'Navigated to Machine Learning Notes'),
    },
    {
      label: 'How do I apply OD?',
      icon: <FileCheck2 className="w-3.5 h-3.5 text-purple-500" />,
      onClick: () => executeAINavigation('od-apply', {}, 'Opened On-Duty (OD) Application Form'),
    },
    {
      label: 'Show my pending ODs',
      icon: <Clock className="w-3.5 h-3.5 text-amber-500" />,
      onClick: () => executeAINavigation('od-track', {}, 'Filtered to Pending & Active OD Requests'),
    },
    {
      label: 'Check My Attendance',
      icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />,
      onClick: () => executeAINavigation('attendance', {}, 'Opened Subject-Wise Attendance (94.2% with OD)'),
    },
    {
      label: 'View Timetable',
      icon: <Clock className="w-3.5 h-3.5 text-indigo-500" />,
      onClick: () => executeAINavigation('timetable', {}, 'Opened Class Timetable for Room CS-302'),
    },
  ];

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-purple-500/10 dark:from-amber-500/5 dark:via-blue-500/5 dark:to-purple-500/5 border-b border-slate-200/80 dark:border-slate-800/80 py-3 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar Input */}
        <div className="flex-1 max-w-2xl relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center pointer-events-none text-amber-500">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                placeholder='Ask AI Navigator: "Where are my notes?", "How do I apply OD?", "Show my pending ODs"...'
                className="w-full pl-10 pr-24 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 shadow-xs transition-all"
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                    <Command className="w-2.5 h-2.5" /> K
                  </kbd>
                )}
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-[11px] shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <span>Go</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* 1-Click Fast Navigation Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Quick Actions:
          </span>
          {quickNavShortcuts.map((chip, idx) => (
            <button
              key={idx}
              onClick={chip.onClick}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/60 hover:text-amber-600 dark:hover:text-amber-400 hover:shadow-xs transition-all shrink-0 cursor-pointer"
            >
              {chip.icon}
              <span>{chip.label}</span>
            </button>
          ))}
          <button
            onClick={() => setAiDrawerOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#0b2545] text-amber-300 hover:bg-[#134074] dark:bg-amber-500 dark:text-slate-950 shrink-0 cursor-pointer shadow-xs transition-colors"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Chat AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
