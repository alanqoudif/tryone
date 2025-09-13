import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import relativeTime from 'dayjs/plugin/relativeTime';
import isTodayPlugin from 'dayjs/plugin/isToday';
import isTomorrowPlugin from 'dayjs/plugin/isTomorrow';
import weekday from 'dayjs/plugin/weekday';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { CalendarEvent, Mission } from '../types';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.extend(isTodayPlugin);
dayjs.extend(isTomorrowPlugin);
dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(timezone);

// Date utilities
export const formatDate = (date: Date | string, format: string = 'YYYY-MM-DD') => {
  return dayjs(date).format(format);
};

export const formatTime = (date: Date | string, format: string = 'HH:mm') => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: Date | string, format: string = 'YYYY-MM-DD HH:mm') => {
  return dayjs(date).format(format);
};

export const getRelativeTime = (date: Date | string, locale: string = 'ar') => {
  return dayjs(date).locale(locale).fromNow();
};

export const checkIsToday = (date: Date | string) => {
  return dayjs(date).isToday();
};

export const checkIsTomorrow = (date: Date | string) => {
  return dayjs(date).isTomorrow();
};

export const isThisWeek = (date: Date | string) => {
  const now = dayjs();
  const target = dayjs(date);
  return target.isSame(now, 'week');
};

export const getWeekStart = (date?: Date | string) => {
  return dayjs(date).startOf('week');
};

export const getWeekEnd = (date?: Date | string) => {
  return dayjs(date).endOf('week');
};

export const addDays = (date: Date | string, days: number) => {
  return dayjs(date).add(days, 'day').toDate();
};

export const subtractDays = (date: Date | string, days: number) => {
  return dayjs(date).subtract(days, 'day').toDate();
};

export const getDayName = (date: Date | string, locale: string = 'ar') => {
  return dayjs(date).locale(locale).format('dddd');
};

export const getMonthName = (date: Date | string, locale: string = 'ar') => {
  return dayjs(date).locale(locale).format('MMMM');
};

// String utilities
export const truncateText = (text: string, maxLength: number = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Validation utilities
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string) => {
  // Omani phone number validation
  const phoneRegex = /^(\+968|968)?[79]\d{7}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const isValidOTP = (otp: string) => {
  return /^\d{4,6}$/.test(otp);
};

// Array utilities
export const groupBy = <T>(array: T[], key: keyof T) => {
  return array.reduce((groups, item) => {
    const group = item[key] as string;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const uniqueBy = <T>(array: T[], key: keyof T) => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

// Number utilities
export const formatCurrency = (amount: number, currency: string = 'OMR') => {
  return new Intl.NumberFormat('ar-OM', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatNumber = (number: number, locale: string = 'ar-OM') => {
  return new Intl.NumberFormat(locale).format(number);
};

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

// Color utilities
export const hexToRgba = (hex: string, alpha: number = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getContrastColor = (hexColor: string) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
};

// Device utilities
export const isRTL = (locale: string) => {
  return ['ar', 'he', 'fa', 'ur'].includes(locale);
};

export const getDeviceLocale = () => {
  // This would be implemented with expo-localization in a real app
  return 'ar';
};

// Storage utilities
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Error handling
export const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'حدث خطأ غير متوقع';
};

// Mock data helpers
export const generateMockId = () => generateId();

export const generateMockDate = (daysFromNow: number = 0) => {
  return dayjs().add(daysFromNow, 'day').toDate();
};

export const generateRandomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const pickRandom = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const generateMockCalendarEvents = () => {
  const events = [];
  const today = new Date();
  
  // Generate events for the next 30 days
  for (let i = 0; i < 30; i++) {
    const eventDate = new Date(today);
    eventDate.setDate(today.getDate() + i);
    
    // Random number of events per day (0-3)
    const eventsPerDay = Math.floor(Math.random() * 4);
    
    for (let j = 0; j < eventsPerDay; j++) {
      const startHour = 8 + Math.floor(Math.random() * 10); // 8 AM to 6 PM
      const startMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
      const duration = [60, 90, 120, 180][Math.floor(Math.random() * 4)]; // 1-3 hours
      
      const startTime = new Date(eventDate);
      startTime.setHours(startHour, startMinute, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(startTime.getMinutes() + duration);
      
      const eventTypes = ['lecture', 'exam', 'assignment', 'meeting', 'study'];
      const subjects = ['رياضيات', 'فيزياء', 'برمجة', 'قواعد البيانات', 'شبكات'];
      const locations = ['قاعة 101', 'مختبر الحاسوب', 'المكتبة', 'قاعة المؤتمرات', 'عن بُعد'];
      
      events.push({
        id: `event_${i}_${j}_${Date.now()}`,
        title: `${subjects[Math.floor(Math.random() * subjects.length)]} - ${eventTypes[Math.floor(Math.random() * eventTypes.length)]}`,
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        location: locations[Math.floor(Math.random() * locations.length)],
        description: 'وصف تلقائي للحدث',
        reminder: Math.random() > 0.5 ? 15 : 30,
        isAllDay: false,
        color: ['#2F81FF', '#22C55E', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 4)],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }
  
  return events;
};

export const generateMockMissions = (): Mission[] => {
  const missions: Mission[] = [];
  const missionTypes: Mission['type'][] = ['delivery', 'pickup', 'errand'];
  const statuses: Mission['status'][] = ['available', 'accepted', 'in_progress', 'completed'];
  const locations = [
    { address: 'جامعة الملك سعود، الرياض', latitude: 24.7136, longitude: 46.6753 },
    { address: 'جامعة الملك عبدالعزيز، جدة', latitude: 21.4858, longitude: 39.1925 },
    { address: 'جامعة الملك فهد، الظهران', latitude: 26.3069, longitude: 50.1444 },
    { address: 'جامعة الإمام، الرياض', latitude: 24.8138, longitude: 46.6398 },
    { address: 'جامعة أم القرى، مكة', latitude: 21.4225, longitude: 39.8262 }
  ];
  
  const titles = [
    'توصيل كتب دراسية',
    'استلام مشروع تخرج',
    'توصيل وجبة طعام',
    'استلام أوراق رسمية',
    'توصيل أدوات مختبر',
    'استلام شهادات',
    'توصيل مستلزمات دراسية'
  ];

  for (let i = 0; i < 25; i++) {
    const location = locations[Math.floor(Math.random() * locations.length)];
    const destination = Math.random() > 0.3 ? locations[Math.floor(Math.random() * locations.length)] : undefined;
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 7));

    missions.push({
      id: generateMockId(),
      title: titles[Math.floor(Math.random() * titles.length)],
      description: 'مهمة توصيل أو استلام للطلاب الجامعيين',
      type: missionTypes[Math.floor(Math.random() * missionTypes.length)],
      location,
      destination,
      reward: 15 + Math.floor(Math.random() * 35), // 15-50 SAR
      estimatedDuration: 30 + Math.floor(Math.random() * 90), // 30-120 minutes
      status: statuses[Math.floor(Math.random() * statuses.length)],
      requesterId: `user_${Math.floor(Math.random() * 10) + 1}`,
      courierId: Math.random() > 0.5 ? `courier_${Math.floor(Math.random() * 5) + 1}` : undefined,
      createdAt: createdDate,
      updatedAt: createdDate,
      completedAt: Math.random() > 0.7 ? new Date() : undefined
    });
  }

  return missions;
};