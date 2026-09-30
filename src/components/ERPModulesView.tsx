import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Award,
  FileText,
  UserCheck,
  Building,
  GraduationCap,
  FlaskConical,
  CreditCard,
  Download,
  Info,
  ExternalLink
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { ActiveTab } from '../types';

export const ERPModulesView: React.FC<{ initialModule?: string }> = ({ initialModule }) => {
  const { erpData, currentUser, activeTab, setActiveTab } = usePortal();

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [downloadReceiptToast, setDownloadReceiptToast] = useState<string | null>(null);

  const timetable = erpData?.timetable?.weekdays || [];
  const currentDaySchedule = timetable.find((d: any) => d.day === selectedDay) || timetable[0];

  const handleDownloadReceipt = (name: string, receiptNo: string) => {
    setDownloadReceiptToast(`Generated Official EEC Receipt ${receiptNo} for ${name}`);
    setTimeout(() => setDownloadReceiptToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {downloadReceiptToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-2 duration-200">
          <FileText className="w-5 h-5 text-emerald-400 dark:text-slate-950" />
          <span className="text-xs font-bold">{downloadReceiptToast}</span>
        </div>
      )}

      {/* ERP Banner */}
      <div className="bg-gradient-to-r from-[#0b2545] via-[#102a43] to-[#1c3d5a] rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-400/30 mb-2">
              <Building className="w-3.5 h-3.5" />
              <span>Core College ERP System Integration</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Easwari Engineering College ERP Data Hub
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Official records mirrored from the central ERP database. Classroom layer updates (like approved OD credits) reflect immediately into attendance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(['timetable', 'attendance', 'marks', 'fees', 'profile'] as ActiveTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MODULE 1: TIMETABLE */}
      {activeTab === 'timetable' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Weekly Class Timetable (CSE - 5B)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Academic Year 2026-2027 • Classroom: CS-302 (TRP Building, 3rd Floor)
              </p>
            </div>

            {/* Day Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedDay === d
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Periods Timeline Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                  <th className="pb-2 font-semibold">Time Slot</th>
                  <th className="pb-2 font-semibold">Course Code</th>
                  <th className="pb-2 font-semibold">Subject / Lab</th>
                  <th className="pb-2 font-semibold">Faculty In-Charge</th>
                  <th className="pb-2 font-semibold">Room / Lab</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {currentDaySchedule?.periods?.map((period: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>{period.time}</span>
                    </td>
                    <td className="py-3 font-mono text-slate-500">{period.code}</td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      {period.subject}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{period.faculty}</td>
                    <td className="py-3">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono font-medium">
                        {period.room}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULE 2: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="space-y-5">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 uppercase font-semibold">Overall Attendance</span>
              <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {erpData?.attendance?.overallPercentage || '88.4'}%
              </div>
              <span className="text-[11px] text-slate-400">Anna Univ Min: 75%</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 uppercase font-semibold">Hours Attended</span>
              <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                {erpData?.attendance?.totalAttendedHours || 214}
              </div>
              <span className="text-[11px] text-slate-400">Out of {erpData?.attendance?.totalConductedHours || 242} Conducted</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-purple-600 dark:text-purple-400 uppercase font-semibold">Approved OD Exemption</span>
              <div className="mt-2 text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                +{erpData?.attendance?.odApprovedHours || 14} Hours
              </div>
              <span className="text-[11px] text-slate-400">From SIH & IEEE Conf</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-500 uppercase font-semibold">Effective Percentage</span>
              <div className="mt-2 text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                {erpData?.attendance?.effectivePercentage || '94.2'}%
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">Exam Hall Ticket Approved</span>
            </div>
          </div>

          {/* Subject-Wise Breakdown Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3">
              Subject-Wise Attendance Register (Semester 5)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                    <th className="pb-2 font-semibold">Code</th>
                    <th className="pb-2 font-semibold">Subject Title</th>
                    <th className="pb-2 font-semibold">Faculty In-Charge</th>
                    <th className="pb-2 font-semibold">Conducted</th>
                    <th className="pb-2 font-semibold">Attended</th>
                    <th className="pb-2 font-semibold">OD Credit</th>
                    <th className="pb-2 font-semibold">Percentage</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {erpData?.attendance?.subjects?.map((sub: any) => (
                    <tr key={sub.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 font-mono text-slate-500">{sub.code}</td>
                      <td className="py-2.5 font-semibold text-slate-900 dark:text-white">{sub.name}</td>
                      <td className="py-2.5 text-slate-500">{sub.faculty}</td>
                      <td className="py-2.5">{sub.conducted}</td>
                      <td className="py-2.5 font-medium">{sub.attended}</td>
                      <td className="py-2.5 text-purple-600 font-bold">+{sub.od}</td>
                      <td className="py-2.5">
                        <span className={`font-bold ${
                          sub.percentage < 75 ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {sub.percentage}%
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                          Eligible
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: MARKS & SCORES */}
      {activeTab === 'marks' && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Continuous Assessment Test (CAT-1) Scored Marks
            </h3>
            <p className="text-xs text-slate-500">
              Easwari Autonomous Pattern: Max 50 Marks • Conducted in September 2026
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                    <th className="pb-2 font-semibold">Course Code</th>
                    <th className="pb-2 font-semibold">Course Title</th>
                    <th className="pb-2 font-semibold">Max Marks</th>
                    <th className="pb-2 font-semibold">Marks Scored</th>
                    <th className="pb-2 font-semibold">Percentage</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {erpData?.assessments?.cat1?.map((cat: any) => (
                    <tr key={cat.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 font-mono text-slate-500">{cat.code}</td>
                      <td className="py-2.5 font-semibold text-slate-900 dark:text-white">{cat.name}</td>
                      <td className="py-2.5">{cat.max}</td>
                      <td className="py-2.5 font-bold text-blue-600 dark:text-blue-400">{cat.scored}</td>
                      <td className="py-2.5 font-semibold">{((cat.scored / cat.max) * 100).toFixed(1)}%</td>
                      <td className="py-2.5">
                        <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                          Passed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Previous Semester University SGPA Record */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3">
              Autonomous End-Semester University Exam Performance
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {erpData?.assessments?.semesterResults?.map((sem: any) => (
                <div key={sem.sem} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xs text-slate-400 uppercase font-bold">Semester {sem.sem}</span>
                  <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                    {sem.gpa} SGPA
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold">{sem.credits} Credits • {sem.result}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 4: FEES & RECEIPTS */}
      {activeTab === 'fees' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              College Fee Clearance & Official Payment Receipts
            </h3>
            <p className="text-xs text-slate-500">
              Academic Year 2026-2027 (Odd Semester) • Easwari Engineering College Accounts Section
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tuition Fee */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 uppercase font-semibold">Tuition & College Amenities</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">₹85,000</div>
              <div className="flex items-center justify-between text-xs text-emerald-600 font-bold pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Fully Paid</span>
                <button
                  onClick={() => handleDownloadReceipt('Tuition Fee', 'EEC/REC/2026/8941')}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Receipt</span>
                </button>
              </div>
            </div>

            {/* Exam Fee */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 uppercase font-semibold">Autonomous Exam Registration</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">₹3,200</div>
              <div className="flex items-center justify-between text-xs text-emerald-600 font-bold pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Paid</span>
                <button
                  onClick={() => handleDownloadReceipt('Exam Registration Fee', 'EEC/EXAM/2026/1029')}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Receipt</span>
                </button>
              </div>
            </div>

            {/* Bus Fee */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 uppercase font-semibold">College Transport (Bus Route 14)</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">₹35,000</div>
              <div className="flex items-center justify-between text-xs text-emerald-600 font-bold pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Paid</span>
                <button
                  onClick={() => handleDownloadReceipt('Bus Transport Fee', 'EEC/BUS/2026/4102')}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 5: STUDENT PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <img
              src={currentUser.avatar}
              alt=""
              className="w-16 h-16 rounded-full object-cover ring-4 ring-amber-500/30"
            />
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {currentUser.name}
              </h3>
              <p className="text-xs text-slate-500">
                {currentUser.role === 'STUDENT'
                  ? `B.E. Computer Science & Engineering • Reg No: ${currentUser.registerNumber}`
                  : `${currentUser.designation} • ${currentUser.department}`}
              </p>
              <span className="inline-block mt-1 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                Easwari Autonomous 2023 Regulation
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-400 block text-[10px]">ROLL NUMBER</span>
              <strong className="text-slate-900 dark:text-white">22CS142</strong>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-400 block text-[10px]">CURRENT SEMESTER & SECTION</span>
              <strong className="text-slate-900 dark:text-white">Semester 5 (Section B)</strong>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-400 block text-[10px]">MENTOR / CLASS COORDINATOR</span>
              <strong className="text-slate-900 dark:text-white">Dr. S. Vignesh (Asst. Prof Sr.G)</strong>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-400 block text-[10px]">HEAD OF DEPARTMENT</span>
              <strong className="text-slate-900 dark:text-white">Dr. G. S. Anandha Mala (Prof & HOD)</strong>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-400 block text-[10px]">ACADEMIC CGPA</span>
              <strong className="text-emerald-600 font-bold">8.82 / 10.0 (First Class with Distinction)</strong>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-400 block text-[10px]">ADMISSION QUOTA</span>
              <strong className="text-slate-900 dark:text-white">TNEA Counseling (General Rank 4,120)</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
