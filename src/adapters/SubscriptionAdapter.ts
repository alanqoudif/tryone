import { ApiResponse } from '../types';

// Subscription Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number; // in OMR
  currency: 'OMR';
  duration: number; // in days
  features: string[];
  featuresAr: string[];
  isActive: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod: 'card' | 'bank_transfer' | 'wallet';
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPayment {
  id: string;
  subscriptionId: string;
  userId: string;
  amount: number;
  currency: 'OMR';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'bank_transfer' | 'wallet';
  transactionId: string;
  paidAt?: Date;
  createdAt: Date;
}

class SubscriptionAdapter {
  private plans: SubscriptionPlan[] = [];
  private userSubscriptions: Map<string, UserSubscription> = new Map();
  private payments: SubscriptionPayment[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize subscription plans
    this.plans = [
      {
        id: 'courier_monthly',
        name: 'Courier Monthly Plan',
        nameAr: 'خطة المندوب الشهرية',
        description: 'Access to courier mode and campus marketplace',
        descriptionAr: 'الوصول إلى وضع المندوب وسوق الحرم الجامعي',
        price: 5.0, // 5 OMR
        currency: 'OMR',
        duration: 30, // 30 days
        features: [
          'Access to courier mode',
          'Campus marketplace access',
          'Real-time mission tracking',
          'Earnings dashboard',
          'Priority support',
          'Mission history'
        ],
        featuresAr: [
          'الوصول إلى وضع المندوب',
          'الوصول إلى سوق الحرم الجامعي',
          'تتبع المهام في الوقت الفعلي',
          'لوحة الأرباح',
          'الدعم المتقدم',
          'سجل المهام'
        ],
        isActive: true
      },
      {
        id: 'premium_student',
        name: 'Premium Student Plan',
        nameAr: 'خطة الطالب المميزة',
        description: 'Enhanced features for students',
        descriptionAr: 'ميزات محسنة للطلاب',
        price: 3.0, // 3 OMR
        currency: 'OMR',
        duration: 30,
        features: [
          'Advanced AI assistant',
          'WhatsApp notifications',
          'Priority calendar sync',
          'Extended study plans',
          'Premium templates'
        ],
        featuresAr: [
          'المساعد الذكي المتقدم',
          'إشعارات واتساب',
          'مزامنة التقويم المتقدمة',
          'خطط دراسية موسعة',
          'قوالب مميزة'
        ],
        isActive: true
      }
    ];

    // Mock user subscription
    const mockSubscription: UserSubscription = {
      id: 'sub_user_1',
      userId: 'user_1',
      planId: 'courier_monthly',
      status: 'active',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      autoRenew: true,
      paymentMethod: 'card',
      transactionId: 'txn_123456',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    };

    this.userSubscriptions.set('user_1', mockSubscription);

    // Mock payment
    this.payments = [
      {
        id: 'payment_1',
        subscriptionId: 'sub_user_1',
        userId: 'user_1',
        amount: 5.0,
        currency: 'OMR',
        status: 'completed',
        paymentMethod: 'card',
        transactionId: 'txn_123456',
        paidAt: new Date('2024-01-01'),
        createdAt: new Date('2024-01-01')
      }
    ];
  }

