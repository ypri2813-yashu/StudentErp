import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Compass,
  ArrowRight,
  BookOpen,
  FileCheck2,
  Clock,
  CheckCircle,
  HelpCircle,
  Bot,
  User,
  Mic,
  MicOff,
  Layers,
  Award,
  CreditCard,
  Maximize2,
  Minimize2,
  RotateCcw
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { ActiveTab, NavBotResponse } from '../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  targetRoute?: string | null;
  actionText?: string;
  filterParams?: Record<string, any>;
  timestamp: string;
}

export const AIChatbotAssistant: React.FC = () => {
  const {
    aiDrawerOpen,
    setAiDrawerOpen,
    activeTab,
    currentUser,
    executeAINavigation,
    setNotesFilter,
  } = usePortal();

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSimulatingVoice, setIsSimulatingVoice] = useState(false);
  const [activeCategoryView, setActiveCategoryView] = useState<'ALL' | 'NOTES' | 'OD' | 'ERP'>('ALL');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello ${currentUser.name}! I am Easwari NavBot, your Campus AI Navigation Assistant.\n\nI can take you directly to any page, notes, OD forms, or exam results. What would you like to open?`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (aiDrawerOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, aiDrawerOpen]);

  // Local Semantic Navigation Engine (Fail-safe, 0ms guarantee)
  const resolveNavigationLocally = (query: string): NavBotResponse => {
    const q = query.toLowerCase().trim();

    if (
      q.includes('note') ||
      q.includes('material') ||
      q.includes('ppt') ||
      q.includes('question') ||
      q.includes('unit') ||
      q.includes('handout') ||
      q.includes('pdf') ||
      q.includes('syllabus') ||
      q.includes('study')
    ) {
      if (q.includes('ml') || q.includes('machine learning')) {
        return {
          reply: 'Opening CS3551 Machine Learning notes by Dr. K. Meenakshi. Unit 1, Unit 2 slides and CAT-1 Question Bank are ready for download.',
          targetRoute: 'notes',
          actionText: 'Open Machine Learning Notes',
          filterParams: { subjectCode: 'CS3551' },
        };
      } else if (q.includes('cn') || q.includes('network')) {
        return {
          reply: 'Opening CS3591 Computer Networks notes. Physical and Data Link Layer materials are available.',
          targetRoute: 'notes',
          actionText: 'Open Computer Networks Notes',
          filterParams: { subjectCode: 'CS3591' },
        };
      } else if (q.includes('compiler') || q.includes('cd')) {
        return {
          reply: 'Opening CS3501 Compiler Design notes by Dr. S. Vignesh.',
          targetRoute: 'notes',
          actionText: 'Open Compiler Design Notes',
          filterParams: { subjectCode: 'CS3501' },
        };
      }
      return {
        reply: 'Navigating to Faculty Notes. Materials are organized by Department → Semester → Subject → Faculty → Units (1 to 5).',
        targetRoute: 'notes',
        actionText: 'Open Notes Module',
        filterParams: {},
      };
    }

    if (
      q.includes('apply od') ||
      q.includes('apply on-duty') ||
      q.includes('new od') ||
      q.includes('request od') ||
      q.includes('how do i apply') ||
      q.includes('apply for od') ||
      q.includes('leave')
    ) {
      return {
        reply: 'Opening the On-Duty (OD) application form. You can submit requests for Hackathons, Paper Presentations, Sports, or Symposia with event proof attached.',
        targetRoute: 'od-apply',
        actionText: 'Open OD Application Form',
        filterParams: {},
      };
    }

    if (
      q.includes('pending od') ||
      q.includes('track od') ||
      q.includes('od status') ||
      q.includes('my od') ||
      q.includes('on-duty') ||
      q.includes('od')
    ) {
      return {
        reply: 'Opening your On-Duty Status Tracker. You currently have 1 application forwarded to HOD (Smart India Hackathon) and 1 Approved (IEEE Conference with official pass ready).',
        targetRoute: 'od-track',
        actionText: 'View OD Status Tracker',
        filterParams: { status: 'Pending' },
      };
    }

    if (
      q.includes('attendance') ||
      q.includes('absent') ||
      q.includes('present') ||
      q.includes('percentage') ||
      q.includes('condonation') ||
      q.includes('att')
    ) {
      return {
        reply: 'Your overall attendance is 88.4% (94.2% with approved OD hours added). You are well above the 75% minimum threshold for Anna University autonomous exam eligibility.',
        targetRoute: 'attendance',
        actionText: 'Check Attendance Register',
        filterParams: {},
      };
    }

    if (
      q.includes('mark') ||
      q.includes('cat') ||
      q.includes('score') ||
      q.includes('cgpa') ||
      q.includes('grade') ||
      q.includes('exam') ||
      q.includes('result')
    ) {
      return {
        reply: 'Opening your Assessment marks. In CAT-1, you scored 44/50 in Machine Learning and 46/50 in Compiler Design. Your cumulative CGPA is 8.82 with 0 standing arrears.',
        targetRoute: 'marks',
        actionText: 'View Assessment Marks',
        filterParams: {},
      };
    }

    if (
      q.includes('timetable') ||
      q.includes('schedule') ||
      q.includes('period') ||
      q.includes('class time') ||
      q.includes('room') ||
      q.includes('when is')
    ) {
      return {
        reply: 'Opening your weekly 5th Semester CSE-B Timetable. Period 1 commences at 08:30 AM in Classroom CS-302 (TRP Building, 3rd Floor).',
        targetRoute: 'timetable',
        actionText: 'View Class Timetable',
        filterParams: {},
      };
    }

    if (
      q.includes('fee') ||
      q.includes('receipt') ||
      q.includes('tuition') ||
      q.includes('bus') ||
      q.includes('payment')
    ) {
      return {
        reply: 'Opening Fee Details. Your Odd Semester tuition fee (₹85,000) and Route 14 bus fee have been fully paid. Official digital receipts are ready to download.',
        targetRoute: 'fees',
        actionText: 'Open Fee Portal & Receipts',
        filterParams: {},
      };
    }

    if (
      q.includes('announcement') ||
      q.includes('notice') ||
      q.includes('circular') ||
      q.includes('seminar') ||
      q.includes('event')
    ) {
      return {
        reply: 'Opening Classroom Announcements. You have notices regarding CAT-1 Machine Learning exam portions and an upcoming Microsoft Guest Lecture on Generative AI.',
        targetRoute: 'announcements',
        actionText: 'View Announcements',
        filterParams: {},
      };
    }

    if (
      q.includes('profile') ||
      q.includes('reg') ||
      q.includes('roll') ||
      q.includes('mentor') ||
      q.includes('coordinator') ||
      q.includes('hod')
    ) {
      return {
        reply: 'Opening your ERP Student Profile: Harish Kumar S (Reg No: 310622104082, CSE-5B). Class Coordinator: Dr. S. Vignesh. Head of Department: Dr. G. S. Anandha Mala.',
        targetRoute: 'profile',
        actionText: 'View Student Profile',
        filterParams: {},
      };
    }

    if (
      q.includes('spring') ||
      q.includes('boot') ||
      q.includes('backend') ||
      q.includes('mysql') ||
      q.includes('architecture') ||
      q.includes('api') ||
      q.includes('mongo')
    ) {
      return {
        reply: 'Opening the Spring Boot 3.3.x + Spring Security + JWT + MySQL architecture blueprint and REST controller specifications.',
        targetRoute: 'architecture',
        actionText: 'View Spring Boot Architecture',
        filterParams: {},
      };
    }

    return {
      reply: 'Hello! I am Easwari NavBot, your Campus AI Navigation Assistant. You can ask me "Where are my notes?", "How do I apply OD?", "Show my pending ODs", or "Check attendance", and I will guide you immediately.',
      targetRoute: 'dashboard',
      actionText: 'Go to Dashboard',
      filterParams: {},
    };
  };

  const handleSend = async (queryToSend?: string) => {
    const query = (queryToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    const renderBotResult = (data: NavBotResponse) => {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Here is what you requested.',
        targetRoute: data.targetRoute,
        actionText: data.actionText,
        filterParams: data.filterParams,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);

      // Execute navigation immediately so the user doesn't even need an extra click
      if (data.targetRoute) {
        executeAINavigation(
          data.targetRoute as ActiveTab,
          data.filterParams,
          `NavBot: ${data.actionText || data.targetRoute}`
        );
      }
    };

    try {
      const res = await fetch('/api/ai/navigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          currentRole: currentUser.role,
          currentRoute: activeTab,
        }),
      });

      if (!res.ok) {
        throw new Error('API navigation fallback');
      }

      const data: NavBotResponse = await res.json();
      if (!data || !data.reply) {
        throw new Error('Invalid response structure');
      }
      renderBotResult(data);
    } catch (err) {
      console.warn('Network or AI API bypassed, using instant local navigation parser:', err);
      const localData = resolveNavigationLocally(query);
      renderBotResult(localData);
    } finally {
      setIsTyping(false);
    }
  };

  const simulateVoiceInput = (sampleQuery: string) => {
    setIsSimulatingVoice(true);
    setInputQuery(sampleQuery);
    setTimeout(() => {
      setIsSimulatingVoice(false);
      handleSend(sampleQuery);
    }, 1200);
  };

  if (!aiDrawerOpen) return null;

  // Easy 1-Click Destination Cards
  const destinationCards = [
    {
      title: 'Where are my notes?',
      subtitle: 'Open Notes page (Machine Learning Unit 1)',
      icon: <BookOpen className="w-5 h-5 text-blue-500" />,
      action: () => {
        executeAINavigation('notes', { subjectCode: 'CS3551', unit: 'Unit 1' }, 'Navigated to Machine Learning Notes');
        setMessages(prev => [
          ...prev,
          {
            id: `usr-${Date.now()}`,
            sender: 'user',
            text: 'Where are my notes?',
            timestamp: 'Just now',
          },
          {
            id: `bot-${Date.now()}`,
            sender: 'assistant',
            text: 'Opening your Faculty Notes module with CS3551 Machine Learning pre-selected! Unit 1, 2 slides and CAT-1 Question Bank are ready.',
            targetRoute: 'notes',
            actionText: 'View Machine Learning Notes',
            timestamp: 'Just now',
          },
        ]);
      },
    },
    {
      title: 'How do I apply OD?',
      subtitle: 'Open On-Duty Application form directly',
      icon: <FileCheck2 className="w-5 h-5 text-purple-500" />,
      action: () => {
        executeAINavigation('od-apply', {}, 'Opened On-Duty (OD) Application Form');
        setMessages(prev => [
          ...prev,
          {
            id: `usr-${Date.now()}`,
            sender: 'user',
            text: 'How do I apply OD?',
            timestamp: 'Just now',
          },
          {
            id: `bot-${Date.now()}`,
            sender: 'assistant',
            text: 'Opening the OD application form! Fill out your event details, attach the brochure/proof, and submit for Coordinator review.',
            targetRoute: 'od-apply',
            actionText: 'Open OD Form',
            timestamp: 'Just now',
          },
        ]);
      },
    },
    {
      title: 'Show my pending ODs',
      subtitle: 'Display current approval status & timeline',
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      action: () => {
        executeAINavigation('od-track', {}, 'Opened OD Status Tracker');
        setMessages(prev => [
          ...prev,
          {
            id: `usr-${Date.now()}`,
            sender: 'user',
            text: 'Show my pending ODs',
            timestamp: 'Just now',
          },
          {
            id: `bot-${Date.now()}`,
            sender: 'assistant',
            text: 'Opening your OD Status Tracker! Your Smart India Hackathon request is currently with HOD Dr. Anandha Mala for final sanction.',
            targetRoute: 'od-track',
            actionText: 'View OD Tracker',
            timestamp: 'Just now',
          },
        ]);
      },
    },
    {
      title: 'What is my attendance in ML?',
      subtitle: 'Check 90.0% attendance + 2 hrs approved OD',
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      action: () => {
        executeAINavigation('attendance', {}, 'Opened Attendance Breakdown');
        setMessages(prev => [
          ...prev,
          {
            id: `usr-${Date.now()}`,
            sender: 'user',
            text: 'What is my attendance in ML?',
            timestamp: 'Just now',
          },
          {
            id: `bot-${Date.now()}`,
            sender: 'assistant',
            text: 'Your attendance in CS3551 Machine Learning is 90.0% (36 attended / 40 conducted + 2 OD hours). Well above the Anna University 75% limit!',
            targetRoute: 'attendance',
            actionText: 'View Attendance Register',
            timestamp: 'Just now',
          },
        ]);
      },
    },
    {
      title: 'View Weekly Timetable',
      subtitle: 'Check Room CS-302 period schedule',
      icon: <Clock className="w-5 h-5 text-indigo-500" />,
      action: () => {
        executeAINavigation('timetable', {}, 'Opened Weekly Timetable');
      },
    },
    {
      title: 'View CAT-1 Exam Marks',
      subtitle: '44/50 in ML, 46/50 in Compiler Design',
      icon: <Award className="w-5 h-5 text-rose-500" />,
      action: () => {
        executeAINavigation('marks', {}, 'Opened CAT-1 Assessment Marks');
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Assistant Header */}
        <div className="p-4 bg-gradient-to-r from-[#0b2545] via-[#134074] to-[#0b2545] text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white">Easwari NavBot</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded uppercase">
                  AI Navigator
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Classroom ERP Easy Navigation Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() =>
                setMessages([
                  {
                    id: 'init-1',
                    sender: 'assistant',
                    text: `Hello ${currentUser.name}! I am Easwari NavBot. How can I guide you today?`,
                    timestamp: 'Just now',
                  },
                ])
              }
              title="Reset conversation"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAiDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 1-Click Fast Navigation Grid Section (Makes UI super easy!) */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Navigation Shortcuts</span>
            </span>
            <span className="text-[10px] text-slate-400">Click to jump immediately</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {destinationCards.slice(0, 4).map((card, idx) => (
              <button
                key={idx}
                onClick={card.action}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-xs transition-all text-left flex items-start gap-2.5 cursor-pointer group"
              >
                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {card.title}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {card.subtitle}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat / Interaction Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-[#0b2545] text-white rounded-br-xs dark:bg-amber-500 dark:text-slate-950 font-medium'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                {/* Direct in-app navigation action button */}
                {msg.targetRoute && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <button
                      onClick={() =>
                        executeAINavigation(
                          msg.targetRoute as ActiveTab,
                          msg.filterParams,
                          `Opened ${msg.actionText || msg.targetRoute}`
                        )
                      }
                      className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-xs cursor-pointer group"
                    >
                      <Compass className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
                      <span>{msg.actionText || `Open Page`}</span>
                      <ArrowRight className="w-3 h-3 ml-0.5" />
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ✓ Instant Router
                    </span>
                  </div>
                )}

                <span
                  className={`text-[9px] block text-right ${
                    msg.sender === 'user' ? 'text-slate-300 dark:text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2.5 items-center text-slate-400 text-xs">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-2xl flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse delay-150"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse delay-300"></span>
                <span className="text-[10px] text-slate-400 ml-1">NavBot thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice Query Simulator Bar */}
        <div className="px-4 py-2 bg-slate-50/80 dark:bg-slate-850 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px]">
          <span className="text-slate-500 flex items-center gap-1">
            <Mic className="w-3.5 h-3.5 text-amber-500" />
            <span>Voice prompt simulations:</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => simulateVoiceInput('Where are my notes?')}
              className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-amber-500 cursor-pointer text-[10px]"
            >
              "Where are my notes?"
            </button>
            <button
              onClick={() => simulateVoiceInput('How do I apply OD?')}
              className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-amber-500 cursor-pointer text-[10px]"
            >
              "Apply OD"
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything (e.g. 'Show pending ODs', 'Check ML marks')..."
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
            <span>Commands automatically navigate & filter the page</span>
            <span>Easwari Campus AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};
