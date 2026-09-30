import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, NoteItem, ODRequest, Announcement, ActiveTab } from '../types';

interface PortalContextType {
  currentUser: User;
  setCurrentUserById: (id: string) => void;
  availableUsers: User[];
  darkMode: boolean;
  toggleDarkMode: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  notes: NoteItem[];
  isLoadingNotes: boolean;
  fetchNotes: (filters?: Record<string, string>) => Promise<void>;
  addNote: (noteData: Partial<NoteItem>) => Promise<NoteItem>;
  deleteNote: (id: string) => Promise<void>;
  notesFilter: {
    department: string;
    semester: string;
    subjectCode: string;
    unit: string;
    category: string;
    search: string;
  };
  setNotesFilter: React.Dispatch<React.SetStateAction<{
    department: string;
    semester: string;
    subjectCode: string;
    unit: string;
    category: string;
    search: string;
  }>>;
  odRequests: ODRequest[];
  isLoadingOD: boolean;
  fetchODs: () => Promise<void>;
  applyOD: (odData: Partial<ODRequest>) => Promise<ODRequest>;
  mentorReviewOD: (id: string, action: 'FORWARD' | 'APPROVE' | 'REJECT', comments: string) => Promise<void>;
  hodReviewOD: (id: string, action: 'APPROVE' | 'REJECT', comments: string) => Promise<void>;
  announcements: Announcement[];
  addAnnouncement: (annData: Partial<Announcement>) => Promise<Announcement>;
  erpData: any;
  aiDrawerOpen: boolean;
  setAiDrawerOpen: (open: boolean) => void;
  triggerNotificationBadge: number;
  navToastMessage: string | null;
  showNavToast: (msg: string) => void;
  executeAINavigation: (route: ActiveTab, params?: Record<string, any>, customMsg?: string) => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'student-1',
    name: 'Harish Kumar S',
    email: 'harish.k@eec.srmrmp.edu.in',
    role: 'STUDENT',
    department: 'Computer Science and Engineering',
    registerNumber: '310622104082',
    semester: 5,
    section: 'B',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [navToastMessage, setNavToastMessage] = useState<string | null>(null);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState<boolean>(false);
  const [notesFilter, setNotesFilter] = useState({
    department: 'Computer Science and Engineering',
    semester: '5',
    subjectCode: 'ALL',
    unit: 'ALL',
    category: 'ALL',
    search: '',
  });

