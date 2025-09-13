import { ApiResponse } from '../types';

// Wallet Types
export interface WalletTransaction {
  id: string;
  type: 'earning' | 'withdrawal' | 'subscription' | 'refund';
  amount: number;
  description: string;
  missionId?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  totalEarnings: number;
  totalWithdrawals: number;
  pendingAmount: number;
  transactions: WalletTransaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  bankAccount: string;
  iban: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: Date;
  processedAt?: Date;
  notes?: string;
}

class WalletAdapter {
  private wallets: Map<string, Wallet> = new Map();
  private withdrawalRequests: WithdrawalRequest[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create mock wallet for default user
    const mockWallet: Wallet = {
      id: 'wallet_user_1',
      userId: 'user_1',
      balance: 125.50,
      totalEarnings: 450.75,
      totalWithdrawals: 325.25,
      pendingAmount: 25.00,
      transactions: [
        {
          id: 'txn_1',
          type: 'earning',
          amount: 15.00,
          description: 'توصيل كتب - مكتبة الجامعة',
          missionId: 'mission_1',
          status: 'completed',
          createdAt: new Date('2024-01-15T10:30:00'),
          completedAt: new Date('2024-01-15T11:00:00')
        },
        {
          id: 'txn_2',
          type: 'earning',
          amount: 20.00,
          description: 'طباعة مستندات - مركز الطباعة',
          missionId: 'mission_2',
          status: 'completed',
          createdAt: new Date('2024-01-16T14:15:00'),
          completedAt: new Date('2024-01-16T15:30:00')
        },
        {
          id: 'txn_3',
          type: 'withdrawal',
          amount: -100.00,
          description: 'سحب إلى الحساب البنكي',
          status: 'completed',
          createdAt: new Date('2024-01-18T09:00:00'),
          completedAt: new Date('2024-01-19T10:00:00')
        },
        {
          id: 'txn_4',
          type: 'earning',
          amount: 12.50,
          description: 'توصيل وجبة - كافتيريا الكلية',
          missionId: 'mission_3',
          status: 'pending',
          createdAt: new Date('2024-01-20T12:00:00')
        }
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    };

    this.wallets.set('user_1', mockWallet);

    // Mock withdrawal requests
    this.withdrawalRequests = [
      {
        id: 'withdrawal_1',
        userId: 'user_1',
        amount: 100.00,
        bankAccount: 'بنك مسقط',
        iban: 'OM81BMAG1234567890123456',
        status: 'completed',
        requestedAt: new Date('2024-01-18T09:00:00'),
        processedAt: new Date('2024-01-19T10:00:00')
      }
    ];
  }

  // Get user wallet
  async getWallet(userId: string): Promise<ApiResponse<Wallet>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let wallet = this.wallets.get(userId);
        
        if (!wallet) {
          // Create new wallet for user
          wallet = {
            id: `wallet_${userId}`,
            userId,
            balance: 0,
            totalEarnings: 0,
            totalWithdrawals: 0,
            pendingAmount: 0,
            transactions: [],
            createdAt: new Date(),
            updatedAt: new Date()
          };
          this.wallets.set(userId, wallet);
        }

        resolve({
          success: true,
          data: wallet,
          message: 'تم جلب بيانات المحفظة بنجاح'
        });
      }, 300);
    });
  }

  // Add earning from completed mission
  async addEarning(userId: string, amount: number, description: string, missionId?: string): Promise<ApiResponse<WalletTransaction>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const wallet = this.wallets.get(userId);
        if (!wallet) {
          resolve({
            success: false,
            data: {} as WalletTransaction,
            message: 'المحفظة غير موجودة'
          });
          return;
        }

        const transaction: WalletTransaction = {
          id: `txn_${Date.now()}`,
          type: 'earning',
          amount,
          description,
          missionId,
          status: 'completed',
          createdAt: new Date(),
          completedAt: new Date()
        };

        wallet.transactions.unshift(transaction);
        wallet.balance += amount;
        wallet.totalEarnings += amount;
        wallet.updatedAt = new Date();

        this.wallets.set(userId, wallet);

        resolve({
          success: true,
          data: transaction,
          message: 'تم إضافة الأرباح بنجاح'
        });
      }, 400);
    });
  }

  // Request withdrawal
  async requestWithdrawal(userId: string, amount: number, bankAccount: string, iban: string): Promise<ApiResponse<WithdrawalRequest>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const wallet = this.wallets.get(userId);
        if (!wallet) {
          resolve({
            success: false,
            data: {} as WithdrawalRequest,
            message: 'المحفظة غير موجودة'
          });
          return;
        }

        if (wallet.balance < amount) {
          resolve({
            success: false,
            data: {} as WithdrawalRequest,
            message: 'الرصيد غير كافي'
          });
          return;
        }

        if (amount < 10) {
          resolve({
            success: false,
            data: {} as WithdrawalRequest,
            message: 'الحد الأدنى للسحب 10 ريال عماني'
          });
          return;
        }

        const withdrawalRequest: WithdrawalRequest = {
          id: `withdrawal_${Date.now()}`,
          userId,
          amount,
          bankAccount,
          iban,
          status: 'pending',
          requestedAt: new Date()
        };

        this.withdrawalRequests.push(withdrawalRequest);

        // Create pending transaction
        const transaction: WalletTransaction = {
          id: `txn_${Date.now()}`,
          type: 'withdrawal',
          amount: -amount,
          description: `طلب سحب إلى ${bankAccount}`,
          status: 'pending',
          createdAt: new Date()
        };

        wallet.transactions.unshift(transaction);
        wallet.balance -= amount;
        wallet.pendingAmount += amount;
        wallet.updatedAt = new Date();

        this.wallets.set(userId, wallet);

        resolve({
          success: true,
          data: withdrawalRequest,
          message: 'تم إرسال طلب السحب بنجاح'
        });
      }, 600);
    });
  }

  // Get withdrawal requests for user
  async getWithdrawalRequests(userId: string): Promise<ApiResponse<WithdrawalRequest[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userRequests = this.withdrawalRequests
          .filter(req => req.userId === userId)
          .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

        resolve({
          success: true,
          data: userRequests,
          message: 'تم جلب طلبات السحب بنجاح'
        });
      }, 300);
    });
  }

  // Get transaction history
  async getTransactionHistory(userId: string, limit: number = 20): Promise<ApiResponse<WalletTransaction[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const wallet = this.wallets.get(userId);
        if (!wallet) {
          resolve({
            success: false,
            data: [],
            message: 'المحفظة غير موجودة'
          });
          return;
        }

        const transactions = wallet.transactions
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit);

        resolve({
          success: true,
          data: transactions,
          message: 'تم جلب سجل المعاملات بنجاح'
        });
      }, 300);
    });
  }

  // Get wallet statistics
  async getWalletStats(userId: string): Promise<ApiResponse<{
    totalEarnings: number;
    totalWithdrawals: number;
    currentBalance: number;
    pendingAmount: number;
    thisMonthEarnings: number;
    completedMissions: number;
  }>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const wallet = this.wallets.get(userId);
        if (!wallet) {
          resolve({
            success: false,
            data: {
              totalEarnings: 0,
              totalWithdrawals: 0,
              currentBalance: 0,
              pendingAmount: 0,
              thisMonthEarnings: 0,
              completedMissions: 0
            },
            message: 'المحفظة غير موجودة'
          });
          return;
        }

        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const thisMonthEarnings = wallet.transactions
          .filter(t => t.type === 'earning' && t.status === 'completed' && new Date(t.createdAt) >= thisMonth)
          .reduce((sum, t) => sum + t.amount, 0);

        const completedMissions = wallet.transactions
          .filter(t => t.type === 'earning' && t.status === 'completed' && t.missionId)
          .length;

        resolve({
          success: true,
          data: {
            totalEarnings: wallet.totalEarnings,
            totalWithdrawals: wallet.totalWithdrawals,
            currentBalance: wallet.balance,
            pendingAmount: wallet.pendingAmount,
            thisMonthEarnings,
            completedMissions
          },
          message: 'تم جلب إحصائيات المحفظة بنجاح'
        });
      }, 400);
    });
  }
}

export default new WalletAdapter();