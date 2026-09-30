import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Calendar,
  AlertCircle,
  FileText,
  Filter,
  Users,
  Tag,
  Paperclip,
  CheckCircle2,
  BellRing
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { AnnouncementCategory } from '../types';

export const AnnouncementsModule: React.FC = () => {
  const { announcements, currentUser, addAnnouncement } = usePortal();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('Test Schedule');
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');
  const [section, setSection] = useState('B');
  const [subject, setSubject] = useState('Machine Learning');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredAnnouncements = announcements.filter(ann => {
    if (categoryFilter !== 'ALL' && ann.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await addAnnouncement({
        title,
        content,
        category,
        priority,
        targetAudience: {
          department: currentUser.department,
          semester: 5,
          section: section,
          subject: subject,
        },
      });

      setTitle('');
      setContent('');
      setShowAddModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#1f3a60] to-[#122c4d] rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-400/30 mb-2">
              <Megaphone className="w-3.5 h-3.5" />
              <span>Targeted Classroom Notices & Schedules</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Announcements & Circulars
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Subject teachers and class coordinators post targeted notifications regarding assignment deadlines, CAT-1 schedules, lab instructions, and technical seminars.
            </p>
          </div>

          {(currentUser.role === 'TEACHER' || currentUser.role === 'MENTOR' || currentUser.role === 'HOD') && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Broadcast New Notice</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="font-bold text-slate-400 uppercase text-[11px] mr-1">Filter By:</span>
          {['ALL', 'Test Schedule', 'Assignment', 'Lab', 'Seminar', 'Important Notice'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong>{filteredAnnouncements.length}</strong> active circulars
        </div>
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {filteredAnnouncements.map(ann => (
          <div
            key={ann.id}
            className={`p-5 rounded-xl border transition-all bg-white dark:bg-slate-900 shadow-xs space-y-3 ${
              ann.priority === 'URGENT'
                ? 'border-rose-300 dark:border-rose-900/60 ring-1 ring-rose-400/20'
                : ann.priority === 'HIGH'
                ? 'border-amber-300 dark:border-amber-900/60'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase ${
                  ann.priority === 'URGENT'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
                    : ann.priority === 'HIGH'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                }`}>
                  {ann.category}
                </span>

                {ann.priority === 'URGENT' && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900/40">
                    <AlertCircle className="w-3 h-3" />
                    <span>Urgent Action Required</span>
                  </span>
                )}

                <span className="text-xs text-slate-400">
                  Target: <strong>{ann.targetAudience.department} (Sec {ann.targetAudience.section})</strong>
                  {ann.targetAudience.subject && ` • ${ann.targetAudience.subject}`}
                </span>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{ann.date}</span>
              </div>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {ann.title}
            </h3>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {ann.content}
            </p>

            {ann.attachments && ann.attachments.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {ann.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>{att.name} ({att.size})</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>
                Posted by: <strong>{ann.authorName}</strong> ({ann.authorRole})
              </span>
              <span className="text-[11px] text-slate-400">
                Easwari Classroom Notification Dispatcher
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Announcement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Broadcast New Class Notice
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab Manual Submission & Viva Date for Machine Learning"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Test Schedule">Test Schedule</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Lab">Lab Instructions</option>
                    <option value="Seminar">Seminar Information</option>
                    <option value="Important Notice">Important Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent Action Alert</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Class / Section
                  </label>
                  <select
                    value={section}
                    onChange={e => setSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="B">CSE 5th Sem - Section B</option>
                    <option value="A">CSE 5th Sem - Section A</option>
                    <option value="ALL">All Sections (A & B)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject Mapping
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Machine Learning">CS3551 Machine Learning</option>
                    <option value="Computer Networks">CS3591 Computer Networks</option>
                    <option value="Compiler Design">CS3501 Compiler Design</option>
                    <option value="Cloud Computing">CS3511 Cloud Computing</option>
                    <option value="General">General / All Subjects</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notice Content *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type clear instructions for the students..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-50"
                >
                  {isSubmitting ? 'Publishing...' : 'Broadcast to Students'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
