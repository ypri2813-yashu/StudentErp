import React from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Header } from './components/Header';
import { DashboardStudent } from './components/DashboardStudent';
import { DashboardTeacher } from './components/DashboardTeacher';
import { DashboardMentor } from './components/DashboardMentor';
import { DashboardHOD } from './components/DashboardHOD';
import { FacultyNotesModule } from './components/FacultyNotesModule';
import { ODManagementModule } from './components/ODManagementModule';
import { AnnouncementsModule } from './components/AnnouncementsModule';
import { ERPModulesView } from './components/ERPModulesView';
import { ArchitectureView } from './components/ArchitectureView';
import { AIChatbotAssistant } from './components/AIChatbotAssistant';
import { Sparkles, Bot } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, currentUser, setAiDrawerOpen } = usePortal();

  const renderDashboardByRole = () => {
    switch (currentUser.role) {
      case 'STUDENT':
        return <DashboardStudent />;
      case 'TEACHER':
        return <DashboardTeacher />;
      case 'MENTOR':
        return <DashboardMentor />;
      case 'HOD':
        return <DashboardHOD />;
      default:
        return <DashboardStudent />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && renderDashboardByRole()}
        {activeTab === 'notes' && <FacultyNotesModule />}
        {(activeTab === 'od-apply' || activeTab === 'od-track') && <ODManagementModule />}
        {activeTab === 'announcements' && <AnnouncementsModule />}
        {(activeTab === 'timetable' ||
          activeTab === 'attendance' ||
          activeTab === 'marks' ||
          activeTab === 'fees' ||
          activeTab === 'profile') && <ERPModulesView />}
        {activeTab === 'architecture' && <ArchitectureView />}
      </main>

      {/* Floating AI Assistant Trigger */}
      <button
        onClick={() => setAiDrawerOpen(true)}
        aria-label="Open Easwari NavBot AI Navigation Assistant"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-4 py-3 rounded-full shadow-2xl hover:shadow-amber-500/25 transition-all transform hover:scale-105 group cursor-pointer border border-amber-300"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-950"></span>
        </span>
        <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-extrabold tracking-wide">NavBot AI</span>
      </button>

      {/* Slide-out AI Navigation Drawer */}
      <AIChatbotAssistant />

      {/* Institutional Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 px-4 text-xs text-slate-500 dark:text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#0b2545] text-amber-400 font-bold flex items-center justify-center text-[10px]">
              EEC
            </div>
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Easwari Engineering College (Autonomous)
              </span>{' '}
              • Bharathi Salai, Ramapuram, Chennai - 600 089
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Affiliated to Anna University</span>
            <span>•</span>
            <span>NAAC 'A' Grade Accredited</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">ERP Layer Sync: Healthy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <PortalProvider>
      <MainContent />
    </PortalProvider>
  );
}
