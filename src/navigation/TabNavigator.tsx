import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';
import { GlassCard, PrimaryButton, GhostButton } from '../components/ui';
import { theme } from '../constants/design';
import {
  TodayScreen,
  CalendarScreen,
  AssistantScreen,
  MissionsScreen,
  ProfileScreen,
} from '../screens';
import HomeScreen from '../screens/home/HomeScreen';
import AddNoteScreen from '../screens/notes/AddNoteScreen';
import AddTaskScreen from '../screens/tasks/AddTaskScreen';
import PomodoroScreen from '../screens/pomodoro/PomodoroScreen';
import TasksScreen from '../screens/tasks/TasksScreen';
import WalletScreen from '../screens/WalletScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import EarningsScreen from '../screens/EarningsScreen';
import LanguageSettingsScreen from '../screens/LanguageSettingsScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import ContactSupportScreen from '../screens/ContactSupportScreen';

interface TabNavigatorProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const TabNavigator: React.FC<TabNavigatorProps> = ({ 
  activeTab = 'Home', 
  onTabChange 
}) => {
  const { t } = useTranslation();
  const [showActions, setShowActions] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [overlay, setOverlay] = useState<null | { name: string; Component: React.ComponentType<any> }>(null);
  const insets = useSafeAreaInsets();

  const tabs = [
    { key: 'Home', icon: 'home-outline', activeIcon: 'home', label: 'الرئيسية', component: HomeScreen },
    { key: 'Tasks', icon: 'checkmark-done-outline', activeIcon: 'checkmark-done', label: 'المهام', component: TasksScreen },
    { key: 'Profile', icon: 'person-outline', activeIcon: 'person', label: 'الملف الشخصي', component: ProfileScreen },
    { key: 'Assistant', icon: 'chatbubble-outline', activeIcon: 'chatbubble', label: 'المساعد', component: AssistantScreen },
  ] as const;

  const overlayRoutes: Record<string, React.ComponentType<any>> = {
    Wallet: WalletScreen,
    Subscription: SubscriptionScreen,
    Earnings: EarningsScreen,
    SubscriptionPlans: SubscriptionScreen,
    LanguageSettings: LanguageSettingsScreen,
    NotificationSettings: NotificationSettingsScreen,
    HelpCenter: HelpCenterScreen,
    ContactSupport: ContactSupportScreen,
    Pomodoro: PomodoroScreen,
  };

  const handleTabPress = (tabKey: string) => {
    if (tabKey === 'AddTask') {
      setShowAddTask(true);
      return;
    }
    // If navigation asks for an overlay route (profile subpage), open it fullscreen
    if (overlayRoutes[tabKey]) {
      const Component = overlayRoutes[tabKey];
      setOverlay({ name: tabKey, Component });
      return;
    }
    onTabChange && onTabChange(tabKey);
  };

  const renderTabBar = () => {
    return (
      <View style={[styles.tabWrapper, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {/* الشريط السفلي الزجاجي مع الفتحة الوسطى */}
        <View style={styles.tabBarContainer}>
          {/* الشريط الأيسر - الرئيسية والمهام */}
          <View style={styles.tabBarLeft}>
            {tabs.slice(0, 2).map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tabItem, isActive && styles.activeTabItem]}
                  onPress={() => handleTabPress(tab.key)}
                >
                  <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                    <Ionicons
                      name={(isActive ? tab.activeIcon : tab.icon) as any}
                      size={26}
                      color={isActive ? theme.colors.textLight : 'rgba(255, 255, 255, 0.6)'}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* الزر العائم المركزي */}
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setShowActions(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* الشريط الأيمن - الملف الشخصي والمساعد */}
          <View style={styles.tabBarRight}>
            {tabs.slice(2).map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tabItem, isActive && styles.activeTabItem]}
                  onPress={() => handleTabPress(tab.key)}
                >
                  <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                    <Ionicons
                      name={(isActive ? tab.activeIcon : tab.icon) as any}
                      size={26}
                      color={isActive ? theme.colors.textLight : 'rgba(255, 255, 255, 0.6)'}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const renderActiveScreen = () => {
    const activeTabData = tabs.find(tab => tab.key === activeTab);
    if (!activeTabData || !activeTabData.component) return null;

    const ActiveComponent = activeTabData.component;
    return <ActiveComponent navigation={{ navigate: handleTabPress }} />;
  };

  if (showAddTask) {
    return (
      <AddTaskScreen 
        navigation={{ 
          goBack: () => setShowAddTask(false),
          navigate: handleTabPress 
        }} 
      />
    );
  }

  if (overlay) {
    const { Component } = overlay;
    return (
      <Component
        navigation={{
          goBack: () => setOverlay(null),
          navigate: handleTabPress,
        }}
      />
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    tabWrapper: {
      paddingHorizontal: theme.spacing(2),
      paddingBottom: theme.spacing(1.25),
      paddingTop: theme.spacing(0.75),
    },
    tabBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 80,
      position: 'relative',
      backgroundColor: theme.colors.primaryDark,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: theme.spacing(2),
      borderWidth: 1,
      borderColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    tabBarLeft: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    tabBarRight: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    tabItem: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing(1.5),
      paddingHorizontal: theme.spacing(2),
      minWidth: 50,
      borderRadius: 20,
      marginHorizontal: 4,
    },
    activeTabItem: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      transform: [{ scale: 1.1 }],
    },
    iconContainer: {
      padding: theme.spacing(1),
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeIconContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4,
    },
    fab: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
      position: 'absolute',
      top: -12,
      start: '50%',
      marginStart: -28,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 3,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    bottomSheetContent: {
      padding: theme.spacing(3),
      margin: theme.spacing(2),
      marginBottom: theme.spacing(4),
    },
    bottomSheetHeader: {
      alignItems: 'center',
      marginBottom: theme.spacing(3.5),
    },
    bottomSheetTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: 'bold',
      color: theme.colors.text,
      letterSpacing: theme.typography.letterSpacing.wide,
    },
    actionsGrid: {
      gap: theme.spacing(2),
    },
    actionItem: {
      marginBottom: theme.spacing(2),
    },
    actionItemInner: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing(2.5),
    },
    actionIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginEnd: theme.spacing(2),
    },
    actionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: '600',
      color: theme.colors.text,
      letterSpacing: theme.typography.letterSpacing.normal,
    },
    cancelButton: {
      marginTop: theme.spacing(2),
      alignSelf: 'stretch',
    },
    fullScreenModal: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderActiveScreen()}
      </View>
      {renderTabBar()}

      {/* Global actions bottom sheet */}
      <Modal
        visible={showActions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActions(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowActions(false)}
        >
          <GlassCard style={styles.bottomSheetContent}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>إضافة سريعة</Text>
            </View>
            
            <View style={styles.actionsGrid}>
              {[
                  { id: 'task', title: 'إضافة مهمة', icon: 'checkbox-outline', color: '#3B82F6' },
                  { id: 'pomodoro', title: 'بدء جلسة تركيز', icon: 'timer-outline', color: '#8B5CF6' },
                  { id: 'note', title: 'ملاحظة سريعة', icon: 'document-text-outline', color: '#10B981' },
                ].map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.actionItem}
                  onPress={() => {
                       setShowActions(false);
                       if (action.id === 'task') setShowAddTask(true);
                       else if (action.id === 'pomodoro') onTabChange && onTabChange('Pomodoro');
                       else if (action.id === 'note') setShowAddNote(true);
                     }}
                >
                  <GlassCard style={styles.actionItemInner}>
                    <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                      <Ionicons name={action.icon as any} size={20} color="#FFFFFF" />
                    </View>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                  </GlassCard>
                </TouchableOpacity>
              ))}
            </View>
            
            <GhostButton
              title="إلغاء"
              onPress={() => setShowActions(false)}
              style={styles.cancelButton}
            />
          </GlassCard>
        </Pressable>
      </Modal>

      {/* Add note as modal */}
      <Modal 
        visible={showAddNote} 
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddNote(false)}
      >
        <View style={styles.fullScreenModal}>
          <AddNoteScreen 
            navigation={{ 
              goBack: () => setShowAddNote(false),
              navigate: handleTabPress 
            }} 
          />
        </View>
      </Modal>
    </View>
  );
};

export default TabNavigator;
