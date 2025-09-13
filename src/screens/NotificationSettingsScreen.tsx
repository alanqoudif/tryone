import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as Notifications from 'expo-notifications';
import { MMKV } from 'react-native-mmkv';

interface NotificationSettingsScreenProps {
  navigation: any;
}

interface NotificationSettings {
  pushNotifications: boolean;
  missionUpdates: boolean;
  earningsUpdates: boolean;
  marketingMessages: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  whatsappNotifications: boolean;
}

const NotificationSettingsScreen: React.FC<NotificationSettingsScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const storage = new MMKV();
  
  const [settings, setSettings] = useState<NotificationSettings>({
    pushNotifications: true,
    missionUpdates: true,
    earningsUpdates: true,
    marketingMessages: false,
    soundEnabled: true,
    vibrationEnabled: true,
    whatsappNotifications: false,
  });

  const [permissionStatus, setPermissionStatus] = useState<string>('undetermined');

  useEffect(() => {
    loadSettings();
    checkNotificationPermissions();
  }, []);

  const loadSettings = () => {
    try {
      const savedSettings = storage.getString('notificationSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.log('Error loading notification settings:', error);
    }
  };

  const saveSettings = (newSettings: NotificationSettings) => {
    try {
      storage.set('notificationSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      Alert.alert(t('common.error'), t('notificationSettings.saveError'));
    }
  };

  const checkNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status);
    } catch (error) {
      console.log('Error checking permissions:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      setPermissionStatus(status);
      
      if (status === 'granted') {
        Alert.alert(t('common.success'), t('notificationSettings.permissionGranted'));
      } else {
        Alert.alert(t('common.error'), t('notificationSettings.permissionDenied'));
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('notificationSettings.permissionError'));
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    
    // If disabling push notifications, disable all related settings
    if (key === 'pushNotifications' && !value) {
      newSettings.missionUpdates = false;
      newSettings.earningsUpdates = false;
      newSettings.marketingMessages = false;
    }
    
    saveSettings(newSettings);
  };

  const renderSettingItem = (
    key: keyof NotificationSettings,
    titleKey: string,
    descriptionKey: string,
    icon: string,
    disabled: boolean = false
  ) => {
    return (
      <View style={[styles.settingItem, disabled && styles.disabledItem]}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon as any} size={24} color={disabled ? '#ccc' : '#007AFF'} />
        </View>
        
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, disabled && styles.disabledText]}>
            {t(titleKey)}
          </Text>
          <Text style={[styles.settingDescription, disabled && styles.disabledText]}>
            {t(descriptionKey)}
          </Text>
        </View>
        
        <Switch
          value={settings[key]}
          onValueChange={(value) => updateSetting(key, value)}
          disabled={disabled}
          trackColor={{ false: '#767577', true: '#007AFF' }}
          thumbColor={settings[key] ? '#ffffff' : '#f4f3f4'}
        />
      </View>
    );
  };

  const renderPermissionSection = () => {
    if (permissionStatus === 'granted') {
      return (
        <View style={styles.permissionCard}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.permissionText}>
            {t('notificationSettings.permissionGranted')}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.permissionCard}>
        <Ionicons name="notifications-off" size={24} color="#FF9800" />
        <View style={styles.permissionContent}>
          <Text style={styles.permissionTitle}>
            {t('notificationSettings.permissionRequired')}
          </Text>
          <Text style={styles.permissionDescription}>
            {t('notificationSettings.permissionDescription')}
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
            <Text style={styles.permissionButtonText}>
              {t('notificationSettings.enableNotifications')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('notificationSettings.title')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderPermissionSection()}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('notificationSettings.generalSettings')}</Text>
          
          {renderSettingItem(
            'pushNotifications',
            'notificationSettings.pushNotifications',
            'notificationSettings.pushNotificationsDesc',
            'notifications',
            permissionStatus !== 'granted'
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('notificationSettings.contentSettings')}</Text>
          
          {renderSettingItem(
            'missionUpdates',
            'notificationSettings.missionUpdates',
            'notificationSettings.missionUpdatesDesc',
            'briefcase',
            !settings.pushNotifications || permissionStatus !== 'granted'
          )}
          
          {renderSettingItem(
            'earningsUpdates',
            'notificationSettings.earningsUpdates',
            'notificationSettings.earningsUpdatesDesc',
            'wallet',
            !settings.pushNotifications || permissionStatus !== 'granted'
          )}
          
          {renderSettingItem(
            'marketingMessages',
            'notificationSettings.marketingMessages',
            'notificationSettings.marketingMessagesDesc',
            'megaphone',
            !settings.pushNotifications || permissionStatus !== 'granted'
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('notificationSettings.behaviorSettings')}</Text>
          
          {renderSettingItem(
            'soundEnabled',
            'notificationSettings.soundEnabled',
            'notificationSettings.soundEnabledDesc',
            'volume-high',
            !settings.pushNotifications || permissionStatus !== 'granted'
          )}
          
          {renderSettingItem(
            'vibrationEnabled',
            'notificationSettings.vibrationEnabled',
            'notificationSettings.vibrationEnabledDesc',
            'phone-portrait',
            !settings.pushNotifications || permissionStatus !== 'granted'
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('notificationSettings.externalSettings')}</Text>
          
          {renderSettingItem(
            'whatsappNotifications',
            'notificationSettings.whatsappNotifications',
            'notificationSettings.whatsappNotificationsDesc',
            'logo-whatsapp'
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginEnd: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  permissionContent: {
    flex: 1,
    marginStart: 12,
  },
  permissionText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
    marginStart: 12,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  disabledItem: {
    opacity: 0.5,
  },
  settingIcon: {
    marginEnd: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  disabledText: {
    color: '#ccc',
  },
});

export default NotificationSettingsScreen;