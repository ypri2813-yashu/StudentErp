import React from 'react';
import {
  BookOpen,
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
  Download,
  Building,
  GraduationCap
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';

export const DashboardStudent: React.FC = () => {
  const { currentUser, setActiveTab, notes, odRequests, announcements, erpData, setAiDrawerOpen, setNotesFilter } = usePortal();

  const latestNotes = notes.slice(0, 3);
  const myODs = odRequests.filter(o => o.studentId === currentUser.id);
  const activeOD = myODs.find(o => o.status !== 'Approved' && o.status !== 'Rejected') || myODs[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#134074] to-[#1d2d44] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-400/30 mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>B.E. Computer Science & Engineering • 3rd Year (Sem 5-B)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome, {currentUser.name}! 👋
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Easwari Engineering College Classroom Hub. Access faculty lecture notes, track On-Duty approvals, and monitor your ERP attendance in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('od-apply')}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Apply for OD</span>
            </button>
            <button
              onClick={() => {
                setNotesFilter(prev => ({ ...prev, subjectCode: 'CS3551' }));
                setActiveTab('notes');
              }}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs border border-white/20 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>View ML Notes</span>
            </button>
            <button
              onClick={() => setAiDrawerOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-3.5 py-2.5 rounded-xl text-xs shadow transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask NavBot</span>
            </button>
          </div>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Card */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider">ERP Attendance</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {erpData?.attendance?.overallPercentage || '88.4'}%
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              (+{erpData?.attendance?.odApprovedHours || 14} hrs OD)
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${erpData?.attendance?.overallPercentage || 88.4}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Req: 75% (Anna Univ)</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Eligible</span>
          </div>
        </div>

        {/* CGPA / Academic Standing */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Cumulative GPA</span>
            <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <GraduationCap className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {erpData?.profile?.cgpa || '8.82'}
            </span>
            <span className="text-xs text-slate-500">/ 10.0</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>0 Standing Arrears • Distinction</span>
          </div>
          <button
            onClick={() => setActiveTab('marks')}
            className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View CAT-1 marks</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Active OD Status */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider">OD Workflow</span>
            <span className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <FileCheck2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900 dark:text-white truncate">
              {activeOD ? activeOD.status : 'None Pending'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
            {activeOD ? activeOD.eventName : 'Apply for upcoming events'}
          </div>
          <button
            onClick={() => setActiveTab('od-track')}
            className="mt-3 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Track approval timeline</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Next Period & Classroom */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Current / Next Period</span>
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-lg font-bold text-slate-900 dark:text-white block truncate">
              Machine Learning Lab
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              01:35 PM • Lab 4 • Dr. K. Meenakshi
            </span>
          </div>
          <button
            onClick={() => setActiveTab('timetable')}
            className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Full weekly timetable</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Split Grid: OD Progress & Recent Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active OD Approval Timeline & Announcements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active OD Request Tracker Widget */}
          {activeOD && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Latest On-Duty (OD) Application
                    </h3>
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">
                      {activeOD.applicationId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {activeOD.category} • {activeOD.organizingCollege}
                  </p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                  activeOD.status === 'Approved'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                    : activeOD.status === 'Rejected'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                }`}>
                  {activeOD.status}
                </span>
              </div>

              {/* Multi-tier Approval Stepper */}
              <div className="mt-5 relative">
                <div className="grid grid-cols-4 gap-2 text-center relative z-10">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow">
                      ✓
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-2">
                      Submitted
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {activeOD.appliedAt.split(' ')[0]}
                    </span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow ${
                      activeOD.mentorReview
                        ? 'bg-emerald-500 text-white'
                        : activeOD.status === 'Under Mentor Review'
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {activeOD.mentorReview ? '✓' : '2'}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-2">
                      Mentor Review
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Dr. S. Vignesh
                    </span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow ${
                      activeOD.hodReview
                        ? 'bg-emerald-500 text-white'
                        : activeOD.status === 'Forwarded to HOD'
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {activeOD.hodReview ? '✓' : '3'}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-2">
                      HOD Approval
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Dr. Anandha Mala
                    </span>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow ${
                      activeOD.status === 'Approved'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {activeOD.status === 'Approved' ? '✓' : '4'}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-2">
                      OD Credited
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ERP Attendance
                    </span>
                  </div>
                </div>

                {/* Progress bar connecting steps */}
                <div className="absolute top-4 left-[12%] right-[12%] h-1 bg-slate-200 dark:bg-slate-800 -z-0">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{
                      width:
                        activeOD.status === 'Approved'
                          ? '100%'
                          : activeOD.status === 'Forwarded to HOD'
                          ? '66%'
                          : activeOD.status === 'Under Mentor Review'
                          ? '33%'
                          : '0%',
                    }}
                  />
                </div>
              </div>

              {/* Mentor comments callout if available */}
              {activeOD.mentorReview && (
                <div className="mt-4 p-3 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-lg text-xs">
                  <span className="font-semibold text-blue-900 dark:text-blue-300">
                    Coordinator Recommendation:
                  </span>{' '}
                  <span className="text-slate-700 dark:text-slate-300">
                    "{activeOD.mentorReview.comments}"
                  </span>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-500">
                  Dates: <strong>{activeOD.fromDate}</strong> to <strong>{activeOD.toDate}</strong> ({activeOD.totalDays} days)
                </span>
                <button
                  onClick={() => setActiveTab('od-track')}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  View Details & Print Pass →
                </button>
              </div>
            </div>
          )}

          {/* Announcements & Notifications Stream */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Classroom Announcements & Notice Board
              </h3>
              <button
                onClick={() => setActiveTab('announcements')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                View all ({announcements.length})
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {announcements.slice(0, 3).map(ann => (
                <div
                  key={ann.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all bg-slate-50/50 dark:bg-slate-800/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      ann.priority === 'URGENT'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
                        : ann.priority === 'HIGH'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                    }`}>
                      {ann.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{ann.date}</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-xs mt-1.5">
                    {ann.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                    {ann.content}
                  </p>
                  <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>By {ann.authorName} ({ann.authorRole})</span>
                    {ann.attachments && ann.attachments.length > 0 && (
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        📎 {ann.attachments[0].name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Latest Faculty Notes & Course Materials */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Faculty Notes
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Unit-wise uploads & Question banks
                </p>
              </div>
              <button
                onClick={() => setActiveTab('notes')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Browse all →
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {latestNotes.map(note => (
                <div
                  key={note.id}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 transition-all bg-white dark:bg-slate-800/60 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {note.subjectCode} • {note.unit}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      {note.fileType.toUpperCase()} • {note.fileSize}
                    </span>
                  </div>

                  <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mt-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {note.title}
                  </h4>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                    <span>{note.facultyName}</span>
                    <button
                      onClick={() => {
                        setNotesFilter(prev => ({ ...prev, subjectCode: note.subjectCode }));
                        setActiveTab('notes');
                      }}
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('notes')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Search by Department → Semester → Subject
              </button>
            </div>
          </div>

          {/* ERP Course Quick Status */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
              Enrolled Courses & Mentorship
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Class Coordinator: <strong>Dr. S. Vignesh</strong> (CSE-B)
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                <span className="font-medium">CS3551 Machine Learning</span>
                <span className="text-emerald-600 font-bold">90.0% Att.</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                <span className="font-medium">CS3591 Computer Networks</span>
                <span className="text-emerald-600 font-bold">86.8% Att.</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                <span className="font-medium">CS3501 Compiler Design</span>
                <span className="text-emerald-600 font-bold">90.4% Att.</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                <span className="font-medium">CS3511 Cloud Computing</span>
                <span className="text-amber-600 font-bold">80.5% Att.</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('attendance')}
              className="mt-3 w-full py-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline text-center block cursor-pointer"
            >
              View detailed subject-wise breakdown →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
