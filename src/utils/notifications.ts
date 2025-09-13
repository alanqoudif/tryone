import { Platform } from 'react-native';
import storage from './storage';
import { STORAGE_KEYS } from '../constants';
// Use dynamic require so web or missing native bits don't break bundling
let Notifications: typeof import('expo-notifications') | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Notifications = require('expo-notifications');
} catch (e) {
  Notifications = null;
}

export async function initNotifications() {
  if (!Notifications || Platform.OS === 'web') return;
  // Show alerts and play sound when notifications are received foreground
  Notifications.setNotificationHandler?.({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  const { status } = await Notifications.requestPermissionsAsync?.();
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync?.('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance?.DEFAULT ?? 3,
    });
  }
  return status;
}

export function minutesFromReminder(optionId: string): number {
  switch (optionId) {
    case '1': // 5min
    case '5min':
      return 5;
    case '4': // 30min
    case '30min':
      return 30;
    case '3': // 1hour
    case '1hour':
      return 60;
    case '2': // 1day
    case '1day':
      return 24 * 60;
    case '5': // 10min
    case '10min':
      return 10;
    default:
      return 0;
  }
}

export async function scheduleReminderAt(date: Date, title: string, body?: string) {
  if (!Notifications || Platform.OS === 'web') return null;
  const trigger = date.getTime();
  if (trigger <= Date.now()) return null; // don't schedule past
  return Notifications.scheduleNotificationAsync?.({
    content: {
      title,
      body: body || '',
      sound: undefined,
    },
    trigger: new Date(trigger),
  });
}

export async function cancelReminder(id: string) {
  if (!Notifications || Platform.OS === 'web') return;
  await Notifications.cancelScheduledNotificationAsync?.(id);
}

// Schedule a repeating motivational notification every 5 minutes with user's name
export async function ensureMotivationNotification(name?: string) {
  if (!Notifications || Platform.OS === 'web') return;
  try {
    const existing = storage.getString(STORAGE_KEYS.MOTIVATION_NOTIFICATION_ID);
    if (existing) return; // already scheduled
  } catch {}

  const title = name ? `شد حيلك يا ${name}!` : 'شد حيلك!';
  const body = 'خمس دقايق تركيز تفرق كثير ✨';

  // Schedule repeating every 5 minutes
  const id = await Notifications.scheduleNotificationAsync?.({
    content: { title, body },
    // iOS requires >= 60 seconds; 300s = 5 minutes
    trigger: { seconds: 300, repeats: true } as any,
  });
  if (id) {
    try { storage.set(STORAGE_KEYS.MOTIVATION_NOTIFICATION_ID, String(id)); } catch {}
  }
}

export async function disableMotivationNotification() {
  if (!Notifications || Platform.OS === 'web') return;
  try {
    const existing = storage.getString(STORAGE_KEYS.MOTIVATION_NOTIFICATION_ID);
    if (existing) {
      await Notifications.cancelScheduledNotificationAsync?.(existing);
    }
  } catch {}
  try { storage.set(STORAGE_KEYS.MOTIVATION_NOTIFICATION_ID, ''); } catch {}
}
