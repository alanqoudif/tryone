import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { WalletAdapter } from '../adapters';
import { WalletTransaction } from '../adapters/WalletAdapter';

interface EarningsScreenProps {
  navigation: any;
}

interface EarningsStats {
  totalEarnings: number;
  thisMonthEarnings: number;
  completedMissions: number;
  currentBalance: number;
  pendingAmount: number;
}

const EarningsScreen: React.FC<EarningsScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<EarningsStats | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEarningsData();
  }, []);

  const loadEarningsData = async () => {
    try {
      const statsResponse = await WalletAdapter.getWalletStats('user_1');
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }

      const transactionsResponse = await WalletAdapter.getTransactionHistory('user_1', 50);
      if (transactionsResponse.success && transactionsResponse.data) {
        // Filter only earning transactions
        const earningTransactions = transactionsResponse.data.filter(
          transaction => transaction.type === 'earning'
        );
        setTransactions(earningTransactions);
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('earnings.loadError'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEarningsData();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStatsCard = () => {
    if (!stats) return null;

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="wallet" size={24} color="#4CAF50" />
            <Text style={styles.statValue}>{stats.totalEarnings.toFixed(2)}</Text>
            <Text style={styles.statLabel}>{t('earnings.totalEarnings')}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={24} color="#2196F3" />
            <Text style={styles.statValue}>{stats.thisMonthEarnings.toFixed(2)}</Text>
            <Text style={styles.statLabel}>{t('earnings.thisMonth')}</Text>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={24} color="#FF9800" />
            <Text style={styles.statValue}>{stats.completedMissions}</Text>
            <Text style={styles.statLabel}>{t('earnings.completedMissions')}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="time" size={24} color="#9C27B0" />
            <Text style={styles.statValue}>{stats.pendingAmount.toFixed(2)}</Text>
            <Text style={styles.statLabel}>{t('earnings.pending')}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTransactionItem = (transaction: WalletTransaction) => {
    return (
      <View key={transaction.id} style={styles.transactionItem}>
        <View style={styles.transactionIcon}>
          <Ionicons 
            name="add-circle" 
            size={24} 
            color={transaction.status === 'completed' ? '#4CAF50' : '#FF9800'} 
          />
        </View>
        
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionDescription}>{transaction.description}</Text>
          <Text style={styles.transactionDate}>
            {formatDate(transaction.createdAt)} • {formatTime(transaction.createdAt)}
          </Text>
          {transaction.missionId && (
            <Text style={styles.missionId}>
              {t('earnings.missionId')}: {transaction.missionId}
            </Text>
          )}
        </View>
        
        <View style={styles.transactionAmount}>
          <Text style={styles.amountText}>+{transaction.amount.toFixed(2)}</Text>
          <Text style={styles.currencyText}>{t('common.currency')}</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: transaction.status === 'completed' ? '#4CAF50' : '#FF9800' }
          ]}>
            <Text style={styles.statusText}>
              {t(`earnings.status.${transaction.status}`)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('earnings.title')}</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderStatsCard()}
        
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>{t('earnings.recentEarnings')}</Text>
          
          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="wallet-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>{t('earnings.noEarnings')}</Text>
            </View>
          ) : (
            <View style={styles.transactionsList}>
              {transactions.map(renderTransactionItem)}
            </View>
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
  statsContainer: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  transactionsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  transactionsList: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionIcon: {
    marginEnd: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  missionId: {
    fontSize: 11,
    color: '#999',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  currencyText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default EarningsScreen;