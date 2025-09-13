import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FadeSlide } from '../components/ui';
import { useIsDark, useTheme } from '../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { UserAdapter, WalletAdapter, SubscriptionAdapter } from '../adapters';
import { User } from '../types';
import { theme } from '../constants/design';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const isDark = useIsDark();
  const { toggleTheme } = useTheme();
  const colors = {
    background: isDark ? '#0F2236' : theme.colors.background,
    card: isDark ? 'rgba(18, 30, 46, 0.72)' : theme.colors.card,
    border: isDark ? 'rgba(255,255,255,0.06)' : theme.colors.border,
    text: isDark ? '#E9EDF7' : theme.colors.text,
    primary: theme.colors.primary,
    muted: isDark ? '#7B8798' : theme.colors.textMuted,
    success: theme.colors.success,
    warning: theme.colors.warning,
    error: theme.colors.danger,
  };
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCourierActive, setIsCourierActive] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'expired' | 'cancelled' | 'pending'>('cancelled');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await UserAdapter.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        setIsCourierActive(response.data.isCourierActive);
        
        // Load wallet and subscription data
        await loadWalletData(response.data.id);
        await loadSubscriptionData(response.data.id);
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('profile.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const loadWalletData = async (userId: string) => {
    try {
      const response = await WalletAdapter.getWallet(userId);
      if (response.success && response.data) {
        setWalletBalance(response.data.balance);
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
    }
  };

  const loadSubscriptionData = async (userId: string) => {
    try {
      const response = await SubscriptionAdapter.getUserSubscription(userId);
      if (response.success && response.data) {
        setSubscriptionStatus(response.data.status);
      }
    } catch (error) {
      console.error('Error loading subscription data:', error);
    }
  };

  const handleWalletPress = () => {
    navigation.navigate('Wallet');
  };

  const handleSubscriptionPress = () => {
    navigation.navigate('Subscription');
  };

  const handleToggleCourierStatus = async (value: boolean) => {
    try {
      const response = await UserAdapter.toggleCourierStatus();
      if (response.success) {
        setIsCourierActive(value);
        Alert.alert(
          t('common.success'), 
          value ? t('profile.courierActivated') : t('profile.courierDeactivated')
        );
      } else {
        Alert.alert(t('common.error'), response.error || t('profile.updateError'));
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('profile.updateError'));
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              await UserAdapter.logout();
              // Navigate to auth screen
              console.log('Navigate to auth');
            } catch (error) {
              Alert.alert(t('common.error'), t('profile.logoutError'));
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('profile.deleteAccount'),
      t('profile.deleteAccountConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.delete'),
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              t('profile.deleteAccount'),
              t('profile.deleteAccountFinalConfirm'),
              [
                { text: t('common.cancel'), style: 'cancel' },
                {
                  text: t('profile.delete'),
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await UserAdapter.deleteAccount();
                      // Navigate to auth screen
                      console.log('Navigate to auth after deletion');
                    } catch (error) {
                      Alert.alert(t('common.error'), t('profile.deleteError'));
                    }
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const renderProfileHeader = () => {
    if (!user) return null;

    return (
      <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={[
            styles.verificationBadge,
            { backgroundColor: user.isVerified ? colors.success : colors.warning }
          ]}>
            <Text style={styles.verificationText}>
              {user.isVerified ? '✓' : '!'}
            </Text>
          </View>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user.name}
          </Text>
          <Text style={[styles.userEmail, { color: colors.muted }]}>
            {user.email}
          </Text>
          {user.phone && (
            <Text style={[styles.userPhone, { color: colors.muted }]}>
              {user.phone}
            </Text>
          )}
          <View style={styles.userRoles}>
            <View style={[styles.roleBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.roleText}>
                {t(`profile.role.${user.role}`)}
              </Text>
            </View>
            {user.role === 'courier' && (
              <View style={[
                styles.roleBadge,
                { backgroundColor: isCourierActive ? colors.success : colors.muted }
              ]}>
                <Text style={styles.roleText}>
                  {isCourierActive ? t('profile.active') : t('profile.inactive')}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderSettingsSection = (title: string, children: React.ReactNode) => {
    return (
      <FadeSlide distance={14}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {title}
          </Text>
          <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
            {children}
          </View>
        </View>
      </FadeSlide>
    );
  };

  const renderSettingsItem = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightElement?: React.ReactNode,
    danger?: boolean
  ) => {
    return (
      <TouchableOpacity
        style={[styles.settingsItem, { borderBottomColor: colors.border }]}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.settingsItemLeft}>
          <Text style={styles.settingsIcon}>{icon}</Text>
          <View style={styles.settingsItemText}>
            <Text style={[
              styles.settingsItemTitle,
              { color: danger ? colors.error : colors.text }
            ]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.settingsItemSubtitle, { color: colors.muted }]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {rightElement && (
          <View style={styles.settingsItemRight}>
            {rightElement}
          </View>
        )}
        {onPress && !rightElement && (
          <Text style={[styles.chevron, { color: colors.muted }]}>›</Text>
        )}
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 32,
    },
    profileHeader: {
      flexDirection: 'row',
      padding: 24,
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 16,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    avatarContainer: {
      position: 'relative',
      marginEnd: 16,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    avatarPlaceholder: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    verificationBadge: {
      position: 'absolute',
      bottom: 0,
      end: 0,
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    verificationText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 4,
      color: theme.colors.textLight,
    },
    userEmail: {
      fontSize: 14,
      marginBottom: 2,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    userPhone: {
      fontSize: 14,
      marginBottom: 8,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    userRoles: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    roleBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginEnd: 8,
      marginBottom: 4,
    },
    roleText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#ffffff',
    },
    section: {
      marginTop: 24,
      marginHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      marginStart: 4,
    },
    sectionContent: {
      borderRadius: 12,
      overflow: 'hidden',
    },
    settingsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    settingsItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingsIcon: {
      fontSize: 20,
      marginEnd: 12,
      width: 24,
      textAlign: 'center',
    },
    settingsItemText: {
      flex: 1,
    },
    settingsItemTitle: {
      fontSize: 16,
      fontWeight: '500',
    },
    settingsItemSubtitle: {
      fontSize: 14,
      marginTop: 2,
    },
    settingsItemRight: {
      marginStart: 12,
    },
    chevron: {
      fontSize: 18,
      marginStart: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 16,
      color: colors.muted,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderProfileHeader()}

        {renderSettingsSection(t('profile.account'), (
          <>
            {renderSettingsItem(
              '👤',
              t('profile.editProfile'),
              t('profile.editProfileSubtitle'),
              () => console.log('Edit profile')
            )}
            {renderSettingsItem(
              '🔒',
              t('profile.privacy'),
              t('profile.privacySubtitle'),
              () => console.log('Privacy settings')
            )}
            {user?.role === 'courier' && renderSettingsItem(
              '🚚',
              t('profile.courierMode'),
              isCourierActive ? t('profile.courierActive') : t('profile.courierInactive'),
              undefined,
              <Switch
                value={isCourierActive}
                onValueChange={handleToggleCourierStatus}
                trackColor={{ false: colors.muted, true: colors.success }}
                thumbColor={isCourierActive ? '#ffffff' : '#ffffff'}
              />
            )}
          </>
        ))}

        {renderSettingsSection(t('profile.wallet'), (
          <>
            {renderSettingsItem(
              <Ionicons name="wallet-outline" size={20} color={colors.warning} />,
              t('profile.myWallet'),
              `${walletBalance.toFixed(2)} ${t('common.currency')}`,
              handleWalletPress
            )}
            {renderSettingsItem(
              <Ionicons name="bar-chart-outline" size={20} color={colors.success} />,
              t('profile.earnings'),
              t('profile.earningsSubtitle'),
              () => navigation.navigate('Earnings')
            )}
          </>
        ))}

        {renderSettingsSection(t('profile.subscription'), (
          <>
            {renderSettingsItem(
              <Ionicons name="star-outline" size={20} color={colors.warning} />,
              t('profile.premiumPlan'),
              subscriptionStatus === 'active' 
                ? t('profile.subscriptionActive')
                : subscriptionStatus === 'expired'
                ? t('profile.subscriptionExpired')
                : t('profile.subscriptionInactive'),
              handleSubscriptionPress,
              undefined,
              subscriptionStatus !== 'active'
            )}
            {subscriptionStatus !== 'active' && renderSettingsItem(
              '🎯',
              t('profile.upgradePlan'),
              t('profile.upgradePlanSubtitle'),
              () => navigation.navigate('SubscriptionPlans')
            )}
          </>
        ))}

        {renderSettingsSection(t('profile.preferences'), (
          <>
            {renderSettingsItem(
              '🌙',
              t('profile.darkMode'),
              isDark ? t('profile.darkModeOn') : t('profile.darkModeOff'),
              undefined,
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.muted, true: colors.primary }}
                thumbColor={isDark ? '#ffffff' : '#ffffff'}
              />
            )}
            {renderSettingsItem(
              '🌐',
              t('profile.language'),
              t('profile.languageSubtitle'),
              () => navigation.navigate('LanguageSettings')
            )}
            {renderSettingsItem(
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />,
              t('profile.notifications'),
              t('profile.notificationsSubtitle'),
              () => navigation.navigate('NotificationSettings')
            )}
          </>
        ))}

        {renderSettingsSection(t('profile.support'), (
          <>
            {renderSettingsItem(
              <Ionicons name="help-circle-outline" size={20} color={colors.primary} />,
              t('profile.help'),
              t('profile.helpSubtitle'),
              () => navigation.navigate('HelpCenter')
            )}
            {renderSettingsItem(
              <Ionicons name="call-outline" size={20} color={colors.success} />,
              t('profile.contact'),
              t('profile.contactSubtitle'),
              () => navigation.navigate('ContactSupport')
            )}
            {renderSettingsItem(
              <Ionicons name="star-outline" size={20} color={colors.warning} />,
              t('profile.rateApp'),
              t('profile.rateAppSubtitle'),
              () => {
                // Open app store for rating
                Alert.alert(
                  t('profile.rateApp'),
                  t('profile.rateAppMessage'),
                  [
                    { text: t('common.cancel'), style: 'cancel' },
                    { text: t('profile.rateNow'), onPress: () => console.log('Open app store') }
                  ]
                );
              }
            )}
          </>
        ))}

        {renderSettingsSection(t('profile.account'), (
          <>
            {renderSettingsItem(
              '🚪',
              t('profile.logout'),
              undefined,
              handleLogout
            )}
            {renderSettingsItem(
              '🗑️',
              t('profile.deleteAccount'),
              t('profile.deleteAccountSubtitle'),
              handleDeleteAccount,
              undefined,
              true
            )}
          </>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
