import React, { useState } from 'react';
import {
  BookOpen,
  Filter,
  Search,
  Download,
  FileText,
  Upload,
  Calendar,
  Layers,
  CheckCircle2,
  ExternalLink,
  Tag,
  Sparkles,
  Eye,
  FileCode
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { NoteCategory, NoteItem } from '../types';

export const FacultyNotesModule: React.FC = () => {
  const { notes, currentUser, addNote, notesFilter, setNotesFilter } = usePortal();

  const [selectedNoteForPreview, setSelectedNoteForPreview] = useState<NoteItem | null>(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('CS3551');
  const [newSubjectName, setNewSubjectName] = useState('Machine Learning');
  const [newUnit, setNewUnit] = useState('Unit 1');
  const [newCategory, setNewCategory] = useState<NoteCategory>('Lecture Notes');
  const [newDescription, setNewDescription] = useState('');
  const [newFileType, setNewFileType] = useState<'pdf' | 'ppt' | 'doc'>('pdf');
  const [newTags, setNewTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    'Computer Science and Engineering',
    'Information Technology',
    'Artificial Intelligence and Data Science',
    'Electronics and Communication Engineering',
    'Mechanical Engineering',
  ];

  const subjectsBySem5: Record<string, string> = {
    'CS3551': 'Machine Learning',
    'CS3591': 'Computer Networks',
    'CS3501': 'Compiler Design',
    'CS3511': 'Cloud Computing Architecture',
  };

  const handleDownload = (note: NoteItem) => {
    note.downloadCount = (note.downloadCount || 0) + 1;
    setDownloadSuccessToast(`Downloading "${note.title}" (${note.fileSize})...`);
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 3500);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await addNote({
        title: newTitle,
        subjectCode: newSubjectCode,
        subjectName: newSubjectName,
        department: notesFilter.department,
        semester: Number(notesFilter.semester) || 5,
        unit: newUnit,
        facultyName: currentUser.name,
        facultyId: currentUser.id,
        fileType: newFileType,
        fileSize: `${(Math.random() * 4 + 1.5).toFixed(1)} MB`,
        category: newCategory,
        description: newDescription || `Official subject notes published by ${currentUser.name}.`,
        tags: newTags ? newTags.split(',').map(t => t.trim()) : [newSubjectName, newUnit],
      });

      setNewTitle('');
      setNewDescription('');
      setNewTags('');
      setShowUploadModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter notes based on cascading drilldown
  const filteredNotes = notes.filter(n => {
    if (notesFilter.department && notesFilter.department !== 'ALL' && n.department !== notesFilter.department) {
      return false;
    }
    if (notesFilter.semester && notesFilter.semester !== 'ALL' && n.semester !== Number(notesFilter.semester)) {
      return false;
    }
    if (notesFilter.subjectCode && notesFilter.subjectCode !== 'ALL' && n.subjectCode !== notesFilter.subjectCode) {
      return false;
    }
    if (notesFilter.unit && notesFilter.unit !== 'ALL' && n.unit !== notesFilter.unit && n.unit !== 'All Units') {
      return false;
    }
    if (notesFilter.category && notesFilter.category !== 'ALL' && n.category !== notesFilter.category) {
      return false;
    }
    if (notesFilter.search) {
      const q = notesFilter.search.toLowerCase();
      const match =
        n.title.toLowerCase().includes(q) ||
        n.subjectName.toLowerCase().includes(q) ||
        n.facultyName.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-2 duration-200">
          <Download className="w-5 h-5 animate-bounce" />
          <span className="text-xs font-bold">{downloadSuccessToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#134074] to-[#002855] rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-400/30 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Hierarchical Learning Repository</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Faculty Notes & Academic Material Portal
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Access unit-wise lecture notes, question banks, previous semester questions, and assignment handouts curated directly by subject teachers.
            </p>
          </div>

          {(currentUser.role === 'TEACHER' || currentUser.role === 'HOD') && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all shrink-0 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Unit Notes / Question Bank</span>
            </button>
          )}
        </div>
      </div>

      {/* Cascading Drilldown Selector: Department → Semester → Subject → Faculty */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-amber-500" />
          <span>Hierarchy Drilldown Navigation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* 1. Department */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              1. Department
            </label>
            <select
              value={notesFilter.department}
              onChange={e => setNotesFilter(prev => ({ ...prev, department: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* 2. Semester */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              2. Semester
            </label>
            <select
              value={notesFilter.semester}
              onChange={e => setNotesFilter(prev => ({ ...prev, semester: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="ALL">All Semesters</option>
              <option value="1">Semester 1 (1st Year)</option>
              <option value="2">Semester 2 (1st Year)</option>
              <option value="3">Semester 3 (2nd Year)</option>
              <option value="4">Semester 4 (2nd Year)</option>
              <option value="5">Semester 5 (3rd Year - Current)</option>
              <option value="6">Semester 6 (3rd Year)</option>
              <option value="7">Semester 7 (4th Year)</option>
              <option value="8">Semester 8 (4th Year)</option>
            </select>
          </div>

          {/* 3. Subject */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              3. Subject
            </label>
            <select
              value={notesFilter.subjectCode}
              onChange={e => setNotesFilter(prev => ({ ...prev, subjectCode: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="ALL">All Subjects</option>
              <option value="CS3551">CS3551 - Machine Learning</option>
              <option value="CS3591">CS3591 - Computer Networks</option>
              <option value="CS3501">CS3501 - Compiler Design</option>
              <option value="CS3511">CS3511 - Cloud Computing</option>
            </select>
          </div>

          {/* 4. Search Filter */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Topic / Keyword Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search SVM, OSI, Regression..."
                value={notesFilter.search}
                onChange={e => setNotesFilter(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Unit and Category Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {/* Unit selection */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Unit:</span>
            {['ALL', 'Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'].map(u => (
              <button
                key={u}
                onClick={() => setNotesFilter(prev => ({ ...prev, unit: u }))}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  notesFilter.unit === u
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          {/* Category selection */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Type:</span>
            {['ALL', 'Lecture Notes', 'Question Bank', 'Assignment Handout', 'Important Questions'].map(c => (
              <button
                key={c}
                onClick={() => setNotesFilter(prev => ({ ...prev, category: c }))}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  notesFilter.category === c
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Showing {filteredNotes.length} course material{filteredNotes.length === 1 ? '' : 's'}
          </span>
          <span className="text-[11px] text-slate-400">
            Easwari Engineering College Syllabus Repository
          </span>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
              No notes match your filter
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting the Unit or Subject filter above, or search for other topics.
            </p>
            <button
              onClick={() =>
                setNotesFilter({
                  department: 'Computer Science and Engineering',
                  semester: '5',
                  subjectCode: 'ALL',
                  unit: 'ALL',
                  category: 'ALL',
                  search: '',
                })
              }
              className="mt-4 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-500/50 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="bg-[#0b2545] text-amber-300 dark:bg-amber-500/20 dark:text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                      {note.subjectCode} • {note.unit}
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase">
                      {note.fileType} • {note.fileSize}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {note.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">
                    {note.description}
                  </p>

                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {note.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-50 dark:bg-slate-800 text-slate-500 text-[10px] px-1.5 py-0.2 rounded border border-slate-200/50 dark:border-slate-700/50"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Info & Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-medium text-slate-800 dark:text-slate-200 text-[11px]">
                      {note.facultyName}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {note.uploadDate} • {note.downloadCount || 0} downloads
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedNoteForPreview(note)}
                      title="Quick Preview"
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(note)}
                      className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note Preview Modal */}
      {selectedNoteForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Material Overview & Syllabus Alignment
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedNoteForPreview.subjectCode} - {selectedNoteForPreview.subjectName} ({selectedNoteForPreview.unit})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNoteForPreview(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {selectedNoteForPreview.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-300">
                  {selectedNoteForPreview.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">FACULTY</span>
                    <strong>{selectedNoteForPreview.facultyName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">CATEGORY</span>
                    <strong>{selectedNoteForPreview.category}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">FILE FORMAT</span>
                    <strong>{selectedNoteForPreview.fileType.toUpperCase()} ({selectedNoteForPreview.fileSize})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">UPLOADED</span>
                    <strong>{selectedNoteForPreview.uploadDate}</strong>
                  </div>
                </div>
              </div>

              {/* Sample extracted syllabus units & formula sheet */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white text-xs block">
                  Key Topics & Exam Portions Covered:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                  <li>Formulation of the learning problem, hypothesis spaces, and inductive bias</li>
                  <li>Mathematical derivation of Gradient Descent & Cost function optimization</li>
                  <li>Solved Anna University Part B (13-mark) and Part C (15-mark) analytical questions</li>
                  <li>Jupyter notebook starter code & reference textbooks mapping</li>
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedNoteForPreview(null)}
                className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 font-medium"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownload(selectedNoteForPreview);
                  setSelectedNoteForPreview(null);
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download {selectedNoteForPreview.fileType.toUpperCase()} ({selectedNoteForPreview.fileSize})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal (For Faculty) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Upload New Course Material
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 3: Support Vector Machines & Kernel Methods"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
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
                      setNewSubjectName(subjectsBySem5[e.target.value] || 'Machine Learning');
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="CS3551">CS3551 - Machine Learning</option>
                    <option value="CS3591">CS3591 - Computer Networks</option>
                    <option value="CS3501">CS3501 - Compiler Design</option>
                    <option value="CS3511">CS3511 - Cloud Computing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unit
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
                    <option value="All Units">All Units (Full Bank)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
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
                    File Type
                  </label>
                  <select
                    value={newFileType}
                    onChange={e => setNewFileType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="ppt">PowerPoint PPT</option>
                    <option value="doc">Word Doc</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of topics covered..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. SVM, Kernel, Decision Boundary"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-50"
                >
                  {isSubmitting ? 'Uploading...' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
