// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'student' | 'courier';
  university?: string;
  college?: string;
  isVerified: boolean;
  isCourierActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  type: 'lecture' | 'exam' | 'assignment' | 'personal';
  subject?: string;
  location?: string;
  reminder?: number; // minutes before
  isCompleted?: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  type: 'study' | 'assignment' | 'personal';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  isCompleted: boolean;
  subject?: string;
  estimatedDuration?: number; // minutes
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mission Types
export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'delivery' | 'pickup' | 'errand';
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  destination?: {
    address: string;
    latitude: number;
    longitude: number;
  };
  reward: number;
  estimatedDuration: number; // minutes
  status: 'available' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  requesterId: string;
  courierId?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Chat Types
export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  isConverted?: boolean; // converted to task
}

// Assistant Types
export interface AssistantSuggestion {
  id: string;
  title: string;
  description: string;
  type: 'study_plan' | 'summary' | 'reminder' | 'tip';
  action?: () => void;
}

// Navigation Types
export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
};

export type TabParamList = {
  Today: undefined;
  Calendar: undefined;
  Assistant: undefined;
  Missions: undefined;
  Profile: undefined;
};

// Theme Types
export interface Theme {
  colors: {
    background: string;
    card: string;
    border: string;
    text: string;
    muted: string;
    primary: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginForm {
  phone: string;
  otp: string;
}

export interface OnboardingForm {
  name: string;
  email: string;
  role: 'student' | 'courier';
  university?: string;
  college?: string;
}

export interface EventForm {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  type: 'lecture' | 'exam' | 'assignment' | 'personal';
  subject?: string;
  location?: string;
  reminder?: number;
}

export interface TaskForm {
  title: string;
  description?: string;
  type: 'study' | 'assignment' | 'personal';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  subject?: string;
  estimatedDuration?: number;
}

export interface MissionForm {
  title: string;
  description: string;
  type: 'delivery' | 'pickup' | 'errand';
  location: string;
  destination?: string;
  reward: number;
  estimatedDuration: number;
}