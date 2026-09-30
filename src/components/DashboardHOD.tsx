import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  CheckCircle2,
  XCircle,
  BarChart3,
  Award,
  Users,
  BookOpen,
  Send,
  Eye,
  Sparkles
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { ODRequest } from '../types';

export const DashboardHOD: React.FC = () => {
  const { currentUser, odRequests, hodReviewOD, notes, setActiveTab } = usePortal();

  const [selectedOD, setSelectedOD] = useState<ODRequest | null>(null);
  const [hodRemarks, setHodRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tabFilter, setTabFilter] = useState<'AWAITING_HOD' | 'ALL_DEPT'>('AWAITING_HOD');

  const deptODs = odRequests.filter(o => o.department === currentUser.department);
  const awaitingHOD = deptODs.filter(o => o.status === 'Forwarded to HOD');

  const displayedODs = tabFilter === 'AWAITING_HOD' ? awaitingHOD : deptODs;

  const handleAction = async (action: 'APPROVE' | 'REJECT') => {
    if (!selectedOD) return;
    setIsProcessing(true);
    try {
      await hodReviewOD(
        selectedOD.id,
        action,
        hodRemarks || (action === 'APPROVE' ? 'Final approval sanctioned by HOD. OD attendance credit updated in ERP.' : 'Denied by HOD.')
      );
      setSelectedOD(null);
      setHodRemarks('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // Faculty notes compliance summary
  const facultyCompliance = [
    { name: 'Dr. K. Meenakshi', subjects: 'CS3551 Machine Learning, CS3591 Computer Networks', unitsUploaded: 3, qbUploaded: true, status: '100% Compliant' },
    { name: 'Dr. S. Vignesh', subjects: 'CS3501 Compiler Design', unitsUploaded: 2, qbUploaded: true, status: 'Compliant' },
    { name: 'Dr. P. Suresh', subjects: 'CS3511 Cloud Computing Architecture', unitsUploaded: 2, qbUploaded: false, status: 'QB Pending' },
    { name: 'Mrs. R. Priyadarshini', subjects: 'CS3582 Computer Networks Laboratory', unitsUploaded: 2, qbUploaded: true, status: 'Lab Manuals Complete' },
  ];

  return (
    <div className="space-y-6">
      {/* HOD Banner */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#1e3a8a] to-[#0f172a] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-400/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Office of the Head of Department • CSE</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              HOD Executive Dashboard • {currentUser.name}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Official administrative oversight for Department of Computer Science & Engineering. Sanction external event On-Duty requests and monitor classroom academic materials.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20 text-center">
            <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold block">
              Forwarded ODs Awaiting Sanction
            </span>
            <span className="text-3xl font-black text-white">{awaitingHOD.length}</span>
            <span className="text-[11px] text-slate-300 block">Requires final HOD stamp</span>
          </div>
        </div>
      </div>

      {/* Department KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Department Enrollment
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            480 Students
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Across 4 Years • 8 Sections
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Faculty Teaching Strength
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            34 Faculty
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            18 Ph.D holders • 16 Pursuing
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Notes Repository Uploads
          </div>
          <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {notes.length} Files
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            94% syllabus coverage
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Co-Curricular OD Approvals
          </div>
          <div className="mt-2 text-3xl font-extrabold text-purple-600 dark:text-purple-400">
            28 Sanctioned
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            SIH, Kurukshetra, Shaastra
          </div>
        </div>
      </div>

      {/* Forwarded OD Requests Awaiting Final Sanction */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              On-Duty Sanction Portal (HOD Level Final Approval)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Coordinators have evaluated attendance & forwarded these applications for your executive approval
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTabFilter('AWAITING_HOD')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                tabFilter === 'AWAITING_HOD'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Awaiting HOD ({awaitingHOD.length})
            </button>
            <button
              onClick={() => setTabFilter('ALL_DEPT')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                tabFilter === 'ALL_DEPT'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              All Department ODs ({deptODs.length})
            </button>
          </div>
        </div>

        {displayedODs.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500/60 mb-2" />
            <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">
              No Pending Requests
            </p>
            <p className="text-xs">All forwarded OD applications have received final sanction.</p>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {displayedODs.map(od => (
              <div
                key={od.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {od.studentName}
                    </span>
                    <span className="font-mono text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                      {od.registerNumber}
                    </span>
                    <span className="text-xs text-slate-500">
                      Sem {od.semester} - Sec {od.section}
                    </span>
                    <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs px-2 py-0.5 rounded-full font-semibold">
                      {od.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      od.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                        : od.status === 'Forwarded to HOD'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                        : od.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {od.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    <strong>Event:</strong> {od.eventName} • <strong>Venue:</strong> {od.organizingCollege}
                  </p>

                  <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3">
                    <span>📅 {od.fromDate} to {od.toDate} ({od.totalDays} Days)</span>
                    <span>⏰ {od.periodsRequested}</span>
                    <span>📎 Proof: {od.proofFileName}</span>
                  </div>

                  {od.mentorReview && (
                    <div className="text-xs text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 p-2 rounded mt-1 border border-blue-100 dark:border-blue-900/30">
                      <strong>Coordinator Recommendation ({od.mentorReview.reviewedBy}):</strong> "{od.mentorReview.comments}"
                    </div>
                  )}

                  {od.hodReview && (
                    <div className="text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded mt-1 border border-emerald-100 dark:border-emerald-900/30">
                      <strong>HOD Final Sanction:</strong> "{od.hodReview.comments}" ({od.hodReview.date})
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {od.status === 'Forwarded to HOD' ? (
                    <button
                      onClick={() => {
                        setSelectedOD(od);
                        setHodRemarks('Approved under college co-curricular guidelines. Attendance credited in ERP.');
                      }}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs shadow-md transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Sanction Approval</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedOD(od)}
                      className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-xs px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Pass</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Faculty Course Notes Compliance Audit */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Faculty Notes Repository Upload Compliance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Department audit: Units 1-5 notes & Question bank uploads before CAT-1
            </p>
          </div>
          <button
            onClick={() => setActiveTab('notes')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Open Notes Module →
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="pb-2 font-semibold">Faculty Member</th>
                <th className="pb-2 font-semibold">Assigned Subjects</th>
                <th className="pb-2 font-semibold">Units Uploaded</th>
                <th className="pb-2 font-semibold">Question Bank</th>
                <th className="pb-2 font-semibold">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {facultyCompliance.map(fac => (
                <tr key={fac.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2.5 font-semibold text-slate-900 dark:text-white">{fac.name}</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400">{fac.subjects}</td>
                  <td className="py-2.5">
                    <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {fac.unitsUploaded} / 5 Units
                    </span>
                  </td>
                  <td className="py-2.5">
                    {fac.qbUploaded ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        ✓ Published
                      </span>
                    ) : (
                      <span className="text-amber-500 font-semibold flex items-center gap-1">
                        ⏳ Due this week
                      </span>
                    )}
                  </td>
                  <td className="py-2.5">
                    <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">
                      {fac.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HOD Sanction Modal */}
      {selectedOD && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    HOD Executive Sanction
                  </h3>
                  <p className="text-xs text-slate-500">
                    Application ID: <span className="font-mono">{selectedOD.applicationId}</span>
                  </p>
                </div>
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
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Student:</span>
                  <strong className="text-slate-900 dark:text-white">
                    {selectedOD.studentName} ({selectedOD.registerNumber})
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Class:</span>
                  <span>Sem {selectedOD.semester} - Section {selectedOD.section} (CSE)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Event & Venue:</span>
                  <span className="font-semibold text-right max-w-xs">{selectedOD.eventName} @ {selectedOD.organizingCollege}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Approved Dates:</span>
                  <span>{selectedOD.fromDate} to {selectedOD.toDate} ({selectedOD.totalDays} Days)</span>
                </div>
                {selectedOD.mentorReview && (
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded text-blue-900 dark:text-blue-200 mt-2">
                    <strong>Mentor Verification ({selectedOD.mentorReview.reviewedBy}):</strong> {selectedOD.mentorReview.comments}
                  </div>
                )}
              </div>

              {selectedOD.status === 'Forwarded to HOD' && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Official HOD Executive Remarks *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter sanction comments or travel grant remarks..."
                    value={hodRemarks}
                    onChange={e => setHodRemarks(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedOD(null)}
                className="px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 text-xs font-semibold"
              >
                Cancel
              </button>

              {selectedOD.status === 'Forwarded to HOD' ? (
                <>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleAction('REJECT')}
                    className="px-3.5 py-2 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Reject Sanction
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleAction('APPROVE')}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Issue Final HOD Sanction</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelectedOD(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
