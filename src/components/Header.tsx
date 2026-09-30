import React from 'react';
import {
  GraduationCap,
  BookOpen,
  CalendarDays,
  FileCheck2,
  Megaphone,
  Sparkles,
  Sun,
  Moon,
  Clock,
  CheckCircle,
  FileText,
  UserCheck,
  Building2,
  Code2,
  Award,
  ChevronDown
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { ActiveTab } from '../types';

export const Header: React.FC = () => {
  const {
    currentUser,
    setCurrentUserById,
    availableUsers,
    darkMode,
    toggleDarkMode,
    activeTab,
    setActiveTab,
    setAiDrawerOpen,
    odRequests,
    announcements,
  } = usePortal();

  // Pending count for Mentor / HOD
  const pendingODCount = odRequests.filter(o => {
    if (currentUser.role === 'MENTOR') return o.status === 'Under Mentor Review';
    if (currentUser.role === 'HOD') return o.status === 'Forwarded to HOD';
    return false;
  }).length;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number; group: 'classroom' | 'erp' | 'tech' }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Building2 className="w-4 h-4" />, group: 'classroom' },
    { id: 'notes', label: 'Faculty Notes', icon: <BookOpen className="w-4 h-4" />, group: 'classroom' },
    { id: 'od-track', label: 'OD Management', icon: <FileCheck2 className="w-4 h-4" />, badge: pendingODCount > 0 ? pendingODCount : undefined, group: 'classroom' },
    { id: 'announcements', label: 'Announcements', icon: <Megaphone className="w-4 h-4" />, badge: announcements.length > 0 ? announcements.length : undefined, group: 'classroom' },
    { id: 'timetable', label: 'Timetable', icon: <Clock className="w-4 h-4" />, group: 'erp' },
    { id: 'attendance', label: 'Attendance', icon: <CheckCircle className="w-4 h-4" />, group: 'erp' },
    { id: 'marks', label: 'Marks & CAT', icon: <Award className="w-4 h-4" />, group: 'erp' },
    { id: 'fees', label: 'Fees & Receipts', icon: <FileText className="w-4 h-4" />, group: 'erp' },
    { id: 'profile', label: 'Student Profile', icon: <UserCheck className="w-4 h-4" />, group: 'erp' },
    { id: 'architecture', label: 'Spring Boot Architecture', icon: <Code2 className="w-4 h-4" />, group: 'tech' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      {/* College Identity Bar */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#134074] to-[#0b2545] text-white px-4 py-2 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-slate-900 text-sm shadow-xs border border-amber-300">
              EEC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wide text-amber-400 uppercase text-[13px]">
                  Easwari Engineering College
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-400/30">
                  Autonomous | NAAC 'A' Grade
                </span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Classroom Management System • Extension Layer Integrated with College ERP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ERP Sync Active</span>
              <span className="text-slate-500">|</span>
              <span>Anna Univ Reg. 2023</span>
            </div>

            {/* AI Assistant Quick Trigger */}
            <button
              onClick={() => setAiDrawerOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-3 py-1 rounded-md text-xs shadow-sm hover:shadow transition-all group cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950 group-hover:rotate-12 transition-transform" />
              <span>Easwari NavBot</span>
              <span className="bg-slate-950/20 px-1.5 py-0.2 rounded text-[10px]">AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar: User Profile, Role Switcher & Dark Mode */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Role Switcher Pill */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-xs">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/50"
              />
              <div className="text-left text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <span>{currentUser.name}</span>
                  <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded uppercase ${
                    currentUser.role === 'STUDENT'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                      : currentUser.role === 'TEACHER'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                      : currentUser.role === 'MENTOR'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {currentUser.role === 'STUDENT' ? `CSE 5B • Reg: ${currentUser.registerNumber}` : currentUser.designation}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Quick Switch Dropdown */}
            <div className="absolute left-0 mt-1 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 hidden group-hover:block hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                Switch Role / Persona Preview
              </div>
              <div className="space-y-1">
                {availableUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => setCurrentUserById(user.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                      currentUser.id === user.id
                        ? 'bg-amber-500/10 text-amber-900 dark:text-amber-300 font-medium'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <img src={user.avatar} className="w-7 h-7 rounded-full object-cover" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{user.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {user.role} • {user.designation || user.department}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls: Theme Toggle & Quick Help */}
        <div className="flex items-center gap-2">
          {/* Dark/Light Mode Switcher */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700/80 cursor-pointer"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Categorized Navigation Tabs */}
      <div className="bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-slate-800/80 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 py-1.5 min-w-max">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 px-1">
            Classroom:
          </span>
          {navItems
            .filter(item => item.group === 'classroom')
            .map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative cursor-pointer ${
                    isActive
                      ? 'bg-[#0b2545] text-white shadow-xs dark:bg-amber-500 dark:text-slate-950'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 bg-amber-500 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-2" />

          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 px-1">
            ERP Sync:
          </span>
          {navItems
            .filter(item => item.group === 'erp')
            .map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs dark:bg-blue-600 dark:text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-2" />

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-purple-600 text-white'
                : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Spring Boot Architecture</span>
          </button>
        </div>
      </div>
    </header>
  );
};
