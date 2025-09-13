// App Constants
export const APP_NAME = 'StudyMate';
export const APP_VERSION = '1.0.0';

// Design System
export * from './design';

// Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  AUTH_TOKEN: 'auth_token',
  CALENDAR_EVENTS: 'calendar_events',
  TASKS: 'tasks',
  MISSIONS: 'missions',
  CHAT_HISTORY: 'chat_history',
  MOTIVATION_NOTIFICATION_ID: 'motivation_notification_id',
} as const;

// Theme Constants
export const COLORS = {
  // Dark theme (default)
  DARK: {
    background: '#0B0F14',
    card: '#12161C',
    border: '#1C232C',
    text: '#EAF0F6',
    muted: '#A7B1BC',
    primary: '#2F81FF',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  // Light theme
  LIGHT: {
    background: '#FFFFFF',
    card: '#F8FAFC',
    border: '#E2E8F0',
    text: '#1E293B',
    muted: '#64748B',
    primary: '#2F81FF',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 24,
} as const;

// Typography
export const TYPOGRAPHY = {
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
} as const;

// Animation Constants
export const ANIMATION = {
  DURATION: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  EASING: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// Screen Dimensions
export const SCREEN = {
  FAB_SIZE: 56,
  TAB_HEIGHT: 80,
  HEADER_HEIGHT: 60,
  BOTTOM_SHEET_SNAP_POINTS: ['25%', '50%', '90%'],
} as const;

// Universities and Colleges (Mock Data)
export const UNIVERSITIES = [
  {
    id: 'squ',
    name: 'جامعة السلطان قابوس',
    nameEn: 'Sultan Qaboos University',
    colleges: [
      { id: 'engineering', name: 'كلية الهندسة', nameEn: 'College of Engineering' },
      { id: 'medicine', name: 'كلية الطب', nameEn: 'College of Medicine' },
      { id: 'science', name: 'كلية العلوم', nameEn: 'College of Science' },
      { id: 'arts', name: 'كلية الآداب', nameEn: 'College of Arts' },
      { id: 'commerce', name: 'كلية التجارة', nameEn: 'College of Commerce' },
    ],
  },
  {
    id: 'nu',
    name: 'جامعة نزوى',
    nameEn: 'University of Nizwa',
    colleges: [
      { id: 'pharmacy', name: 'كلية الصيدلة', nameEn: 'College of Pharmacy' },
      { id: 'engineering', name: 'كلية الهندسة', nameEn: 'College of Engineering' },
      { id: 'arts', name: 'كلية الآداب والعلوم', nameEn: 'College of Arts and Sciences' },
    ],
  },
  {
    id: 'dhofar',
    name: 'جامعة ظفار',
    nameEn: 'Dhofar University',
    colleges: [
      { id: 'business', name: 'كلية إدارة الأعمال', nameEn: 'College of Business Administration' },
      { id: 'engineering', name: 'كلية الهندسة', nameEn: 'College of Engineering' },
      { id: 'arts', name: 'كلية الآداب والعلوم التطبيقية', nameEn: 'College of Arts and Applied Sciences' },
    ],
  },
] as const;

// Event Types
export const EVENT_TYPES = [
  { id: 'lecture', name: 'محاضرة', nameEn: 'Lecture', color: '#2F81FF' },
  { id: 'exam', name: 'امتحان', nameEn: 'Exam', color: '#EF4444' },
  { id: 'assignment', name: 'واجب', nameEn: 'Assignment', color: '#F59E0B' },
  { id: 'personal', name: 'شخصي', nameEn: 'Personal', color: '#22C55E' },
] as const;

// Task Types
export const TASK_TYPES = [
  { id: 'study', name: 'دراسة', nameEn: 'Study', color: '#2F81FF' },
  { id: 'assignment', name: 'واجب', nameEn: 'Assignment', color: '#F59E0B' },
  { id: 'personal', name: 'شخصي', nameEn: 'Personal', color: '#22C55E' },
] as const;

// Mission Types
export const MISSION_TYPES = [
  { id: 'delivery', name: 'توصيل', nameEn: 'Delivery', icon: 'package' },
  { id: 'pickup', name: 'استلام', nameEn: 'Pickup', icon: 'archive' },
  { id: 'errand', name: 'مهمة', nameEn: 'Errand', icon: 'briefcase' },
] as const;

// Priority Levels
export const PRIORITY_LEVELS = [
  { id: 'low', name: 'منخفض', nameEn: 'Low', color: '#22C55E' },
  { id: 'medium', name: 'متوسط', nameEn: 'Medium', color: '#F59E0B' },
  { id: 'high', name: 'عالي', nameEn: 'High', color: '#EF4444' },
] as const;

// Reminder Options (in minutes)
export const REMINDER_OPTIONS = [
  { value: 0, label: 'بدون تذكير', labelEn: 'No reminder' },
  { value: 5, label: '5 دقائق', labelEn: '5 minutes' },
  { value: 15, label: '15 دقيقة', labelEn: '15 minutes' },
  { value: 30, label: '30 دقيقة', labelEn: '30 minutes' },
  { value: 60, label: 'ساعة واحدة', labelEn: '1 hour' },
  { value: 1440, label: 'يوم واحد', labelEn: '1 day' },
] as const;

// Assistant Suggestions
export const ASSISTANT_SUGGESTIONS = [
  {
    id: 'study_plan',
    title: 'خطة مذاكرة لساعتين',
    titleEn: '2-hour study plan',
    description: 'اقترح خطة مذاكرة مفصلة',
    descriptionEn: 'Suggest a detailed study plan',
  },
  {
    id: 'lecture_summary',
    title: 'ملخص المحاضرة الأخيرة',
    titleEn: 'Last lecture summary',
    description: 'لخص النقاط المهمة',
    descriptionEn: 'Summarize key points',
  },
  {
    id: 'exam_prep',
    title: 'التحضير للامتحان',
    titleEn: 'Exam preparation',
    description: 'خطة مراجعة شاملة',
    descriptionEn: 'Comprehensive review plan',
  },
  {
    id: 'time_management',
    title: 'إدارة الوقت',
    titleEn: 'Time management',
    description: 'نصائح لتنظيم الوقت',
    descriptionEn: 'Tips for time organization',
  },
] as const;

// Quick Add Options
export const QUICK_ADD_OPTIONS = [
  {
    id: 'task',
    title: 'مهمة جديدة',
    titleEn: 'New Task',
    icon: 'checkmark-circle-outline',
    color: '#2F81FF',
  },
  {
    id: 'event',
    title: 'حدث جديد',
    titleEn: 'New Event',
    icon: 'calendar-outline',
    color: '#22C55E',
  },
  {
    id: 'note',
    title: 'ملاحظة سريعة',
    titleEn: 'Quick Note',
    icon: 'document-text-outline',
    color: '#F59E0B',
  },
  {
    id: 'mission',
    title: 'مهمة حرم',
    titleEn: 'Campus Mission',
    icon: 'location-outline',
    color: '#EF4444',
  },
] as const;