  const [odRequests, setOdRequests] = useState<ODRequest[]>([]);
  const [isLoadingOD, setIsLoadingOD] = useState<boolean>(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [erpData, setErpData] = useState<any>(null);
  const [aiDrawerOpen, setAiDrawerOpen] = useState<boolean>(false);
  const [triggerNotificationBadge] = useState<number>(3);

  const showNavToast = (msg: string) => {
    setNavToastMessage(msg);
    setTimeout(() => {
      setNavToastMessage(null);
    }, 4000);
  };

  const executeAINavigation = (route: ActiveTab, params?: Record<string, any>, customMsg?: string) => {
    if (params) {
      if (params.subjectCode) {
        setNotesFilter(prev => ({ ...prev, subjectCode: params.subjectCode }));
      }
      if (params.unit) {
        setNotesFilter(prev => ({ ...prev, unit: params.unit }));
      }
      if (params.category) {
        setNotesFilter(prev => ({ ...prev, category: params.category }));
      }
      if (params.search) {
        setNotesFilter(prev => ({ ...prev, search: params.search }));
      }
    }

    setActiveTab(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const routeNames: Record<ActiveTab, string> = {
      'dashboard': 'Home Dashboard',
      'notes': 'Faculty Notes Module',
      'od-apply': 'Apply for On-Duty (OD)',
      'od-track': 'OD Status Tracker',
      'announcements': 'Class Announcements',
      'timetable': 'Weekly Timetable',
      'attendance': 'ERP Attendance Register',
      'marks': 'Assessment Marks & Scores',
      'lab': 'Lab Practical Details',
      'fees': 'Fee Portal & Receipts',
      'profile': 'Student Profile',
      'architecture': 'Spring Boot Architecture',
    };

    showNavToast(customMsg || `Navigated to: ${routeNames[route] || route}`);
  };

  // Sync Dark Mode class with root document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Load initial data
  useEffect(() => {
    fetchUsers();
    fetchNotes();
    fetchODs();
    fetchAnnouncements();
    fetchERPData();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/auth/users');
      if (res.ok) {
        const data = await res.json();
        setAvailableUsers(data);
      }
    } catch (e) {
      console.warn('Could not fetch users list, fallback active');
    }
  };

  const setCurrentUserById = (id: string) => {
    const found = availableUsers.find(u => u.id === id);
    if (found) {
      setCurrentUser(found);
      setActiveTab('dashboard'); // reset to dashboard on persona switch
    }
  };

  const fetchNotes = async (customFilters?: Record<string, string>) => {
    setIsLoadingNotes(true);
    try {
      const params = new URLSearchParams(customFilters || notesFilter);
      const res = await fetch(`/api/notes?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    } finally {
      setIsLoadingNotes(false);
    }
  };

  const addNote = async (noteData: Partial<NoteItem>): Promise<NoteItem> => {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });
    const created = await res.json();
    setNotes(prev => [created, ...prev]);
    return created;
  };

  const deleteNote = async (id: string) => {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const fetchODs = async () => {
    setIsLoadingOD(true);
    try {
      const res = await fetch(`/api/od?role=${currentUser.role}&studentId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setOdRequests(data);
      }
    } catch (err) {
      console.error('Failed to fetch OD requests:', err);
    } finally {
      setIsLoadingOD(false);
    }
  };

  const applyOD = async (odData: Partial<ODRequest>): Promise<ODRequest> => {
    const payload = {
      ...odData,
      studentId: currentUser.id,
      studentName: currentUser.name,
      registerNumber: currentUser.registerNumber,
      department: currentUser.department,
      semester: currentUser.semester,
      section: currentUser.section,
    };
    const res = await fetch('/api/od/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const created = await res.json();
    setOdRequests(prev => [created, ...prev]);
    return created;
  };

  const mentorReviewOD = async (id: string, action: 'FORWARD' | 'APPROVE' | 'REJECT', comments: string) => {
    const res = await fetch(`/api/od/${id}/mentor`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, comments, mentorName: currentUser.name }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOdRequests(prev => prev.map(o => (o.id === id ? updated : o)));
    }
  };

  const hodReviewOD = async (id: string, action: 'APPROVE' | 'REJECT', comments: string) => {
    const res = await fetch(`/api/od/${id}/hod`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, comments, hodName: currentUser.name }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOdRequests(prev => prev.map(o => (o.id === id ? updated : o)));
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    }
  };

  const addAnnouncement = async (annData: Partial<Announcement>): Promise<Announcement> => {
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...annData,
        authorName: currentUser.name,
        authorRole: currentUser.designation || 'Faculty',
        department: currentUser.department,
      }),
    });
    const created = await res.json();
    setAnnouncements(prev => [created, ...prev]);
    return created;
  };

  const fetchERPData = async () => {
    try {
      const res = await fetch('/api/erp/data');
      if (res.ok) {
        const data = await res.json();
        setErpData(data);
      }
    } catch (err) {
      console.error('Failed to fetch ERP data:', err);
    }
  };

  // Re-fetch ODs when user switches
  useEffect(() => {
    fetchODs();
  }, [currentUser.id, currentUser.role]);

  return (
    <PortalContext.Provider
      value={{
        currentUser,
        setCurrentUserById,
        availableUsers,
        darkMode,
        toggleDarkMode,
        activeTab,
        setActiveTab,
        notes,
        isLoadingNotes,
        fetchNotes,
        addNote,
        deleteNote,
        notesFilter,
        setNotesFilter,
        odRequests,
        isLoadingOD,
        fetchODs,
        applyOD,
        mentorReviewOD,
        hodReviewOD,
        announcements,
        addAnnouncement,
        erpData,
        aiDrawerOpen,
        setAiDrawerOpen,
        triggerNotificationBadge,
        navToastMessage,
        showNavToast,
        executeAINavigation,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
