export type UserRole = 'STUDENT' | 'TEACHER' | 'MENTOR' | 'HOD' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  registerNumber?: string;
  semester?: number;
  section?: string;
  designation?: string;
  assignedSubjects?: { code: string; name: string; sem: number; section: string }[];
  assignedClass?: string;
  avatar: string;
}

export type NoteCategory = 'Lecture Notes' | 'Question Bank' | 'Assignment Handout' | 'Important Questions' | 'Lab Manual';

export interface NoteItem {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  department: string;
  semester: number;
  unit: string;
  facultyName: string;
  facultyId: string;
  fileType: 'pdf' | 'ppt' | 'doc' | 'zip';
  fileSize: string;
  uploadDate: string;
  category: NoteCategory;
  description: string;
  downloadCount: number;
  fileUrl: string;
  tags: string[];
}

export type ODCategory =
  | 'Hackathon & Expo'
  | 'Paper Presentation'
  | 'Symposium'
  | 'Sports / Zonal'
  | 'Cultural Event'
  | 'Internship / Industrial Visit'
  | 'NSS / NCC';

export type ODStatus =
  | 'Pending'
  | 'Under Mentor Review'
  | 'Forwarded to HOD'
  | 'Approved'
  | 'Rejected';

export interface ReviewRecord {
  reviewedBy: string;
  comments: string;
  date: string;
  decision: 'FORWARDED' | 'APPROVED' | 'REJECTED';
}

export interface ODRequest {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  registerNumber: string;
  department: string;
  semester: number;
  section: string;
  category: ODCategory;
  eventName: string;
  organizingCollege: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  periodsRequested: string;
  reason: string;
  proofFileName: string;
  proofFileSize: string;
  status: ODStatus;
  mentorReview: ReviewRecord | null;
  hodReview: ReviewRecord | null;
  appliedAt: string;
  qrCodeHash: string;
}

export type AnnouncementCategory =
  | 'Assignment'
  | 'Test Schedule'
  | 'Lab'
  | 'Seminar'
  | 'Important Notice';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  department: string;
  category: AnnouncementCategory;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  date: string;
  targetAudience: {
    department: string;
    semester: number | 'ALL';
    section: string | 'ALL';
    subject?: string;
  };
  attachments?: { name: string; size: string }[];
}

export interface NavBotResponse {
  reply: string;
  targetRoute: string | null;
  actionText?: string;
  filterParams?: Record<string, any>;
  quickSuggestions?: string[];
}

export type ActiveTab =
  | 'dashboard'
  | 'notes'
  | 'od-apply'
  | 'od-track'
  | 'announcements'
  | 'timetable'
  | 'attendance'
  | 'marks'
  | 'lab'
  | 'fees'
  | 'profile'
  | 'architecture';
