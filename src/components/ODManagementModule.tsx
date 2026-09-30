import React, { useState } from 'react';
import {
  FileCheck2,
  PlusCircle,
  Calendar,
  Clock,
  Building,
  Upload,
  CheckCircle,
  AlertCircle,
  XCircle,
  Printer,
  QrCode,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Info,
  Award
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { ODCategory, ODRequest } from '../types';

export const ODManagementModule: React.FC = () => {
  const { currentUser, odRequests, applyOD, mentorReviewOD, hodReviewOD } = usePortal();

  const [activeSubTab, setActiveSubTab] = useState<'TRACK' | 'APPLY' | 'GUIDELINES'>('TRACK');
  const [selectedODForPass, setSelectedODForPass] = useState<ODRequest | null>(null);

  // Apply Form State
  const [category, setCategory] = useState<ODCategory>('Hackathon & Expo');
  const [eventName, setEventName] = useState('');
  const [organizingCollege, setOrganizingCollege] = useState('');
  const [fromDate, setFromDate] = useState('2026-10-15');
  const [toDate, setToDate] = useState('2026-10-15');
  const [periodsRequested, setPeriodsRequested] = useState('All Periods (1 to 7)');
  const [reason, setReason] = useState('');
  const [proofFileName, setProofFileName] = useState('SIH_Confirmation_Email.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filter for student vs faculty view
  const myRequests =
    currentUser.role === 'STUDENT'
      ? odRequests.filter(o => o.studentId === currentUser.id)
      : odRequests;

  const calculateDays = (start: string, end: string) => {
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diff = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)) + 1);
    return isNaN(diff) ? 1 : diff;
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim() || !organizingCollege.trim()) return;

    setIsSubmitting(true);
    try {
      const days = calculateDays(fromDate, toDate);
      await applyOD({
        category,
        eventName,
        organizingCollege,
        fromDate,
        toDate,
        totalDays: days,
        periodsRequested,
        reason,
        proofFileName: proofFileName || 'Event_Proof_Document.pdf',
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveSubTab('TRACK');
      }, 1500);

      // Reset
      setEventName('');
      setOrganizingCollege('');
      setReason('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#1a365d] to-[#0f2847] rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-400/30 mb-2">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Multi-Tier Autonomous OD Approval Protocol</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              On-Duty (OD) Management Workflow
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Apply for co-curricular leaves, symposium presentations, and sports zonals. Automatic routing: Student → Class Coordinator (Mentor) → HOD Final Sanction → ERP Attendance Credited.
            </p>
          </div>

          {currentUser.role === 'STUDENT' && (
            <button
              onClick={() => setActiveSubTab('APPLY')}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit New OD Application</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('TRACK')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'TRACK'
              ? 'bg-[#0b2545] text-white dark:bg-amber-500 dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Track Applications ({myRequests.length})</span>
        </button>

        {currentUser.role === 'STUDENT' && (
          <button
            onClick={() => setActiveSubTab('APPLY')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'APPLY'
                ? 'bg-[#0b2545] text-white dark:bg-amber-500 dark:text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Apply for OD</span>
          </button>
        )}

        <button
          onClick={() => setActiveSubTab('GUIDELINES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'GUIDELINES'
              ? 'bg-[#0b2545] text-white dark:bg-amber-500 dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>EEC Regulations & Guidelines</span>
        </button>
      </div>

      {/* TAB 1: TRACK OD APPLICATIONS */}
      {activeSubTab === 'TRACK' && (
        <div className="space-y-4">
          {myRequests.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800">
              <FileCheck2 className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                No OD Applications Found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                You haven't submitted any On-Duty requests yet. Click the "Apply for OD" button above to submit.
              </p>
            </div>
          ) : (
            myRequests.map(od => (
              <div
                key={od.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                        {od.applicationId}
                      </span>
                      <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                        {od.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        Applied: {od.appliedAt}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {od.eventName}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Organized by: <strong>{od.organizingCollege}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
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

                    {od.status === 'Approved' && (
                      <button
                        onClick={() => setSelectedODForPass(od)}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-3 py-1 rounded-lg text-xs shadow-xs cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print OD Pass</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Workflow Stepper Progress */}
                <div className="py-2">
                  <div className="grid grid-cols-4 gap-2 text-center relative z-10">
                    {/* Step 1: Applied */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow">
                        ✓
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1.5">
                        1. Applied
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {od.appliedAt.split(' ')[0]}
                      </span>
                    </div>

                    {/* Step 2: Mentor Review */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow ${
                        od.mentorReview
                          ? od.mentorReview.decision === 'REJECTED'
                            ? 'bg-rose-500 text-white'
                            : 'bg-emerald-500 text-white'
                          : od.status === 'Under Mentor Review'
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}>
                        {od.mentorReview ? (od.mentorReview.decision === 'REJECTED' ? '✕' : '✓') : '2'}
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1.5">
                        2. Mentor Review
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {od.mentorReview ? od.mentorReview.reviewedBy : 'Dr. S. Vignesh'}
                      </span>
                    </div>

                    {/* Step 3: HOD Approval */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow ${
                        od.hodReview
                          ? od.hodReview.decision === 'REJECTED'
                            ? 'bg-rose-500 text-white'
                            : 'bg-emerald-500 text-white'
                          : od.status === 'Forwarded to HOD'
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}>
                        {od.hodReview ? (od.hodReview.decision === 'REJECTED' ? '✕' : '✓') : '3'}
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1.5">
                        3. HOD Approval
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {od.hodReview ? od.hodReview.reviewedBy : 'Dr. Anandha Mala'}
                      </span>
                    </div>

                    {/* Step 4: Status Credited */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow ${
                        od.status === 'Approved'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}>
                        {od.status === 'Approved' ? '✓' : '4'}
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1.5">
                        4. ERP Credited
                      </span>
                      <span className="text-[10px] text-slate-400">
                        +Attendance Hrs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Bar */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">EVENT DATES</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {od.fromDate} to {od.toDate} ({od.totalDays} Day{od.totalDays > 1 ? 's' : ''})
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">PERIODS REQUESTED</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {od.periodsRequested}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">VERIFIED PROOF</span>
                    <strong className="text-blue-600 dark:text-blue-400">
                      📎 {od.proofFileName}
                    </strong>
                  </div>
                </div>

                {/* Review Remarks Note */}
                {od.mentorReview && (
                  <div className="text-xs bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 p-2.5 rounded-lg text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-blue-900 dark:text-blue-200">
                      Class Coordinator Note ({od.mentorReview.reviewedBy}):
                    </span>{' '}
                    "{od.mentorReview.comments}" ({od.mentorReview.date})
                  </div>
                )}

                {od.hodReview && (
                  <div className="text-xs bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 p-2.5 rounded-lg text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-emerald-900 dark:text-emerald-200">
                      HOD Official Sanction ({od.hodReview.reviewedBy}):
                    </span>{' '}
                    "{od.hodReview.comments}" ({od.hodReview.date})
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: APPLY FOR OD FORM */}
      {activeSubTab === 'APPLY' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs max-w-3xl mx-auto">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Application for Student On-Duty (OD) Permission
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Easwari Engineering College (Autonomous) • Cocurricular & Extracurricular Exemption Form
            </p>
          </div>

          {submitSuccess && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>OD Application submitted successfully! Forwarded to Class Coordinator Dr. S. Vignesh for review.</span>
            </div>
          )}

          <form onSubmit={handleApplySubmit} className="mt-5 space-y-4 text-xs">
            {/* Student Info Readonly Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 block">STUDENT</span>
                <strong className="text-slate-800 dark:text-slate-200">{currentUser.name}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">REGISTER NO</span>
                <strong className="text-slate-800 dark:text-slate-200">{currentUser.registerNumber || '310622104082'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">CLASS</span>
                <strong className="text-slate-800 dark:text-slate-200">CSE 5B (3rd Year)</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">COORDINATOR</span>
                <strong className="text-slate-800 dark:text-slate-200">Dr. S. Vignesh</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event Category *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ODCategory)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Hackathon & Expo">Hackathon / Technical Project Expo</option>
                  <option value="Paper Presentation">IEEE / Conference Paper Presentation</option>
                  <option value="Symposium">National Inter-College Technical Symposium</option>
                  <option value="Sports / Zonal">Anna University Zonal / State Sports</option>
                  <option value="Cultural Event">University Cultural Competition</option>
                  <option value="Internship / Industrial Visit">Approved Industry Internship</option>
                  <option value="NSS / NCC">NSS / NCC Camp / Parade</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Periods Requested *
                </label>
                <select
                  value={periodsRequested}
                  onChange={e => setPeriodsRequested(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="All Periods (1 to 7)">All Periods (Full Day 08:30 AM - 03:15 PM)</option>
                  <option value="Morning Session (Periods 1 to 4)">Morning Session (Periods 1 to 4)</option>
                  <option value="Afternoon Session (Periods 5 to 7)">Afternoon Session (Periods 5 to 7)</option>
                  <option value="Period 3 to 7">Period 3 to 7 (10:25 AM onwards)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Event / Competition Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Smart India Hackathon 2026 - Regional Round / Shaastra Coding League"
                value={eventName}
                onChange={e => setEventName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Organizing Institution / Venue College *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. IIT Madras / Anna University CEG Campus / PSG College of Technology"
                value={organizingCollege}
                onChange={e => setOrganizingCollege(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  From Date *
                </label>
                <input
                  type="date"
                  required
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  To Date *
                </label>
                <input
                  type="date"
                  required
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Objective / Team Participation Justification *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Explain the technical event significance and your team role representing Easwari Engineering College..."
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Proof Attachment */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Attach Proof Document (Invitation Letter / Shortlist Email / Brochure) *
              </label>
              <div className="flex items-center gap-3 border border-slate-300 dark:border-slate-700 rounded-lg p-3 bg-slate-50 dark:bg-slate-800/50">
                <Upload className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={proofFileName}
                  onChange={e => setProofFileName(e.target.value)}
                  placeholder="SIH_Acceptance_Letter.pdf"
                  className="flex-1 bg-transparent border-none text-xs focus:outline-none text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400 font-mono">PDF / JPG</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveSubTab('TRACK')}
                className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting to Coordinator...' : 'Submit OD Application'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: EEC GUIDELINES */}
      {activeSubTab === 'GUIDELINES' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 max-w-3xl mx-auto text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Easwari Engineering College OD Regulations & Anna University Norms
            </h3>
          </div>

          <div className="space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              Under the Autonomous Regulation 2023 of Easwari Engineering College, students actively participating in institutional co-curricular and sports events can claim On-Duty (OD) exemption subject to the following rules:
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700/60">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                Key Guidelines:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                <li><strong>Advance Submission:</strong> OD applications must be filed at least 48 hours prior to the event date.</li>
                <li><strong>Attendance Floor:</strong> A minimum pre-existing ERP attendance of 75% is mandatory to be eligible for OD recommendation by the Class Coordinator.</li>
                <li><strong>Two-Tier Approval:</strong> 1-day intra-department events can be sanctioned by the Class Coordinator. Multi-day, hackathons, and outstation symposia require final sanction from the Head of the Department (HOD).</li>
                <li><strong>Certificate Submission:</strong> Within 3 days of event completion, the participation/prize certificate must be shown to the mentor to finalize attendance credit.</li>
                <li><strong>Maximum Cap:</strong> A student may avail a maximum of 15 working days of OD per semester as per academic council guidelines.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Printable Official OD Pass Modal */}
      {selectedODForPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-xl w-full p-8 shadow-2xl border-4 border-double border-[#0b2545] relative">
            {/* Watermark Logo Simulation */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-9xl font-black text-[#0b2545]">
              EEC
            </div>

            {/* Letterhead */}
            <div className="text-center pb-4 border-b-2 border-slate-900">
              <div className="text-lg font-black tracking-wide uppercase text-[#0b2545]">
                Easwari Engineering College
              </div>
              <div className="text-[10px] font-semibold text-slate-600 uppercase">
                (Autonomous Institution • Affiliated to Anna University, Chennai)
              </div>
              <div className="text-[9px] text-slate-500">
                Bharathi Salai, Ramapuram, Chennai - 600 089 • Tamil Nadu, India
              </div>
              <div className="mt-2 inline-block bg-slate-900 text-white font-black text-xs px-4 py-0.5 rounded tracking-widest uppercase">
                Official Student On-Duty (OD) Pass
              </div>
            </div>

            {/* Pass Metadata */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">PASS NUMBER</span>
                <strong className="font-mono">{selectedODForPass.applicationId}</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">AUTHENTICATION HASH</span>
                <strong className="font-mono text-[10px] text-emerald-700">{selectedODForPass.qrCodeHash}</strong>
              </div>
            </div>

            {/* Student & Event Table */}
            <table className="w-full mt-3 text-xs border border-slate-300">
              <tbody>
                <tr className="border-b border-slate-300 bg-slate-50">
                  <td className="p-2 font-bold w-1/3">Student Name</td>
                  <td className="p-2 font-semibold">{selectedODForPass.studentName}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold">Register / Roll No</td>
                  <td className="p-2 font-mono">{selectedODForPass.registerNumber}</td>
                </tr>
                <tr className="border-b border-slate-300 bg-slate-50">
                  <td className="p-2 font-bold">Branch & Section</td>
                  <td className="p-2">{selectedODForPass.department} (Sem {selectedODForPass.semester} - Sec {selectedODForPass.section})</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold">Category & Event</td>
                  <td className="p-2">{selectedODForPass.category}: <strong>{selectedODForPass.eventName}</strong></td>
                </tr>
                <tr className="border-b border-slate-300 bg-slate-50">
                  <td className="p-2 font-bold">Venue Institution</td>
                  <td className="p-2">{selectedODForPass.organizingCollege}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold">Approved Duration</td>
                  <td className="p-2 font-bold text-emerald-800">{selectedODForPass.fromDate} to {selectedODForPass.toDate} ({selectedODForPass.totalDays} Days)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold bg-slate-50">Periods Exempted</td>
                  <td className="p-2">{selectedODForPass.periodsRequested}</td>
                </tr>
              </tbody>
            </table>

            {/* Signature Stamps */}
            <div className="mt-8 grid grid-cols-3 gap-2 text-center text-xs pt-4 border-t border-slate-200">
              <div>
                <div className="h-10 flex items-center justify-center font-cursive text-slate-600 font-bold italic">
                  Harish Kumar S
                </div>
                <div className="border-t border-slate-400 pt-1 font-semibold text-[10px] text-slate-600">
                  Student Signature
                </div>
              </div>

              <div>
                <div className="h-10 flex items-center justify-center font-bold text-purple-800 text-[11px]">
                  [ Verified Dr. S. Vignesh ]
                </div>
                <div className="border-t border-slate-400 pt-1 font-semibold text-[10px] text-slate-600">
                  Class Coordinator
                </div>
              </div>

              <div>
                <div className="h-10 flex items-center justify-center font-bold text-amber-800 text-[11px]">
                  [ Sanctioned Dr. Anandha Mala ]
                </div>
                <div className="border-t border-slate-400 pt-1 font-semibold text-[10px] text-slate-600">
                  Head of Department (CSE)
                </div>
              </div>
            </div>

            {/* Print Action Footer */}
            <div className="mt-6 flex items-center justify-between pt-3 border-t border-slate-300 text-xs">
              <span className="text-[10px] text-slate-500">
                Show this digital pass at gate security and subject teachers for attendance credit.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedODForPass(null)}
                  className="px-3 py-1.5 rounded text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
