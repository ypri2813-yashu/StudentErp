import React, { useState } from 'react';
import {
  Upload,
  BookOpen,
  Megaphone,
  Users,
  CheckCircle,
  FileText,
  Plus,
  Download,
  Trash2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { NoteCategory } from '../types';

export const DashboardTeacher: React.FC = () => {
  const { currentUser, notes, addNote, deleteNote, addAnnouncement, setActiveTab, setNotesFilter } = usePortal();

  // State for Upload Note Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('CS3551');
  const [newSubjectName, setNewSubjectName] = useState('Machine Learning');
  const [newUnit, setNewUnit] = useState('Unit 1');
  const [newCategory, setNewCategory] = useState<NoteCategory>('Lecture Notes');
  const [newDescription, setNewDescription] = useState('');
  const [newFileType, setNewFileType] = useState<'pdf' | 'ppt' | 'doc'>('pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for Post Announcement Modal
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<'Assignment' | 'Test Schedule' | 'Lab' | 'Important Notice'>('Test Schedule');
  const [annPriority, setAnnPriority] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');
  const [annTargetSection, setAnnTargetSection] = useState('B');

  // Filter notes uploaded by this faculty
  const myNotes = notes.filter(n => n.facultyId === currentUser.id || n.facultyName.includes('Meenakshi'));
  const totalDownloads = myNotes.reduce((acc, curr) => acc + (curr.downloadCount || 0), 0);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await addNote({
        title: newTitle,
        subjectCode: newSubjectCode,
        subjectName: newSubjectName,
        department: currentUser.department,
        semester: 5,
        unit: newUnit,
        facultyName: currentUser.name,
        facultyId: currentUser.id,
        fileType: newFileType,
        fileSize: `${(Math.random() * 5 + 1.2).toFixed(1)} MB`,
        category: newCategory,
        description: newDescription || `Unit notes uploaded by ${currentUser.name} for 5th Semester students.`,
        tags: [newSubjectName, newUnit, 'EEC Lecture Note', 'Easwari Autonomous'],
      });

      // Reset
      setNewTitle('');
      setNewDescription('');
      setShowUploadModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnnounceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    try {
      await addAnnouncement({
        title: annTitle,
        content: annContent,
        category: annCategory,
        priority: annPriority,
        targetAudience: {
          department: currentUser.department,
          semester: 5,
          section: annTargetSection,
          subject: 'Machine Learning',
        },
      });

      setAnnTitle('');
      setAnnContent('');
      setShowAnnounceModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Teacher Banner */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#1b4332] to-[#081c15] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Subject Teacher Portal • Dept of Computer Science & Engineering</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome, {currentUser.name} 🎓
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Manage unit-wise course notes, question banks, assignment handouts, and class notices for your assigned autonomous batches.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Notes / Handouts</span>
            </button>
            <button
              onClick={() => setShowAnnounceModal(true)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs border border-white/20 transition-all cursor-pointer"
            >
              <Megaphone className="w-4 h-4" />
              <span>Post Announcement</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Assigned Subjects
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {currentUser.assignedSubjects?.length || 3}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            CS3551 (ML), CS3591 (CN), CS3601 (DL)
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Uploaded Materials
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {myNotes.length}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            Units 1 & 2 + Question Banks
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Student Downloads
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalDownloads}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Across CSE-5A & CSE-5B
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            CAT-1 Portions Status
          </div>
          <div className="mt-2 text-xl font-bold text-emerald-600 dark:text-emerald-400">
            Syllabus Covered
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Question bank published
          </div>
        </div>
      </div>

      {/* Assigned Subjects Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">
          My Teaching Allocations & Course Units
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentUser.assignedSubjects?.map(sub => (
            <div
              key={sub.code}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all bg-slate-50/50 dark:bg-slate-800/40"
            >
              <div className="flex items-center justify-between">
                <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-bold text-xs px-2 py-0.5 rounded">
                  {sub.code}
                </span>
                <span className="text-xs text-slate-500">
                  Sem {sub.sem} • Sec {sub.section}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-2">
                {sub.name}
              </h4>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 dark:border-slate-700/60 pt-2">
                <span>62 Students</span>
                <button
                  onClick={() => {
                    setNotesFilter(prev => ({ ...prev, subjectCode: sub.code }));
                    setActiveTab('notes');
                  }}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                >
                  View uploaded notes →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Uploaded Materials Management List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Faculty Uploaded Materials
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Students in CSE-B will see these files in their Notes tab
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New File</span>
          </button>
        </div>

        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {myNotes.map(note => (
            <div key={note.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white text-xs truncate">
                      {note.title}
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] px-1.5 py-0.2 rounded font-mono">
                      {note.unit}
                    </span>
                    <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.2 rounded font-medium">
                      {note.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {note.subjectCode} - {note.subjectName} • Uploaded on {note.uploadDate} • {note.fileSize} • {note.downloadCount} downloads
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => deleteNote(note.id)}
                  title="Remove File"
                  className="p-1.5 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400">
                  <Upload className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Upload Course Material / Notes
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Material Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 3: Unsupervised Learning & Clustering Algorithms"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={newSubjectCode}
                    onChange={e => {
                      setNewSubjectCode(e.target.value);
                      if (e.target.value === 'CS3551') setNewSubjectName('Machine Learning');
                      if (e.target.value === 'CS3591') setNewSubjectName('Computer Networks');
                      if (e.target.value === 'CS3601') setNewSubjectName('Deep Learning');
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="CS3551">CS3551 - Machine Learning</option>
                    <option value="CS3591">CS3591 - Computer Networks</option>
                    <option value="CS3601">CS3601 - Deep Learning</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unit / Module
                  </label>
                  <select
                    value={newUnit}
                    onChange={e => setNewUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Unit 1">Unit 1</option>
                    <option value="Unit 2">Unit 2</option>
                    <option value="Unit 3">Unit 3</option>
                    <option value="Unit 4">Unit 4</option>
                    <option value="Unit 5">Unit 5</option>
                    <option value="All Units">All Units (Complete Syllabus)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Material Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as NoteCategory)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="Question Bank">Question Bank</option>
                    <option value="Important Questions">Important Questions</option>
                    <option value="Assignment Handout">Assignment Handout</option>
                    <option value="Lab Manual">Lab Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    File Format
                  </label>
                  <select
                    value={newFileType}
                    onChange={e => setNewFileType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="ppt">PowerPoint Presentation (.ppt/.pptx)</option>
                    <option value="doc">Word / Handout (.doc/.docx)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Topics Included
                </label>
                <textarea
                  rows={3}
                  placeholder="Key concepts covered, solved problems, exam hints..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Simulated File Dropper */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center bg-slate-50 dark:bg-slate-800/50">
                <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                <p className="text-slate-700 dark:text-slate-300 font-medium text-xs">
                  Drag and drop PDF/PPT document or click to browse
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Max file size: 25 MB • EEC College Cloud Storage
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Uploading...' : 'Publish to Students'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnounceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Post Announcement to Class
              </h3>
              <button
                onClick={() => setShowAnnounceModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAnnounceSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CAT-1 Machine Learning - Room CS-302 seating arrangement"
                  value={annTitle}
                  onChange={e => setAnnTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={annCategory}
                    onChange={e => setAnnCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Test Schedule">Test Schedule</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Lab">Lab Notice</option>
                    <option value="Important Notice">Important Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={annPriority}
                    onChange={e => setAnnPriority(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Section
                  </label>
                  <select
                    value={annTargetSection}
                    onChange={e => setAnnTargetSection(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="B">CSE - Section B</option>
                    <option value="A">CSE - Section A</option>
                    <option value="ALL">All Sections (A & B)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Message Content *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type announcement details for the students..."
                  value={annContent}
                  onChange={e => setAnnContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAnnounceModal(false)}
                  className="px-4 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-bold bg-amber-500 hover:bg-amber-400 text-slate-950"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
