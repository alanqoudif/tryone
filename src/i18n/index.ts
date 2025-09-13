import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';
import storage from '../utils/storage';
import { STORAGE_KEYS } from '../constants';

// Import translations
import ar from './ar.json';
import en from './en.json';


// Get saved language or default to Arabic
const getInitialLanguage = (): string => {
  const savedLanguage = storage.getString(STORAGE_KEYS.LANGUAGE);
  return savedLanguage || 'ar';
};

// Configure RTL based on language with automatic app restart
const configureRTL = async (language: string) => {
  const isRTL = language === 'ar';
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    // Restart app for RTL changes to take effect
    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.warn('Could not reload app for RTL change:', error);
    }
  }
};

const resources = {
  ar: {
    translation: ar,
  },
  en: {
    translation: en,
  },
};

// Initialize i18n with proper loading state
const initI18n = async () => {
  return i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: getInitialLanguage(),
      fallbackLng: 'ar',
      debug: __DEV__,
      returnEmptyString: false,
      
      interpolation: {
        escapeValue: false, // React already does escaping
      },
      
      react: {
        useSuspense: false,
      },
    });
};

// Initialize i18n
initI18n();

// Configure RTL for initial language
configureRTL(i18n.language);

// Listen for language changes
i18n.on('languageChanged', async (lng) => {
  storage.set(STORAGE_KEYS.LANGUAGE, lng);
  await configureRTL(lng);
});

export default i18n;

// Helper functions
export const changeLanguage = async (language: string) => {
  await i18n.changeLanguage(language);
};

export const getCurrentLanguage = () => i18n.language;

export const isRTL = () => i18n.language === 'ar';

// Check if i18n is ready
export const isI18nReady = () => i18n.isInitialized;

// Wait for i18n to be ready
export const waitForI18n = () => {
  return new Promise<void>((resolve) => {
    if (i18n.isInitialized) {
      resolve();
    } else {
      i18n.on('initialized', () => resolve());
    }
  });
};

// Translation hook
export { useTranslation } from 'react-i18next';