  // Get all available subscription plans
  async getSubscriptionPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const activePlans = this.plans.filter(plan => plan.isActive);
        resolve({
          success: true,
          data: activePlans,
          message: 'تم جلب خطط الاشتراك بنجاح'
        });
      }, 300);
    });
  }

  // Get user's current subscription
  async getUserSubscription(userId: string): Promise<ApiResponse<UserSubscription | null>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const subscription = this.userSubscriptions.get(userId);
        resolve({
          success: true,
          data: subscription || null,
          message: subscription ? 'تم جلب بيانات الاشتراك بنجاح' : 'لا يوجد اشتراك نشط'
        });
      }, 300);
    });
  }

  // Subscribe to a plan
  async subscribeToPlan(userId: string, planId: string, paymentMethod: 'card' | 'bank_transfer' | 'wallet'): Promise<ApiResponse<UserSubscription>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const plan = this.plans.find(p => p.id === planId);
        if (!plan) {
          resolve({
            success: false,
            data: {} as UserSubscription,
            message: 'خطة الاشتراك غير موجودة'
          });
          return;
        }

        // Check if user already has an active subscription
        const existingSubscription = this.userSubscriptions.get(userId);
        if (existingSubscription && existingSubscription.status === 'active') {
          resolve({
            success: false,
            data: {} as UserSubscription,
            message: 'لديك اشتراك نشط بالفعل'
          });
          return;
        }

        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);

        const subscription: UserSubscription = {
          id: `sub_${userId}_${Date.now()}`,
          userId,
          planId,
          status: 'pending', // Will be activated after payment
          startDate,
          endDate,
          autoRenew: true,
          paymentMethod,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Create payment record
        const payment: SubscriptionPayment = {
          id: `payment_${Date.now()}`,
          subscriptionId: subscription.id,
          userId,
          amount: plan.price,
          currency: 'OMR',
          status: 'pending',
          paymentMethod,
          transactionId: `txn_${Date.now()}`,
          createdAt: new Date()
        };

        this.userSubscriptions.set(userId, subscription);
        this.payments.push(payment);

        // Simulate payment processing
        setTimeout(() => {
          payment.status = 'completed';
          payment.paidAt = new Date();
          subscription.status = 'active';
          subscription.transactionId = payment.transactionId;
          subscription.updatedAt = new Date();
          this.userSubscriptions.set(userId, subscription);
        }, 2000);

        resolve({
          success: true,
          data: subscription,
          message: 'تم إنشاء الاشتراك بنجاح، جاري معالجة الدفع'
        });
      }, 600);
    });
  }

  // Cancel subscription
  async cancelSubscription(userId: string): Promise<ApiResponse<UserSubscription>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const subscription = this.userSubscriptions.get(userId);
        if (!subscription) {
          resolve({
            success: false,
            data: {} as UserSubscription,
            message: 'لا يوجد اشتراك للإلغاء'
          });
          return;
        }

        if (subscription.status !== 'active') {
          resolve({
            success: false,
            data: subscription,
            message: 'الاشتراك غير نشط'
          });
          return;
        }

        subscription.status = 'cancelled';
        subscription.autoRenew = false;
        subscription.updatedAt = new Date();

        this.userSubscriptions.set(userId, subscription);

        resolve({
          success: true,
          data: subscription,
          message: 'تم إلغاء الاشتراك بنجاح'
        });
      }, 500);
    });
  }

  // Toggle auto-renewal
  async toggleAutoRenew(userId: string): Promise<ApiResponse<UserSubscription>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const subscription = this.userSubscriptions.get(userId);
        if (!subscription) {
          resolve({
            success: false,
            data: {} as UserSubscription,
            message: 'لا يوجد اشتراك'
          });
          return;
        }

        subscription.autoRenew = !subscription.autoRenew;
        subscription.updatedAt = new Date();

        this.userSubscriptions.set(userId, subscription);

        resolve({
          success: true,
          data: subscription,
          message: subscription.autoRenew ? 'تم تفعيل التجديد التلقائي' : 'تم إيقاف التجديد التلقائي'
        });
      }, 300);
    });
  }

  // Get subscription payment history
  async getPaymentHistory(userId: string): Promise<ApiResponse<SubscriptionPayment[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userPayments = this.payments
          .filter(payment => payment.userId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        resolve({
          success: true,
          data: userPayments,
          message: 'تم جلب سجل المدفوعات بنجاح'
        });
      }, 300);
    });
  }

  // Check if user has active subscription
  async hasActiveSubscription(userId: string): Promise<ApiResponse<boolean>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const subscription = this.userSubscriptions.get(userId);
        const isActive = subscription && 
          subscription.status === 'active' && 
          new Date() <= new Date(subscription.endDate);

        resolve({
          success: true,
          data: !!isActive,
          message: isActive ? 'يوجد اشتراك نشط' : 'لا يوجد اشتراك نشط'
        });
      }, 200);
    });
  }

  // Get subscription statistics
  async getSubscriptionStats(userId: string): Promise<ApiResponse<{
    totalPaid: number;
    currentPlan: string | null;
    daysRemaining: number;
    isActive: boolean;
    autoRenew: boolean;
  }>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const subscription = this.userSubscriptions.get(userId);
        const userPayments = this.payments.filter(p => p.userId === userId && p.status === 'completed');
        const totalPaid = userPayments.reduce((sum, p) => sum + p.amount, 0);

        let currentPlan = null;
        let daysRemaining = 0;
        let isActive = false;
        let autoRenew = false;

        if (subscription) {
          const plan = this.plans.find(p => p.id === subscription.planId);
          currentPlan = plan ? plan.nameAr : null;
          
          const now = new Date();
          const endDate = new Date(subscription.endDate);
          daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
          isActive = subscription.status === 'active' && daysRemaining > 0;
          autoRenew = subscription.autoRenew;
        }

        resolve({
          success: true,
          data: {
            totalPaid,
            currentPlan,
            daysRemaining,
            isActive,
            autoRenew
          },
          message: 'تم جلب إحصائيات الاشتراك بنجاح'
        });
      }, 400);
    });
  }
}

export default new SubscriptionAdapter();