import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { WalletAdapter } from '../adapters';
import { WalletTransaction, Wallet } from '../adapters/WalletAdapter';

interface WalletScreenProps {
  navigation: any;
}

const WalletScreen: React.FC<WalletScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const walletResponse = await WalletAdapter.getWallet('user_1');
      if (walletResponse.success && walletResponse.data) {
        setWallet(walletResponse.data);
      }

      const transactionsResponse = await WalletAdapter.getTransactionHistory('user_1', 20);
      if (transactionsResponse.success && transactionsResponse.data) {
        setTransactions(transactionsResponse.data);
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
      Alert.alert(t('common.error'), t('wallet.loadError'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadWalletData();
  };

  const handleWithdraw = () => {
    if (!wallet || wallet.balance < 50) {
      Alert.alert(t('wallet.withdraw'), t('wallet.minimumWithdraw'));
      return;
    }
    navigation.navigate('WithdrawScreen');
  };

  const renderWalletHeader = () => {
    if (!wallet) return null;

    return (
      <View style={[styles.walletHeader, { backgroundColor: colors.primary }]}>
        <Text style={styles.balanceLabel}>{t('wallet.currentBalance')}</Text>
        <Text style={styles.balanceAmount}>
          {wallet.balance.toFixed(2)} {t('common.currency')}
        </Text>
        <Text style={styles.pendingAmount}>
          {t('wallet.pending')}: {wallet.pendingAmount.toFixed(2)} {t('common.currency')}
        </Text>
        
        <TouchableOpacity
          style={[styles.withdrawButton, { backgroundColor: colors.card }]}
          onPress={handleWithdraw}
        >
          <Text style={[styles.withdrawButtonText, { color: colors.primary }]}>
            {t('wallet.withdraw')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTransaction = (transaction: WalletTransaction) => {
    const isPositive = transaction.amount > 0;
    
    return (
      <View
        key={transaction.id}
        style={[styles.transactionItem, { backgroundColor: colors.card }]}
      >
        <View style={styles.transactionLeft}>
          <Text style={[styles.transactionType, { color: colors.text }]}>
            {t(`wallet.transactionType.${transaction.type}`)}
          </Text>
          <Text style={[styles.transactionDate, { color: colors.muted }]}>
            {new Date(transaction.createdAt).toLocaleDateString()}
          </Text>
          {transaction.description && (
            <Text style={[styles.transactionDescription, { color: colors.muted }]}>
              {transaction.description}
            </Text>
          )}
        </View>
        
        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              { color: isPositive ? colors.success : colors.error }
            ]}
          >
            {isPositive ? '+' : ''}{transaction.amount.toFixed(2)} {t('common.currency')}
          </Text>
          <Text style={[styles.transactionStatus, { color: colors.muted }]}>
            {t(`wallet.status.${transaction.status}`)}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            {t('common.loading')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderWalletHeader()}
        
        <View style={styles.transactionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('wallet.recentTransactions')}
          </Text>
          
          {transactions.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
              <Text style={[styles.emptyStateText, { color: colors.muted }]}>
                {t('wallet.noTransactions')}
              </Text>
            </View>
          ) : (
            transactions.map(renderTransaction)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  walletHeader: {
    padding: 24,
    margin: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  pendingAmount: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 24,
  },
  withdrawButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    marginBottom: 2,
  },
  transactionDescription: {
    fontSize: 12,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 12,
  },
  emptyState: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
  },
});

export default WalletScreen;