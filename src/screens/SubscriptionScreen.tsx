import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SubscriptionAdapter } from '../adapters';
import { SubscriptionPlan, UserSubscription } from '../adapters/SubscriptionAdapter';

interface SubscriptionScreenProps {
  navigation: any;
}

const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      const plansResponse = await SubscriptionAdapter.getSubscriptionPlans();
      if (plansResponse.success && plansResponse.data) {
        setPlans(plansResponse.data);
      }

      const currentResponse = await SubscriptionAdapter.getUserSubscription('user_1');
      if (currentResponse.success && currentResponse.data) {
        setCurrentSubscription(currentResponse.data);
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('subscription.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    setSubscribing(planId);
    try {
      const response = await SubscriptionAdapter.subscribeToPlan('user_1', planId, 'card');
      if (response.success) {
        Alert.alert(t('common.success'), t('subscription.subscribeSuccess'));
        loadSubscriptionData();
      } else {
        Alert.alert(t('common.error'), response.message || t('subscription.subscribeError'));
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('subscription.subscribeError'));
    } finally {
      setSubscribing(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;

    Alert.alert(
      t('subscription.cancelTitle'),
      t('subscription.cancelMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('subscription.confirmCancel'),
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await SubscriptionAdapter.cancelSubscription('user_1');
              if (response.success) {
                Alert.alert(t('common.success'), t('subscription.cancelSuccess'));
                loadSubscriptionData();
              } else {
                Alert.alert(t('common.error'), response.message || t('subscription.cancelError'));
              }
            } catch (error) {
              Alert.alert(t('common.error'), t('subscription.cancelError'));
            }
          },
        },
      ]
    );
  };

  const renderPlanCard = (plan: SubscriptionPlan) => {
    const isCurrentPlan = currentSubscription?.planId === plan.id;
    const isPopular = plan.name.toLowerCase().includes('premium');

    return (
      <View key={plan.id} style={[styles.planCard, isPopular && styles.popularPlan]}>
        {isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>{t('subscription.popular')}</Text>
          </View>
        )}
        
        <Text style={styles.planName}>{plan.name}</Text>
        <Text style={styles.planPrice}>
          {plan.price} {t('common.currency')}
          <Text style={styles.planDuration}>/{t(`subscription.${plan.duration}`)}</Text>
        </Text>
        
        <Text style={styles.planDescription}>{plan.description}</Text>
        
        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
        
        {isCurrentPlan ? (
          <View style={styles.currentPlanContainer}>
            <Text style={styles.currentPlanText}>{t('subscription.currentPlan')}</Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelSubscription}
            >
              <Text style={styles.cancelButtonText}>{t('subscription.cancel')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.subscribeButton, subscribing === plan.id && styles.subscribingButton]}
            onPress={() => handleSubscribe(plan.id)}
            disabled={subscribing === plan.id}
          >
            {subscribing === plan.id ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.subscribeButtonText}>{t('subscription.subscribe')}</Text>
            )}
          </TouchableOpacity>
        )}
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
        <Text style={styles.headerTitle}>{t('subscription.title')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>{t('subscription.subtitle')}</Text>
        
        {currentSubscription && (
          <View style={styles.currentSubscriptionCard}>
            <Text style={styles.currentSubscriptionTitle}>{t('subscription.currentSubscription')}</Text>
            <Text style={styles.currentSubscriptionName}>
              {plans.find(p => p.id === currentSubscription.planId)?.name || 'Unknown Plan'}
            </Text>
            <Text style={styles.currentSubscriptionExpiry}>
              {t('subscription.expiresOn')}: {new Date(currentSubscription.endDate).toLocaleDateString()}
            </Text>
          </View>
        )}
        
        <View style={styles.plansContainer}>
          {plans.map(renderPlanCard)}
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
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  currentSubscriptionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  currentSubscriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
  },
  currentSubscriptionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  currentSubscriptionExpiry: {
    fontSize: 14,
    color: '#666',
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  popularPlan: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    end: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  planDuration: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#666',
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginStart: 8,
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscribingButton: {
    backgroundColor: '#ccc',
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  currentPlanContainer: {
    alignItems: 'center',
  },
  currentPlanText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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

export default SubscriptionScreen;