import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Initial Mock Data Store reflecting Easwari Engineering College (EEC) ERP & Classroom Layer
interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'MENTOR' | 'HOD';
  department: string;
  registerNumber?: string;
  semester?: number;
  section?: string;
  designation?: string;
  assignedSubjects?: { code: string; name: string; sem: number; section: string }[];
  assignedClass?: string;
  avatar: string;
}

const users: Record<string, User> = {
  'student-1': {
    id: 'student-1',
    name: 'Harish Kumar S',
    email: 'harish.k@eec.srmrmp.edu.in',
    role: 'STUDENT',
    department: 'Computer Science and Engineering',
    registerNumber: '310622104082',
    semester: 5,
    section: 'B',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  'teacher-1': {
    id: 'teacher-1',
    name: 'Dr. K. Meenakshi',
    email: 'meenakshi.k@eec.srmrmp.edu.in',
    role: 'TEACHER',
    department: 'Computer Science and Engineering',
    designation: 'Associate Professor',
    assignedSubjects: [
      { code: 'CS3551', name: 'Machine Learning', sem: 5, section: 'B' },
      { code: 'CS3591', name: 'Computer Networks', sem: 5, section: 'A' },
      { code: 'CS3601', name: 'Deep Learning', sem: 6, section: 'B' },
    ],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  'mentor-1': {
    id: 'mentor-1',
    name: 'Dr. S. Vignesh',
    email: 'vignesh.s@eec.srmrmp.edu.in',
    role: 'MENTOR',
    department: 'Computer Science and Engineering',
    designation: 'Assistant Professor (Sr.G) & Class Coordinator CSE-5B',
    assignedClass: 'CSE 3rd Year - Section B',
    assignedSubjects: [
      { code: 'CS3501', name: 'Compiler Design', sem: 5, section: 'B' },
    ],
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  },
  'hod-1': {
    id: 'hod-1',
    name: 'Dr. G. S. Anandha Mala',
    email: 'hod.cse@eec.srmrmp.edu.in',
    role: 'HOD',
    department: 'Computer Science and Engineering',
    designation: 'Professor & Head of the Department (CSE)',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
  },
};

// Notes Data
let notes = [
  {
    id: 'note-1',
    title: 'Unit 1: Introduction to Machine Learning & Supervised Learning',
    subjectCode: 'CS3551',
    subjectName: 'Machine Learning',
    department: 'Computer Science and Engineering',
    semester: 5,
    unit: 'Unit 1',
    facultyName: 'Dr. K. Meenakshi',
    facultyId: 'teacher-1',
    fileType: 'pdf',
    fileSize: '4.8 MB',
    uploadDate: '2026-09-18',
    category: 'Lecture Notes',
    description: 'Comprehensive handwritten & typed lecture notes covering Linear Regression, Logistic Regression, Gradient Descent, Overfitting, and Regularization (L1/L2).',
    downloadCount: 142,
    fileUrl: '#download-unit1-ml',
    tags: ['Supervised Learning', 'Linear Regression', 'Cost Function', 'Anna University Syllabus'],
  },
  {
    id: 'note-2',
    title: 'Unit 2: Decision Trees, SVM & Ensemble Methods',
    subjectCode: 'CS3551',
    subjectName: 'Machine Learning',
    department: 'Computer Science and Engineering',
    semester: 5,
    unit: 'Unit 2',
    facultyName: 'Dr. K. Meenakshi',
    facultyId: 'teacher-1',
    fileType: 'ppt',
    fileSize: '12.4 MB',
    uploadDate: '2026-09-24',
    category: 'Lecture Notes',
    description: 'Presentation slides with worked numerical problems on ID3, Gini Impurity, Support Vector Machines (Hard/Soft margin, Kernel trick), and Random Forests.',
    downloadCount: 98,
    fileUrl: '#download-unit2-ml',
    tags: ['Entropy', 'SVM Kernels', 'Random Forest', 'Boosting'],
  },
  {
    id: 'note-3',
    title: 'Machine Learning CAT-1 Question Bank & Important 16-Mark Questions',
    subjectCode: 'CS3551',
    subjectName: 'Machine Learning',
    department: 'Computer Science and Engineering',
    semester: 5,
    unit: 'All Units',
    facultyName: 'Dr. K. Meenakshi',
    facultyId: 'teacher-1',
    fileType: 'pdf',
    fileSize: '2.1 MB',
    uploadDate: '2026-09-27',
    category: 'Question Bank',
    description: 'Easwari autonomous exam pattern question bank: Part A (2-mark with answers) + Part B (13-mark analytical questions) + Part C (15-mark case study).',
    downloadCount: 215,
    fileUrl: '#download-qb-ml',
    tags: ['Important Questions', 'Exam Bank', 'CAT-1 Preparation'],
  },
  {
    id: 'note-4',
    title: 'Unit 1 & 2: Computer Networks - Physical & Data Link Layer Protocols',
    subjectCode: 'CS3591',
    subjectName: 'Computer Networks',
    department: 'Computer Science and Engineering',
    semester: 5,
    unit: 'Unit 1',
    facultyName: 'Dr. K. Meenakshi',
    facultyId: 'teacher-1',
    fileType: 'pdf',
    fileSize: '6.2 MB',
    uploadDate: '2026-09-12',
    category: 'Lecture Notes',
    description: 'Detailed study materials on OSI Model vs TCP/IP, Framing, Error Detection (CRC-32, Checksum), Sliding Window protocols (Go-Back-N, Selective Repeat).',
    downloadCount: 160,
    fileUrl: '#download-cn-unit1',
    tags: ['OSI Model', 'CRC Algorithm', 'Sliding Window', 'HDLC'],
  },
  {
    id: 'note-5',
    title: 'Compiler Design: Lexical Analysis & LEX/FLEX Implementation',
    subjectCode: 'CS3501',
    subjectName: 'Compiler Design',
    department: 'Computer Science and Engineering',
    semester: 5,
    unit: 'Unit 1',
    facultyName: 'Dr. S. Vignesh',
    facultyId: 'mentor-1',
    fileType: 'pdf',
    fileSize: '3.9 MB',
    uploadDate: '2026-09-15',
    category: 'Lecture Notes',
    description: 'Phases of compiler, Regular Expressions to DFA conversion (Thompson construction, Subset construction), and practical LEX specifications.',
    downloadCount: 110,
    fileUrl: '#download-cd-unit1',
    tags: ['Compiler Phases', 'Lexical Analyzer', 'NFA to DFA', 'LEX Tool'],
  },
  {
    id: 'note-6',
    title: 'Assignment 1: Implementation of Gradient Descent in Python with Real Estate Dataset',
    subjectCode: 'CS3551',
    subjectName: 'Machine Learning',
    department: 'Computer Science and Engineering',
    semester: 5,
    unit: 'Unit 1',
    facultyName: 'Dr. K. Meenakshi',
    facultyId: 'teacher-1',
    fileType: 'doc',
    fileSize: '1.4 MB',
    uploadDate: '2026-09-20',
    category: 'Assignment Handout',
    description: 'Assignment specifications, Jupyter Notebook starter code, submission deadline: Oct 8, 2026. Evaluation rubric included.',
    downloadCount: 89,
    fileUrl: '#download-assignment1-ml',
    tags: ['Python', 'Jupyter', 'Assignment 1', 'Rubric'],
  },
];

// OD (On-Duty) Requests Data
let odRequests = [
  {
    id: 'od-101',
    applicationId: 'EEC/OD/2026/0418',
    studentId: 'student-1',
    studentName: 'Harish Kumar S',
    registerNumber: '310622104082',
    department: 'Computer Science and Engineering',
    semester: 5,
    section: 'B',
    category: 'Hackathon & Expo',
    eventName: 'Smart India Hackathon 2026 - Regional Finale',
    organizingCollege: 'IIT Madras Research Park, Chennai',
    fromDate: '2026-10-04',
    toDate: '2026-10-05',
    totalDays: 2,
    periodsRequested: 'All Periods (1 to 7)',
    reason: 'Selected for 36-hour offline Hackathon on AI for Healthcare. Team "ByteCrafters" representing Easwari Engineering College.',
    proofFileName: 'SIH2026_Shortlist_Letter_Harish.pdf',
    proofFileSize: '1.8 MB',
    status: 'Forwarded to HOD',
    mentorReview: {
      reviewedBy: 'Dr. S. Vignesh',
      comments: 'Recommended. Student has maintained 88.4% attendance and is the team lead representing our college.',
      date: '2026-09-28 14:30',
      decision: 'FORWARDED',
    },
    hodReview: null,
    appliedAt: '2026-09-28 10:15',
    qrCodeHash: 'EEC-OD-AUTH-SIH-310622104082',
  },
  {
    id: 'od-102',
    applicationId: 'EEC/OD/2026/0394',
    studentId: 'student-1',
    studentName: 'Harish Kumar S',
    registerNumber: '310622104082',
    department: 'Computer Science and Engineering',
    semester: 5,
    section: 'B',
    category: 'Paper Presentation',
    eventName: 'IEEE International Conference on Next-Gen Computing (ICNGC 2026)',
    organizingCollege: 'PSG College of Technology, Coimbatore',
    fromDate: '2026-09-08',
    toDate: '2026-09-09',
    totalDays: 2,
    periodsRequested: 'All Periods (1 to 7)',
    reason: 'Oral presentation of research paper titled "Edge-AI Architectures for IoT Anomaly Detection".',
    proofFileName: 'IEEE_Acceptance_EEC_Paper.pdf',
    proofFileSize: '2.4 MB',
    status: 'Approved',
    mentorReview: {
      reviewedBy: 'Dr. S. Vignesh',
      comments: 'Verified IEEE acceptance letter. Highly commendable paper representation.',
      date: '2026-09-02 11:20',
      decision: 'FORWARDED',
    },
    hodReview: {
      reviewedBy: 'Dr. G. S. Anandha Mala',
      comments: 'Approved with college travel grant provision. OD granted for 2 days.',
      date: '2026-09-03 16:45',
      decision: 'APPROVED',
    },
    appliedAt: '2026-09-01 17:00',
    qrCodeHash: 'EEC-OD-AUTH-IEEE-310622104082',
  },
  {
    id: 'od-103',
    applicationId: 'EEC/OD/2026/0430',
    studentId: 'student-2',
    studentName: 'Divya Bharathi M',
    registerNumber: '310622104055',
    department: 'Computer Science and Engineering',
    semester: 5,
    section: 'B',
    category: 'Sports / Zonal',
    eventName: 'Anna University Zonal Badminton Tournament (Zone IV)',
    organizingCollege: 'St. Joseph\'s College of Engineering, Chennai',
    fromDate: '2026-10-06',
    toDate: '2026-10-07',
    totalDays: 2,
    periodsRequested: 'All Periods (1 to 7)',
    reason: 'Representing Easwari Engineering College Women\'s Badminton Varsity team.',
    proofFileName: 'Sports_Council_Nomination.pdf',
    proofFileSize: '850 KB',
    status: 'Under Mentor Review',
    mentorReview: null,
    hodReview: null,
    appliedAt: '2026-09-29 11:45',
    qrCodeHash: 'EEC-OD-AUTH-SPORTS-310622104055',
  },
  {
    id: 'od-104',
    applicationId: 'EEC/OD/2026/0435',
    studentId: 'student-3',
    studentName: 'Rohan Sundaram',
    registerNumber: '310622104112',
    department: 'Computer Science and Engineering',
    semester: 5,
    section: 'B',
    category: 'Symposium',
    eventName: 'Shaastra 2026 - Coding Marathon',
    organizingCollege: 'IIT Madras',
    fromDate: '2026-10-10',
    toDate: '2026-10-10',
    totalDays: 1,
    periodsRequested: 'Periods 3 to 7',
    reason: 'Participating in algorithmic coding finals round at IIT Madras.',
    proofFileName: 'Shaastra_Admit_Card.pdf',
    proofFileSize: '1.1 MB',
    status: 'Under Mentor Review',
    mentorReview: null,
    hodReview: null,
    appliedAt: '2026-09-29 15:20',
    qrCodeHash: 'EEC-OD-AUTH-SHAASTRA-310622104112',
  },
];

// Announcements Data
let announcements = [
  {
    id: 'ann-1',
    title: 'Machine Learning: Continuous Assessment Test - 1 (CAT-1) Schedule & Portions',
    content: 'Dear 5th Semester CSE Students, CAT-1 for CS3551 Machine Learning will be conducted on October 12, 2026. Portions: Unit 1 (Full) and Unit 2 (up to Support Vector Machines). Question paper will follow the latest Easwari Autonomous 2023 Regulation pattern. Bring non-programmable scientific calculators.',
    authorName: 'Dr. K. Meenakshi',
    authorRole: 'Associate Professor (Subject In-Charge)',
    department: 'Computer Science and Engineering',
    category: 'Test Schedule',
    priority: 'HIGH',
    date: '2026-09-26',
    targetAudience: { department: 'Computer Science and Engineering', semester: 5, section: 'ALL', subject: 'Machine Learning' },
    attachments: [{ name: 'CAT1_Portions_TimeTable_CSE.pdf', size: '640 KB' }],
  },
  {
    id: 'ann-2',
    title: 'Assignment 1 Submission Portal Open - Deadline Oct 8, 2026 (11:59 PM)',
    content: 'All CSE-B students are instructed to submit their Jupyter notebook reports for Assignment 1 (Implementation of Gradient Descent) through the Classroom portal. Ensure all loss curves and test predictions are clearly plotted.',
    authorName: 'Dr. K. Meenakshi',
    authorRole: 'Associate Professor',
    department: 'Computer Science and Engineering',
    category: 'Assignment',
    priority: 'NORMAL',
    date: '2026-09-22',
    targetAudience: { department: 'Computer Science and Engineering', semester: 5, section: 'B', subject: 'Machine Learning' },
    attachments: [{ name: 'Assignment_1_Rubric.pdf', size: '320 KB' }],
  },
  {
    id: 'ann-3',
    title: 'CSE-5B: Mandatory Mentor Meeting & Low Attendance Review',
    content: 'A mentor review session will be held this Thursday at 3:30 PM in CSE Seminar Hall 2. Students with attendance below 75% in any subject are required to attend with their parent/guardian communication acknowledgment.',
    authorName: 'Dr. S. Vignesh',
    authorRole: 'Class Coordinator (CSE-5B)',
    department: 'Computer Science and Engineering',
    category: 'Important Notice',
    priority: 'URGENT',
    date: '2026-09-29',
    targetAudience: { department: 'Computer Science and Engineering', semester: 5, section: 'B' },
  },
  {
    id: 'ann-4',
    title: 'Guest Lecture on "Industrial Generative AI & LLM Deployment in Cloud"',
    content: 'The Department of CSE is organizing a Guest Lecture delivered by Mr. Arvind Raghavan, Principal AI Architect, Microsoft Cloud & AI. Venue: EEC TRP Auditorium. Attendance is mandatory for all 3rd and 4th year CSE students.',
    authorName: 'Dr. G. S. Anandha Mala',
    authorRole: 'Professor & HOD (CSE)',
    department: 'Computer Science and Engineering',
    category: 'Seminar',
    priority: 'HIGH',
    date: '2026-09-25',
    targetAudience: { department: 'Computer Science and Engineering', semester: 'ALL', section: 'ALL' },
  },
];

// Student ERP Profile & Mock Integrated Modules
const studentERPData = {
  profile: {
    name: 'Harish Kumar S',
    registerNumber: '310622104082',
    rollNumber: '22CS142',
    degree: 'B.E. Computer Science and Engineering (Autonomous)',
    college: 'Easwari Engineering College (Autonomous), Ramapuram, Chennai',
    batch: '2022 - 2026',
    currentSemester: 5,
    section: 'B',
    mentor: 'Dr. S. Vignesh (Asst. Prof Sr.G)',
    hod: 'Dr. G. S. Anandha Mala',
    cgpa: '8.82',
    standingArrears: 0,
    historyOfArrears: 0,
    quota: 'Counseling (TNEA)',
    bloodGroup: 'O+ve',
    emergencyContact: '+91 98401 23456',
  },
  courseEnrollment: [
    { code: 'CS3551', name: 'Machine Learning', type: 'Professional Core', credits: 4, faculty: 'Dr. K. Meenakshi' },
    { code: 'CS3591', name: 'Computer Networks', type: 'Professional Core', credits: 4, faculty: 'Dr. K. Meenakshi' },
    { code: 'CS3501', name: 'Compiler Design', type: 'Professional Core', credits: 4, faculty: 'Dr. S. Vignesh' },
    { code: 'CS3511', name: 'Cloud Computing Architecture', type: 'Professional Elective I', credits: 3, faculty: 'Dr. P. Suresh' },
    { code: 'CS3581', name: 'Machine Learning Laboratory', type: 'Practical', credits: 2, faculty: 'Dr. K. Meenakshi' },
    { code: 'CS3582', name: 'Computer Networks Laboratory', type: 'Practical', credits: 2, faculty: 'Mrs. R. Priyadarshini' },
    { code: 'HS3501', name: 'Professional Ethics & Human Values', type: 'Humanities', credits: 2, faculty: 'Dr. B. Latha' },
  ],
  attendance: {
    overallPercentage: 88.4,
    totalConductedHours: 242,
    totalAttendedHours: 214,
    odApprovedHours: 14,
    effectivePercentage: 94.2, // With approved OD credit
    status: 'Eligible for End-Sem Exam',
    subjects: [
      { code: 'CS3551', name: 'Machine Learning', conducted: 40, attended: 36, od: 2, percentage: 90.0, faculty: 'Dr. K. Meenakshi' },
      { code: 'CS3591', name: 'Computer Networks', conducted: 38, attended: 33, od: 2, percentage: 86.8, faculty: 'Dr. K. Meenakshi' },
      { code: 'CS3501', name: 'Compiler Design', conducted: 42, attended: 38, od: 2, percentage: 90.4, faculty: 'Dr. S. Vignesh' },
      { code: 'CS3511', name: 'Cloud Computing Architecture', conducted: 36, attended: 29, od: 2, percentage: 80.5, faculty: 'Dr. P. Suresh' },
      { code: 'CS3581', name: 'ML Lab', conducted: 24, attended: 24, od: 0, percentage: 100.0, faculty: 'Dr. K. Meenakshi' },
      { code: 'CS3582', name: 'CN Lab', conducted: 24, attended: 22, od: 0, percentage: 91.6, faculty: 'Mrs. R. Priyadarshini' },
      { code: 'HS3501', name: 'Professional Ethics', conducted: 20, attended: 18, od: 0, percentage: 90.0, faculty: 'Dr. B. Latha' },
    ],
  },
  timetable: {
    weekdays: [
      {
        day: 'Monday',
        periods: [
          { time: '08:30 - 09:20', subject: 'Machine Learning', code: 'CS3551', room: 'CS-302', faculty: 'Dr. K. Meenakshi' },
          { time: '09:20 - 10:10', subject: 'Computer Networks', code: 'CS3591', room: 'CS-302', faculty: 'Dr. K. Meenakshi' },
          { time: '10:25 - 11:15', subject: 'Compiler Design', code: 'CS3501', room: 'CS-302', faculty: 'Dr. S. Vignesh' },
          { time: '11:15 - 12:05', subject: 'Cloud Computing', code: 'CS3511', room: 'CS-302', faculty: 'Dr. P. Suresh' },
          { time: '12:45 - 01:35', subject: 'Library / Mentoring', code: 'LIB', room: 'Central Lib', faculty: 'Dr. S. Vignesh' },
          { time: '01:35 - 03:15', subject: 'Machine Learning Lab (Batch 1)', code: 'CS3581', room: 'Lab 4', faculty: 'Dr. K. Meenakshi' },
        ],
      },
      {
        day: 'Tuesday',
        periods: [
          { time: '08:30 - 09:20', subject: 'Compiler Design', code: 'CS3501', room: 'CS-302', faculty: 'Dr. S. Vignesh' },
          { time: '09:20 - 10:10', subject: 'Machine Learning', code: 'CS3551', room: 'CS-302', faculty: 'Dr. K. Meenakshi' },
          { time: '10:25 - 11:15', subject: 'Professional Ethics', code: 'HS3501', room: 'CS-302', faculty: 'Dr. B. Latha' },
          { time: '11:15 - 12:05', subject: 'Computer Networks', code: 'CS3591', room: 'CS-302', faculty: 'Dr. K. Meenakshi' },
          { time: '12:45 - 03:15', subject: 'Computer Networks Lab', code: 'CS3582', room: 'Lab 2', faculty: 'Mrs. R. Priyadarshini' },
        ],
      },
      {
        day: 'Wednesday',
        periods: [
          { time: '08:30 - 09:20', subject: 'Cloud Computing', code: 'CS3511', room: 'CS-302', faculty: 'Dr. P. Suresh' },
          { time: '09:20 - 10:10', subject: 'Machine Learning', code: 'CS3551', room: 'CS-302', faculty: 'Dr. K. Meenakshi' },
          { time: '10:25 - 11:15', subject: 'Computer Networks', code: 'CS3591', room: 'CS-302', faculty: 'Dr. K. Meenakshi' },
          { time: '11:15 - 12:05', subject: 'Compiler Design', code: 'CS3501', room: 'CS-302', faculty: 'Dr. S. Vignesh' },
          { time: '12:45 - 02:25', subject: 'Open Elective / MOOCs', code: 'OE', room: 'Smart Class 1', faculty: 'Staff' },
          { time: '02:25 - 03:15', subject: 'Sports / Physical Ed', code: 'PED', room: 'Grounds', faculty: 'Physical Director' },
        ],
      },
      {
        day: 'Thursday',
        periods: [
          { time: '08:30 - 09:20', subject: 'Computer Networks', code: 'CS3591', room: 'CS-302', faculty: 'Dr. K. Meenakshi' },
          { time: '09:20 - 10:10', subject: 'Compiler Design', code: 'CS3501', room: 'CS-302', faculty: 'Dr. S. Vignesh' },
          { time: '10:25 - 11:15', subject: 'Cloud Computing', code: 'CS3511', room: 'CS-302', faculty: 'Dr. P. Suresh' },
          { time: '11:15 - 12:05', subject: 'Machine Learning', code: 'CS3551', room: 'CS-302', faculty: 'Dr. K. Meenakshi' },
          { time: '12:45 - 03:15', subject: 'Project Work / Ideation Lab', code: 'PRJ', room: 'Innovation Lab', faculty: 'Dr. S. Vignesh' },
        ],
      },
      {
        day: 'Friday',
        periods: [
          { time: '08:30 - 09:20', subject: 'Professional Ethics', code: 'HS3501', room: 'CS-302', faculty: 'Dr. B. Latha' },
          { time: '09:20 - 10:10', subject: 'Machine Learning', code: 'CS3551', room: 'CS-302', faculty: 'Dr. K. Meenakshi' },
          { time: '10:25 - 11:15', subject: 'Cloud Computing', code: 'CS3511', room: 'CS-302', faculty: 'Dr. P. Suresh' },
          { time: '11:15 - 12:05', subject: 'Computer Networks', code: 'CS3591', room: 'CS-302', faculty: 'Dr. K. Meenakshi' },
          { time: '12:45 - 02:25', subject: 'Machine Learning Lab (Batch 2)', code: 'CS3581', room: 'Lab 4', faculty: 'Dr. K. Meenakshi' },
          { time: '02:25 - 03:15', subject: 'Technical Seminar & Aptitude', code: 'APT', room: 'CS-302', faculty: 'Placement Cell' },
        ],
      },
    ],
  },
  assessments: {
    cat1: [
      { code: 'CS3551', name: 'Machine Learning', max: 50, scored: 44, status: 'Completed' },
      { code: 'CS3591', name: 'Computer Networks', max: 50, scored: 41, status: 'Completed' },
      { code: 'CS3501', name: 'Compiler Design', max: 50, scored: 46, status: 'Completed' },
      { code: 'CS3511', name: 'Cloud Computing', max: 50, scored: 39, status: 'Completed' },
      { code: 'HS3501', name: 'Professional Ethics', max: 50, scored: 45, status: 'Completed' },
    ],
    cat2: [
      { code: 'CS3551', name: 'Machine Learning', max: 50, scored: null, status: 'Scheduled Oct 12' },
      { code: 'CS3591', name: 'Computer Networks', max: 50, scored: null, status: 'Scheduled Oct 14' },
      { code: 'CS3501', name: 'Compiler Design', max: 50, scored: null, status: 'Scheduled Oct 16' },
      { code: 'CS3511', name: 'Cloud Computing', max: 50, scored: null, status: 'Scheduled Oct 18' },
      { code: 'HS3501', name: 'Professional Ethics', max: 50, scored: null, status: 'Scheduled Oct 20' },
    ],
    semesterResults: [
      { sem: 1, gpa: 8.75, credits: 21, result: 'Pass' },
      { sem: 2, gpa: 8.90, credits: 23, result: 'Pass' },
      { sem: 3, gpa: 8.65, credits: 24, result: 'Pass' },
      { sem: 4, gpa: 8.96, credits: 25, result: 'Pass' },
    ],
  },
  fees: {
    academicYear: '2026 - 2027 (Odd Semester)',
    tuitionFee: { total: 85000, paid: 85000, balance: 0, status: 'Fully Paid', receiptNo: 'EEC/REC/2026/8941' },
    examFee: { total: 3200, paid: 3200, balance: 0, status: 'Paid', receiptNo: 'EEC/EXAM/2026/1029' },
    busFee: { total: 35000, paid: 35000, balance: 0, status: 'Paid (Route 14 - Tambaram)', receiptNo: 'EEC/BUS/2026/4102' },
    dueAmount: 0,
  },
};

// REST API Endpoints

// Auth / User Switcher
app.get('/api/auth/users', (req: Request, res: Response) => {
  res.json(Object.values(users));
});

app.get('/api/auth/me/:id', (req: Request, res: Response) => {
  const user = users[req.params.id] || users['student-1'];
  res.json({ user, token: `jwt-bearer-${user.id}-${Date.now()}` });
});

// Notes APIs
app.get('/api/notes', (req: Request, res: Response) => {
  const { department, semester, subjectCode, unit, category, search } = req.query;
  let filtered = [...notes];

  if (department && department !== 'ALL') {
    filtered = filtered.filter(n => n.department === department);
  }
  if (semester && semester !== 'ALL') {
    filtered = filtered.filter(n => n.semester === Number(semester));
  }
  if (subjectCode && subjectCode !== 'ALL') {
    filtered = filtered.filter(n => n.subjectCode === subjectCode);
  }
  if (unit && unit !== 'ALL') {
    filtered = filtered.filter(n => n.unit === unit || n.unit === 'All Units');
  }
  if (category && category !== 'ALL') {
    filtered = filtered.filter(n => n.category === category);
  }
  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      n =>
        n.title.toLowerCase().includes(q) ||
        n.subjectName.toLowerCase().includes(q) ||
        n.subjectCode.toLowerCase().includes(q) ||
        n.facultyName.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json(filtered);
});

app.post('/api/notes', (req: Request, res: Response) => {
  const { title, subjectCode, subjectName, department, semester, unit, facultyName, facultyId, fileType, fileSize, category, description, tags } = req.body;
  
  const newNote = {
    id: `note-${Date.now()}`,
    title: title || 'Untitled Course Material',
    subjectCode: subjectCode || 'CS3551',
    subjectName: subjectName || 'Machine Learning',
    department: department || 'Computer Science and Engineering',
    semester: Number(semester) || 5,
    unit: unit || 'Unit 1',
    facultyName: facultyName || 'Dr. K. Meenakshi',
    facultyId: facultyId || 'teacher-1',
    fileType: fileType || 'pdf',
    fileSize: fileSize || '3.5 MB',
    uploadDate: new Date().toISOString().split('T')[0],
    category: category || 'Lecture Notes',
    description: description || 'Course unit material uploaded by faculty.',
    downloadCount: 0,
    fileUrl: `#material-${Date.now()}`,
    tags: tags || ['Easwari Engineering College', 'Syllabus Notes'],
  };

  notes.unshift(newNote);
  res.status(201).json(newNote);
});

app.delete('/api/notes/:id', (req: Request, res: Response) => {
  notes = notes.filter(n => n.id !== req.params.id);
  res.json({ success: true, message: 'Note deleted successfully' });
});

// OD (On-Duty) APIs
app.get('/api/od', (req: Request, res: Response) => {
  const { studentId, role, status } = req.query;
  let result = [...odRequests];

  if (role === 'STUDENT' && studentId) {
    result = result.filter(o => o.studentId === studentId);
  } else if (role === 'MENTOR') {
    // Mentors see all their section's requests
    result = result.filter(o => o.section === 'B');
  } else if (role === 'HOD') {
    // HOD sees department requests, prioritizing forwarded ones
    result = result.filter(o => o.department === 'Computer Science and Engineering');
  }

  if (status && status !== 'ALL') {
    result = result.filter(o => o.status === status);
  }

  res.json(result);
});

app.post('/api/od/apply', (req: Request, res: Response) => {
  const { studentId, studentName, registerNumber, department, semester, section, category, eventName, organizingCollege, fromDate, toDate, totalDays, periodsRequested, reason, proofFileName } = req.body;
  
  const newOD = {
    id: `od-${Date.now()}`,
    applicationId: `EEC/OD/2026/0${Math.floor(400 + Math.random() * 500)}`,
    studentId: studentId || 'student-1',
    studentName: studentName || 'Harish Kumar S',
    registerNumber: registerNumber || '310622104082',
    department: department || 'Computer Science and Engineering',
    semester: Number(semester) || 5,
    section: section || 'B',
    category: category || 'Hackathon & Expo',
    eventName: eventName || 'Inter-College Symposium',
    organizingCollege: organizingCollege || 'Anna University, Guindy',
    fromDate: fromDate || '2026-10-15',
    toDate: toDate || '2026-10-15',
    totalDays: Number(totalDays) || 1,
    periodsRequested: periodsRequested || 'All Periods (1 to 7)',
    reason: reason || 'Participation in technical event.',
    proofFileName: proofFileName || 'Event_Proof_Document.pdf',
    proofFileSize: '1.2 MB',
    status: 'Under Mentor Review',
    mentorReview: null,
    hodReview: null,
    appliedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    qrCodeHash: `EEC-OD-AUTH-${Date.now()}-${registerNumber || '310622104082'}`,
  };

  odRequests.unshift(newOD);
  res.status(201).json(newOD);
});

// Mentor Action on OD
app.put('/api/od/:id/mentor', (req: Request, res: Response) => {
  const { action, comments, mentorName } = req.body; // action: 'FORWARD' | 'REJECT' | 'APPROVE'
  const od = odRequests.find(o => o.id === req.params.id);

  if (!od) {
    return res.status(404).json({ error: 'OD request not found' });
  }

  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

  if (action === 'FORWARD') {
    od.status = 'Forwarded to HOD';
    od.mentorReview = {
      reviewedBy: mentorName || 'Dr. S. Vignesh',
      comments: comments || 'Verified event details and attendance. Forwarded for HOD sanction.',
      date: timestamp,
      decision: 'FORWARDED',
    };
  } else if (action === 'APPROVE') {
    od.status = 'Approved';
    od.mentorReview = {
      reviewedBy: mentorName || 'Dr. S. Vignesh',
      comments: comments || 'Approved directly under 1-day departmental co-curricular provision.',
      date: timestamp,
      decision: 'APPROVED',
    };
  } else if (action === 'REJECT') {
    od.status = 'Rejected';
    od.mentorReview = {
      reviewedBy: mentorName || 'Dr. S. Vignesh',
      comments: comments || 'Insufficient documentation / event date overlaps with internal assessment.',
      date: timestamp,
      decision: 'REJECTED',
    };
  }

  res.json(od);
});

// HOD Action on OD
app.put('/api/od/:id/hod', (req: Request, res: Response) => {
  const { action, comments, hodName } = req.body; // action: 'APPROVE' | 'REJECT'
  const od = odRequests.find(o => o.id === req.params.id);

  if (!od) {
    return res.status(404).json({ error: 'OD request not found' });
  }

  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

  if (action === 'APPROVE') {
    od.status = 'Approved';
    od.hodReview = {
      reviewedBy: hodName || 'Dr. G. S. Anandha Mala',
      comments: comments || 'Final approval granted. ERP attendance records updated with OD credit.',
      date: timestamp,
      decision: 'APPROVED',
    };
  } else if (action === 'REJECT') {
    od.status = 'Rejected';
    od.hodReview = {
      reviewedBy: hodName || 'Dr. G. S. Anandha Mala',
      comments: comments || 'Sanction denied as per academic council guidelines.',
      date: timestamp,
      decision: 'REJECTED',
    };
  }

  res.json(od);
});

// Announcements APIs
app.get('/api/announcements', (req: Request, res: Response) => {
  res.json(announcements);
});

app.post('/api/announcements', (req: Request, res: Response) => {
  const { title, content, authorName, authorRole, department, category, priority, targetAudience } = req.body;
  
  const newAnn = {
    id: `ann-${Date.now()}`,
    title: title || 'Department Notice',
    content: content || '',
    authorName: authorName || 'Dr. K. Meenakshi',
    authorRole: authorRole || 'Associate Professor',
    department: department || 'Computer Science and Engineering',
    category: category || 'Important Notice',
    priority: priority || 'NORMAL',
    date: new Date().toISOString().split('T')[0],
    targetAudience: targetAudience || { department: 'Computer Science and Engineering', semester: 5, section: 'B' },
  };

  announcements.unshift(newAnn);
  res.status(201).json(newAnn);
});

// Integrated ERP Data endpoint
app.get('/api/erp/data', (req: Request, res: Response) => {
  res.json(studentERPData);
});

// AI Chatbot Navigation Assistant
app.post('/api/ai/navigate', async (req: Request, res: Response) => {
  const { query, currentRole, currentRoute } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const normalizedQuery = query.toLowerCase().trim();

  // If Gemini API is available, use server-side @google/genai with gemini-3.8-flash (with quick timeout)
  if (ai && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    try {
      const systemPrompt = `You are "Easwari NavBot", the intelligent Campus AI and Navigation Assistant for the Easwari Engineering College (EEC) Integrated Classroom ERP Portal.
Your job is to answer student, teacher, mentor, and HOD queries with accurate navigation actions, helpful college-specific advice, and direct links to modules.

The portal consists of:
Classroom Extension Modules:
- "notes": Faculty Notes Management (Subject notes, unit 1-5, question banks, PPTs, assignment files)
- "od-apply": On-Duty application form
- "od-track": On-Duty tracking, approvals, and OD Pass generator
- "announcements": Class and department announcements, test dates, notices
- "ai-assistant": The AI assistant view itself

Existing Integrated ERP Modules:
- "timetable": Weekly 7-period schedule, classroom CS-302, labs
- "attendance": Subject-wise percentages, OD adjustments, <75% condonation alerts
- "marks": Internal assessments (CAT-1, CAT-2), Model Exam, Semester CGPA
- "lab": Lab batches, practical courses (ML Lab, CN Lab)
- "fees": Tuition, exam, bus fees, and receipts
- "profile": Student/Faculty ERP profile & credentials
- "architecture": Spring Boot / MySQL architectural mapping

Respond strictly in valid JSON format with:
{
  "reply": "Friendly concise answer speaking as EEC Assistant",
  "targetRoute": "notes" | "od-apply" | "od-track" | "announcements" | "timetable" | "attendance" | "marks" | "lab" | "fees" | "profile" | "architecture" | null,
  "actionText": "Short button label if navigation is recommended, e.g. 'Open Notes Page', 'Apply OD Now', 'View My Attendance'",
  "filterParams": { "subject": "Machine Learning", "unit": "Unit 1", "status": "pending" } (or empty object),
  "quickSuggestions": ["Suggested prompt 1", "Suggested prompt 2"]
}`;

      const aiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `User role: ${currentRole || 'STUDENT'}, current page: ${currentRoute || 'dashboard'}. User query: "${query}"`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI generation timeout')), 3000)
      );

      const aiResponse = (await Promise.race([aiPromise, timeoutPromise])) as any;
      const parsed = JSON.parse(aiResponse.text || '{}');
      return res.json(parsed);
    } catch (err) {
      console.warn('Gemini API call timed out or failed, falling back to smart heuristic navigator:', err);
    }
  }

  // Heuristic Smart Fallback (100% dependable, instant, context-aware)
  let targetRoute: string | null = null;
  let actionText = '';
  let reply = '';
  let filterParams = {};
  const quickSuggestions = [
    'Where are my notes?',
    'How do I apply OD?',
    'Show my pending ODs',
    'What is my attendance in ML?',
    'Show CAT-1 exam marks',
  ];

  if (normalizedQuery.includes('note') || normalizedQuery.includes('material') || normalizedQuery.includes('ppt') || normalizedQuery.includes('question bank') || normalizedQuery.includes('unit')) {
    targetRoute = 'notes';
    actionText = 'Open Notes Page';
    reply = 'Navigating to Faculty Notes! You can view materials organized by Department → Semester → Subject → Faculty → Units (Unit 1 to 5).';
    if (normalizedQuery.includes('ml') || normalizedQuery.includes('machine learning')) {
      filterParams = { subjectCode: 'CS3551' };
      reply = 'Opening CS3551 Machine Learning notes by Dr. K. Meenakshi. Unit 1, Unit 2 slides and CAT-1 Question Bank are ready for download.';
    } else if (normalizedQuery.includes('cn') || normalizedQuery.includes('network')) {
      filterParams = { subjectCode: 'CS3591' };
      reply = 'Opening CS3591 Computer Networks notes. Unit 1 Physical and Data Link Layer notes are available.';
    }
  } else if (normalizedQuery.includes('apply od') || normalizedQuery.includes('apply on-duty') || normalizedQuery.includes('request od') || normalizedQuery.includes('how do i apply')) {
    targetRoute = 'od-apply';
    actionText = 'Open OD Application Form';
    reply = 'Opening the On-Duty (OD) application form. You can submit requests for Hackathons, Paper Presentations, Sports, or Symposia with event proof attached.';
  } else if (normalizedQuery.includes('pending od') || normalizedQuery.includes('track od') || normalizedQuery.includes('od status') || normalizedQuery.includes('my ods') || normalizedQuery.includes('on-duty')) {
    targetRoute = 'od-track';
    actionText = 'View OD Status Tracker';
    reply = 'Opening your OD Management dashboard. You currently have 1 application forwarded to HOD (Smart India Hackathon) and 1 Approved (IEEE Conference).';
    filterParams = { status: 'Pending' };
  } else if (normalizedQuery.includes('announcement') || normalizedQuery.includes('notice') || normalizedQuery.includes('circular') || normalizedQuery.includes('seminar')) {
    targetRoute = 'announcements';
    actionText = 'View Announcements';
    reply = 'Here are the latest college notices. Check out the upcoming CAT-1 schedule from Dr. K. Meenakshi and the Guest Lecture on Generative AI.';
  } else if (normalizedQuery.includes('timetable') || normalizedQuery.includes('schedule') || normalizedQuery.includes('class time') || normalizedQuery.includes('period')) {
    targetRoute = 'timetable';
    actionText = 'View Class Timetable';
    reply = 'Opening your weekly 5th Semester CSE-B Timetable. Period 1 begins at 08:30 AM in Classroom CS-302.';
  } else if (normalizedQuery.includes('attendance') || normalizedQuery.includes('absent') || normalizedQuery.includes('percentage') || normalizedQuery.includes('condonation')) {
    targetRoute = 'attendance';
    actionText = 'Check Attendance';
    reply = 'Your overall attendance is 88.4% (94.2% with approved OD credit). You are well above the 75% minimum threshold for Anna University autonomous exam eligibility!';
  } else if (normalizedQuery.includes('mark') || normalizedQuery.includes('cat') || normalizedQuery.includes('score') || normalizedQuery.includes('cgpa') || normalizedQuery.includes('grade')) {
    targetRoute = 'marks';
    actionText = 'View Assessment Marks';
    reply = 'Opening your Internal Assessment marks. In CAT-1, you scored 44/50 in Machine Learning and 46/50 in Compiler Design. Your cumulative CGPA is 8.82.';
  } else if (normalizedQuery.includes('fee') || normalizedQuery.includes('receipt') || normalizedQuery.includes('tuition') || normalizedQuery.includes('bus fee')) {
    targetRoute = 'fees';
    actionText = 'Open Fee Portal & Receipts';
    reply = 'Opening Fee Details. Your Odd Semester 2026-2027 tuition fee and Route 14 bus fee have been fully paid. Digital receipts are available to download.';
  } else if (normalizedQuery.includes('profile') || normalizedQuery.includes('register number') || normalizedQuery.includes('mentor name')) {
    targetRoute = 'profile';
    actionText = 'View Student Profile';
    reply = 'Opening your ERP Student Profile (Reg No: 310622104082, CSE-5B, Mentor: Dr. S. Vignesh).';
  } else if (normalizedQuery.includes('spring boot') || normalizedQuery.includes('backend') || normalizedQuery.includes('mysql') || normalizedQuery.includes('architecture') || normalizedQuery.includes('api')) {
    targetRoute = 'architecture';
    actionText = 'View Spring Boot Architecture';
    reply = 'Opening the Spring Boot + Spring Security + JWT + MySQL architecture blueprint for this ERP extension layer.';
  } else {
    reply = `I am your Easwari Campus AI Navigator. I can take you directly to your Notes, OD Application, Attendance, Marks, Timetable, or Fee Receipts. What would you like to explore?`;
  }

  res.json({
    reply,
    targetRoute,
    actionText,
    filterParams,
    quickSuggestions,
  });
});

// Provide architectural schema specification for Spring Boot / MySQL
app.get('/api/architecture/spring-boot', (req: Request, res: Response) => {
  res.json({
    architecture: {
      backend: 'Spring Boot 3.3.x with Java 21',
      security: 'Spring Security 6 with Stateless JWT Authentication filter',
      database: 'MySQL 8.0 with Spring Data JPA / Hibernate',
      frontend: 'React 19 + TypeScript + Tailwind CSS',
    },
    controllers: [
      {
        name: 'NotesController',
        path: '/api/v1/notes',
        endpoints: [
          'GET /api/v1/notes (filters: dept, sem, subjectCode, unit, category)',
          'POST /api/v1/notes (MultipartFile upload, @PreAuthorize("hasRole(\'TEACHER\')"))',
          'DELETE /api/v1/notes/{id} (@PreAuthorize("hasRole(\'TEACHER\') or hasRole(\'HOD\')"))',
        ],
      },
      {
        name: 'OnDutyWorkflowController',
        path: '/api/v1/od',
        endpoints: [
          'GET /api/v1/od/student/{studentId} (@PreAuthorize("hasRole(\'STUDENT\')"))',
          'POST /api/v1/od/apply (@PreAuthorize("hasRole(\'STUDENT\')"))',
          'PUT /api/v1/od/{id}/mentor-review (@PreAuthorize("hasRole(\'MENTOR\')"))',
          'PUT /api/v1/od/{id}/hod-review (@PreAuthorize("hasRole(\'HOD\')"))',
          'GET /api/v1/od/export-pass/{id}',
        ],
      },
      {
        name: 'AnnouncementController',
        path: '/api/v1/announcements',
        endpoints: [
          'GET /api/v1/announcements (filtered by targetAudience)',
          'POST /api/v1/announcements (@PreAuthorize("hasRole(\'TEACHER\') or hasRole(\'HOD\')"))',
        ],
      },
    ],
  });
});

// Setup Vite in middleware mode for Development or serve static in Production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
