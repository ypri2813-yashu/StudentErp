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
  MessageSquare,
  Bot,
  User,
  ExternalLink
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
  const { aiDrawerOpen, setAiDrawerOpen, activeTab, setActiveTab, currentUser, setNotesFilter } = usePortal();

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Vanakkam ${currentUser.name}! I am Easwari NavBot, your Campus AI Navigation Assistant. Ask me anything like "Where are my notes?", "How do I apply OD?", or "What is my attendance in ML?".`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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

      const data: NavBotResponse = await res.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'I found what you were looking for.',
        targetRoute: data.targetRoute,
        actionText: data.actionText,
        filterParams: data.filterParams,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);

      // If user query is an explicit direct navigation request, also auto-navigate:
      if (data.targetRoute) {
        if (data.filterParams?.subjectCode) {
          setNotesFilter(prev => ({ ...prev, subjectCode: data.filterParams?.subjectCode }));
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: "I couldn't connect right now, but you can navigate using the top tabs above.",
          timestamp: 'Now',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const executeAction = (route: string, filterParams?: Record<string, any>) => {
    if (filterParams?.subjectCode) {
      setNotesFilter(prev => ({ ...prev, subjectCode: filterParams.subjectCode }));
    }
    setActiveTab(route as ActiveTab);
  };

  if (!aiDrawerOpen) return null;

  const quickPills = [
    'Where are my notes?',
    'How do I apply OD?',
    'Show my pending ODs',
    'What is my attendance in ML?',
    'When is CAT-2 exam?',
    'View Fee Receipts',
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        {/* Assistant Header */}
        <div className="p-4 bg-gradient-to-r from-[#0b2545] to-[#134074] text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                <span>Easwari NavBot</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Classroom ERP Navigation Assistant
              </p>
            </div>
          </div>

          <button
            onClick={() => setAiDrawerOpen(false)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestion Pills */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Quick Prompts:
          </span>
          <div className="flex items-center gap-1.5 min-w-max">
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(pill)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer shadow-2xs"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Stream */}
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
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <button
                      onClick={() => executeAction(msg.targetRoute!, msg.filterParams)}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-xs cursor-pointer group"
                    >
                      <Compass className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
                      <span>{msg.actionText || `Open ${msg.targetRoute.toUpperCase()}`}</span>
                      <ArrowRight className="w-3 h-3 ml-0.5" />
                    </button>
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
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
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
              placeholder="Ask NavBot where to go or check attendance..."
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
          <p className="text-[10px] text-slate-400 text-center mt-1.5">
            Powered by Easwari AI Studio • Natural Navigation & ERP Routing
          </p>
        </div>
      </div>
    </div>
  );
};
