import React, { useState } from 'react';
import {
  FileCheck2,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Forward,
  Clock,
  ExternalLink,
  MessageSquare,
  Search,
  Filter,
  Eye
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { ODRequest } from '../types';

export const DashboardMentor: React.FC = () => {
  const { currentUser, odRequests, mentorReviewOD, setActiveTab } = usePortal();

  // State for Review Modal
  const [selectedOD, setSelectedOD] = useState<ODRequest | null>(null);
  const [reviewComments, setReviewComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'FORWARDED' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [studentSearch, setStudentSearch] = useState('');

  // Sample Section B Students Roster
  const sectionStudents = [
    { regNo: '310622104082', name: 'Harish Kumar S', att: 88.4, cgpa: 8.82, mentorMeeting: 'Attended', status: 'Good' },
    { regNo: '310622104055', name: 'Divya Bharathi M', att: 78.2, cgpa: 8.45, mentorMeeting: 'Attended', status: 'Good' },
    { regNo: '310622104112', name: 'Rohan Sundaram', att: 72.8, cgpa: 7.90, mentorMeeting: 'Pending', status: 'Low Attendance (<75%)' },
    { regNo: '310622104014', name: 'Abishek V', att: 92.1, cgpa: 9.12, mentorMeeting: 'Attended', status: 'Exemplary' },
    { regNo: '310622104043', name: 'Charulatha K', att: 85.6, cgpa: 8.70, mentorMeeting: 'Attended', status: 'Good' },
    { regNo: '310622104098', name: 'Kavitha R', att: 69.5, cgpa: 7.40, mentorMeeting: 'Letter Sent', status: 'Critical Attendance (<70%)' },
  ];

  // ODs for Section B
  const sectionODs = odRequests.filter(o => o.section === 'B');

  const filteredODs = sectionODs.filter(o => {
    if (statusFilter === 'PENDING') return o.status === 'Under Mentor Review';
    if (statusFilter === 'FORWARDED') return o.status === 'Forwarded to HOD';
    if (statusFilter === 'APPROVED') return o.status === 'Approved';
    if (statusFilter === 'REJECTED') return o.status === 'Rejected';
    return true;
  });

  const handleReviewAction = async (action: 'FORWARD' | 'APPROVE' | 'REJECT') => {
    if (!selectedOD) return;
    setIsProcessing(true);
    try {
      await mentorReviewOD(selectedOD.id, action, reviewComments);
      setSelectedOD(null);
      setReviewComments('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingCount = sectionODs.filter(o => o.status === 'Under Mentor Review').length;

  return (
    <div className="space-y-6">
      {/* Mentor Header Banner */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#4a154b] to-[#2c003e] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full border border-purple-400/30 mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Class Coordinator Portal • CSE 3rd Year - Section B</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Class Coordinator Console • {currentUser.name}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Monitor Section B attendance records, evaluate student On-Duty (OD) permissions, and forward co-curricular recommendations to HOD.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold block">
              Pending OD Reviews
            </span>
            <span className="text-3xl font-black text-white">{pendingCount}</span>
            <span className="text-[11px] text-slate-300 block">Awaiting your approval</span>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Class Strength
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            62 Students
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            CSE 2022-2026 Batch (Section B)
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Average Class Attendance
          </div>
          <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            86.2%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Above Anna Univ 75% limit
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-rose-500 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Attendance Risk</span>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-rose-600 dark:text-rose-400">
            2 Students
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Below 75% condonation threshold
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            Approved ODs This Month
          </div>
          <div className="mt-2 text-3xl font-extrabold text-purple-700 dark:text-purple-300">
            18 Days
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            SIH, IEEE, Zonal Sports
          </div>
        </div>
      </div>

      {/* OD Approval Queue */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              On-Duty (OD) Submission Workflow Queue
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review event credentials and forward to HOD Dr. Anandha Mala
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(['PENDING', 'FORWARDED', 'APPROVED', 'ALL'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {tab === 'PENDING' ? `Pending (${pendingCount})` : tab}
              </button>
            ))}
          </div>
        </div>

        {filteredODs.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <CheckCircle className="w-10 h-10 mx-auto text-emerald-500/60 mb-2" />
            <p className="font-medium text-sm text-slate-700 dark:text-slate-300">
              No OD requests in this category
            </p>
            <p className="text-xs">All pending student submissions have been processed.</p>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {filteredODs.map(od => (
              <div
                key={od.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 p-3 rounded-xl transition-all"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {od.studentName}
                    </span>
                    <span className="font-mono text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                      {od.registerNumber}
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs px-2 py-0.5 rounded-full font-medium">
                      {od.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      od.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                        : od.status === 'Forwarded to HOD'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                        : od.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                    }`}>
                      {od.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    <strong>Event:</strong> {od.eventName} • <strong>Org:</strong> {od.organizingCollege}
                  </p>

                  <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3">
                    <span>
                      📅 <strong>{od.fromDate}</strong> to <strong>{od.toDate}</strong> ({od.totalDays} day{od.totalDays > 1 ? 's' : ''})
                    </span>
                    <span>⏰ {od.periodsRequested}</span>
                    <span>📎 Proof: {od.proofFileName}</span>
                  </div>

                  {od.mentorReview && (
                    <div className="text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 p-2 rounded mt-1">
                      <strong>Your Note:</strong> "{od.mentorReview.comments}" ({od.mentorReview.date})
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {od.status === 'Under Mentor Review' ? (
                    <button
                      onClick={() => {
                        setSelectedOD(od);
                        setReviewComments('Recommended for approval. Attendance is above 75% and student is representing the institution.');
                      }}
                      className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold px-3.5 py-2 rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Review & Act</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedOD(od)}
                      className="flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Record</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Class Attendance Watchlist */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Section B Student Attendance & Mentoring Roster
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Easwari Autonomous Regulation: Students &lt; 75% require parent notification
            </p>
          </div>
          <button
            onClick={() => setActiveTab('attendance')}
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
          >
            ERP Class Report →
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="pb-2 font-semibold">Reg. Number</th>
                <th className="pb-2 font-semibold">Student Name</th>
                <th className="pb-2 font-semibold">ERP Attendance</th>
                <th className="pb-2 font-semibold">CGPA</th>
                <th className="pb-2 font-semibold">Mentor Review</th>
                <th className="pb-2 font-semibold">Regulation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {sectionStudents.map(st => (
                <tr key={st.regNo} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2.5 font-mono text-slate-500">{st.regNo}</td>
                  <td className="py-2.5 font-semibold text-slate-900 dark:text-white">{st.name}</td>
                  <td className="py-2.5">
                    <span className={`font-bold ${
                      st.att < 75 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {st.att}%
                    </span>
                  </td>
                  <td className="py-2.5 font-medium">{st.cgpa}</td>
                  <td className="py-2.5 text-slate-500">{st.mentorMeeting}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      st.att < 75
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                    }`}>
                      {st.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedOD && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Class Coordinator Review: {selectedOD.studentName}
                </h3>
                <p className="text-xs text-slate-500">
                  Application ID: <span className="font-mono">{selectedOD.applicationId}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedOD(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">EVENT</span>
                    <strong className="text-slate-900 dark:text-white text-xs">{selectedOD.eventName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">COLLEGE / VENUE</span>
                    <strong className="text-slate-900 dark:text-white text-xs">{selectedOD.organizingCollege}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <div>
                    <span className="text-slate-400 block text-[10px]">CATEGORY</span>
                    <span>{selectedOD.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">DATES</span>
                    <span>{selectedOD.fromDate} to {selectedOD.toDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">TOTAL DURATION</span>
                    <span>{selectedOD.totalDays} Day(s) • {selectedOD.periodsRequested}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400 block text-[10px]">REASON / OBJECTIVE</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5">{selectedOD.reason}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-400 text-[10px]">ATTACHED PROOF DOCUMENT</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    📎 {selectedOD.proofFileName} ({selectedOD.proofFileSize})
                  </span>
                </div>
              </div>

              {selectedOD.status === 'Under Mentor Review' && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mentor Remarks & Recommendation Note *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter recommendation remarks for HOD Dr. Anandha Mala..."
                    value={reviewComments}
                    onChange={e => setReviewComments(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            {selectedOD.status === 'Under Mentor Review' ? (
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOD(null)}
                  className="px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleReviewAction('REJECT')}
                  className="px-3.5 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer"
                >
                  Reject Request
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleReviewAction('APPROVE')}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Approve Directly (1-Day)
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleReviewAction('FORWARD')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
                >
                  <Forward className="w-3.5 h-3.5" />
                  <span>Forward to HOD</span>
                </button>
              </div>
            ) : (
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
                <button
                  onClick={() => setSelectedOD(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
