import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsDark } from '../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { MissionsAdapter } from '../adapters';
import { Mission } from '../types';

interface MissionsScreenProps {
  navigation: any;
}

const MissionsScreen: React.FC<MissionsScreenProps> = ({ navigation }) => {
  const isDark = useIsDark();
  const colors = {
    background: isDark ? '#000000' : '#ffffff',
    card: isDark ? '#1c1c1e' : '#f2f2f7',
    border: isDark ? '#38383a' : '#c6c6c8',
    text: isDark ? '#ffffff' : '#000000',
    primary: '#007AFF',
    muted: isDark ? '#8e8e93' : '#6d6d70',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
  };
  const { t } = useTranslation();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'available' | 'accepted' | 'completed'>('available');

  useEffect(() => {
    loadMissions();
  }, [filter]);

  const loadMissions = async () => {
    try {
      setLoading(true);
      let response;
      if (filter === 'available') {
        response = await MissionsAdapter.getAvailableMissions();
      } else if (filter === 'all') {
        response = await MissionsAdapter.getUserMissions('current_user_id'); // Mock user ID
      } else {
        response = await MissionsAdapter.getMissionsByStatus(filter);
      }
      
      if (response.success && response.data) {
        setMissions(response.data);
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('missions.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMissions();
    setRefreshing(false);
  };

  const handleAcceptMission = async (missionId: string) => {
    try {
      const response = await MissionsAdapter.acceptMission(missionId, 'current_user_id'); // Mock user ID
      if (response.success) {
        Alert.alert(t('common.success'), t('missions.acceptSuccess'));
        await loadMissions();
      } else {
        Alert.alert(t('common.error'), response.error || t('missions.acceptError'));
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('missions.acceptError'));
    }
  };

  const handleCompleteMission = async (missionId: string) => {
    try {
      const response = await MissionsAdapter.completeMission(missionId, 'current_user_id'); // Mock user ID
      if (response.success) {
        Alert.alert(t('common.success'), t('missions.completeSuccess'));
        await loadMissions();
      } else {
        Alert.alert(t('common.error'), response.error || t('missions.completeError'));
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('missions.completeError'));
    }
  };

  const getMissionTypeIcon = (type: Mission['type']) => {
    switch (type) {
      case 'delivery': return '📦';
      case 'pickup': return '📋';
      case 'errand': return '🏃';
      default: return '📋';
    }
  };

  const getMissionStatusColor = (status: Mission['status']) => {
    switch (status) {
      case 'available': return colors.success;
      case 'accepted': return colors.warning;
      case 'in_progress': return colors.primary;
      case 'completed': return colors.success;
      case 'cancelled': return colors.error;
      default: return colors.muted;
    }
  };

  const renderFilterButton = (filterType: typeof filter, label: string) => {
    const isActive = filter === filterType;
    return (
      <TouchableOpacity
        style={[
          styles.filterButton,
          {
            backgroundColor: isActive ? colors.primary : colors.card,
            borderColor: colors.border,
          }
        ]}
        onPress={() => setFilter(filterType)}
      >
        <Text style={[
          styles.filterButtonText,
          { color: isActive ? '#ffffff' : colors.text }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMission = (mission: Mission, index: number) => {
    const canAccept = mission.status === 'available';
    const canComplete = mission.status === 'accepted' || mission.status === 'in_progress';
    
    return (
      <View key={mission.id} style={[styles.missionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.missionHeader}>
          <View style={styles.missionTitleRow}>
            <Text style={styles.missionIcon}>
              {getMissionTypeIcon(mission.type)}
            </Text>
            <Text style={[styles.missionTitle, { color: colors.text }]}>
              {mission.title}
            </Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getMissionStatusColor(mission.status) }
          ]}>
            <Text style={styles.statusText}>
              {t(`missions.status.${mission.status}`)}
            </Text>
          </View>
        </View>

        <Text style={[styles.missionDescription, { color: colors.muted }]}>
          {mission.description}
        </Text>

        <View style={styles.missionDetails}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.muted }]}>📍</Text>
            <Text style={[styles.detailText, { color: colors.text }]}>
              {mission.location.address}
            </Text>
          </View>
          
          {mission.destination && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.muted }]}>🎯</Text>
              <Text style={[styles.detailText, { color: colors.text }]}>
                {mission.destination.address}
              </Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.muted }]}>⏱️</Text>
            <Text style={[styles.detailText, { color: colors.text }]}>
              {mission.estimatedDuration} {t('common.minutes')}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.muted }]}>💰</Text>
            <Text style={[styles.rewardText, { color: colors.success }]}>
              {mission.reward} {t('common.currency')}
            </Text>
          </View>
        </View>

        <View style={styles.missionActions}>
          {canAccept && (
            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton, { backgroundColor: colors.success }]}
              onPress={() => handleAcceptMission(mission.id)}
            >
              <Text style={styles.actionButtonText}>
                {t('missions.accept')}
              </Text>
            </TouchableOpacity>
          )}
          
          {canComplete && (
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton, { backgroundColor: colors.primary }]}
              onPress={() => handleCompleteMission(mission.id)}
            >
              <Text style={styles.actionButtonText}>
                {t('missions.complete')}
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.actionButton, styles.detailsButton, { borderColor: colors.border }]}
            onPress={() => console.log('View details:', mission.id)}
          >
            <Text style={[styles.detailsButtonText, { color: colors.text }]}>
              {t('missions.viewDetails')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 16,
    },
    filtersContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    filterButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginHorizontal: 4,
      borderRadius: 20,
      borderWidth: 1,
      alignItems: 'center',
    },
    filterButtonText: {
      fontSize: 12,
      fontWeight: '600',
    },
    content: {
      flex: 1,
    },
    missionsList: {
      padding: 16,
    },
    missionCard: {
      marginBottom: 16,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
    },
    missionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    missionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    missionIcon: {
      fontSize: 20,
      marginEnd: 8,
    },
    missionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      flex: 1,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#ffffff',
    },
    missionDescription: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 12,
    },
    missionDetails: {
      marginBottom: 16,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    detailLabel: {
      fontSize: 14,
      marginEnd: 8,
      width: 20,
    },
    detailText: {
      fontSize: 14,
      flex: 1,
    },
    rewardText: {
      fontSize: 14,
      fontWeight: 'bold',
      flex: 1,
    },
    missionActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginHorizontal: 4,
      alignItems: 'center',
    },
    acceptButton: {},
    completeButton: {},
    detailsButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#ffffff',
    },
    detailsButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    emptyStateIcon: {
      fontSize: 48,
      marginBottom: 16,
      color: colors.muted,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyStateDescription: {
      fontSize: 14,
      color: colors.muted,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('missions.title')}</Text>
        <View style={styles.filtersContainer}>
          {renderFilterButton('available', t('missions.available'))}
          {renderFilterButton('accepted', t('missions.accepted'))}
          {renderFilterButton('completed', t('missions.completed'))}
          {renderFilterButton('all', t('missions.all'))}
        </View>
      </View>

      <View style={styles.content}>
        {missions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📋</Text>
            <Text style={styles.emptyStateTitle}>
              {t('missions.noMissions')}
            </Text>
            <Text style={styles.emptyStateDescription}>
              {t('missions.noMissionsDescription')}
            </Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.missionsList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          >
            {missions.map((mission, index) => renderMission(mission, index))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MissionsScreen;