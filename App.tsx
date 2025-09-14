import 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useIsDark } from './src/hooks/useTheme';
import { TabNavigator } from './src/navigation';
import './src/i18n'; // Initialize i18n
// NativeWind v2 does not require importing a CSS file.
import { WelcomeScreen, LoginScreen } from './src/screens';
import storage from './src/utils/storage';
import { STORAGE_KEYS } from './src/constants';
import { initNotifications, ensureMotivationNotification } from './src/utils/notifications';
import { AppBackground } from './src/components/ui';

export default function App() {
  const isDark = useIsDark();
  const [activeTab, setActiveTab] = useState('Home');
  const [showWelcome, setShowWelcome] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    try {
      const authToken = storage.getString(STORAGE_KEYS.AUTH_TOKEN);
      if (authToken) {
        setShowLogin(false);
        setShowWelcome(false);
      } else {
        const raw = storage.getString(STORAGE_KEYS.USER);
        if (raw) {
          setShowLogin(false);
          setShowWelcome(true);
        } else {
          setShowLogin(true);
          setShowWelcome(false);
        }
      }
    } catch {
      setShowLogin(true);
      setShowWelcome(false);
    }
    // ask for notification permissions (no-op on web)
    (async () => {
      await initNotifications();
      // Read saved user name to personalize motivation notifications
      try {
        const raw = storage.getString(STORAGE_KEYS.USER);
        const name = raw ? (JSON.parse(raw)?.name as string | undefined) : undefined;
        await ensureMotivationNotification(name);
      } catch {
        await ensureMotivationNotification();
      }
    })();
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <SafeAreaProvider>
      <AppBackground>
        {showLogin ? (
          <LoginScreen 
            onDone={() => {
              setShowLogin(false);
              setShowWelcome(false);
            }} 
            onNavigateToWelcome={() => {
              setShowLogin(false);
              setShowWelcome(true);
            }}
          />
        ) : showWelcome ? (
          <WelcomeScreen onDone={() => setShowWelcome(false)} />
        ) : (
          <TabNavigator activeTab={activeTab} onTabChange={handleTabChange} />
        )}
        <StatusBar style="light" />
      </AppBackground>
    </SafeAreaProvider>
  );
}
