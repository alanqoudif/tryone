import { User, ApiResponse, OnboardingForm, LoginForm } from '../types';

class UserAdapter {
  private currentUser: User | null = null;
  private users: User[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create some mock users
    this.users = [
      {
        id: 'user_1',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '+966501234567',
        avatar: undefined,
        role: 'student',
        university: 'جامعة الملك سعود',
        college: 'كلية الهندسة',
        isVerified: true,
        isCourierActive: false,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      },
      {
        id: 'user_2',
        name: 'فاطمة علي',
        email: 'fatima@example.com',
        phone: '+966507654321',
        avatar: undefined,
        role: 'courier',
        university: 'جامعة الملك عبدالعزيز',
        college: 'كلية الطب',
        isVerified: true,
        isCourierActive: true,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date()
      },
      {
        id: 'user_3',
        name: 'محمد الأحمد',
        email: 'mohammed@example.com',
        phone: '+966509876543',
        avatar: undefined,
        role: 'student',
        university: 'جامعة الملك فهد',
        college: 'كلية علوم الحاسب',
        isVerified: false,
        isCourierActive: false,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date()
      }
    ];

    // Set default current user
    this.currentUser = this.users[0];
  }

  // Login with phone and OTP
  async login(loginData: LoginForm): Promise<ApiResponse<{ user: User; token: string }>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock OTP validation
        if (loginData.otp !== '1234') {
          resolve({
            success: false,
            data: { user: {} as User, token: '' },
            message: 'رمز التحقق غير صحيح'
          });
          return;
        }

        // Find user by phone
        const user = this.users.find(u => u.phone === loginData.phone);
        if (!user) {
          resolve({
            success: false,
            data: { user: {} as User, token: '' },
            message: 'رقم الهاتف غير مسجل'
          });
          return;
        }

        this.currentUser = user;
        const mockToken = `mock_token_${user.id}_${Date.now()}`;

        resolve({
          success: true,
          data: { user, token: mockToken },
          message: 'تم تسجيل الدخول بنجاح'
        });
      }, 800);
    });
  }

  // Send OTP to phone
  async sendOTP(phone: string): Promise<ApiResponse<boolean>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock OTP sending
        console.log(`Mock OTP sent to ${phone}: 1234`);
        resolve({
          success: true,
          data: true,
          message: 'تم إرسال رمز التحقق'
        });
      }, 1000);
    });
  }

  // Complete onboarding
  async completeOnboarding(onboardingData: OnboardingForm): Promise<ApiResponse<User>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = this.users.find(u => u.email === onboardingData.email);
        if (existingUser) {
          resolve({
            success: false,
            data: {} as User,
            message: 'البريد الإلكتروني مسجل مسبقاً'
          });
          return;
        }

        // Create new user
        const newUser: User = {
          id: `user_${Date.now()}`,
          name: onboardingData.name,
          email: onboardingData.email,
          phone: '+966500000000', // Mock phone
          avatar: undefined,
          role: onboardingData.role,
          university: onboardingData.university,
          college: onboardingData.college,
          isVerified: false,
          isCourierActive: onboardingData.role === 'courier',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        this.users.push(newUser);
        this.currentUser = newUser;

        resolve({
          success: true,
          data: newUser,
          message: 'تم إنشاء الحساب بنجاح'
        });
      }, 1200);
    });
  }

  // Get current user
  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: this.currentUser,
          message: this.currentUser ? 'User data fetched successfully' : 'No user logged in'
        });
      }, 200);
    });
  }

  // Update user profile
  async updateProfile(updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<User>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.currentUser) {
          resolve({
            success: false,
            data: {} as User,
            message: 'No user logged in'
          });
          return;
        }

        // Update current user
        this.currentUser = {
          ...this.currentUser,
          ...updates,
          updatedAt: new Date()
        };

        // Update in users array
        const userIndex = this.users.findIndex(u => u.id === this.currentUser!.id);
        if (userIndex !== -1) {
          this.users[userIndex] = this.currentUser;
        }

        resolve({
          success: true,
          data: this.currentUser,
          message: 'تم تحديث الملف الشخصي بنجاح'
        });
      }, 600);
    });
  }

  // Toggle courier status
  async toggleCourierStatus(): Promise<ApiResponse<User>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.currentUser) {
          resolve({
            success: false,
            data: {} as User,
            message: 'No user logged in'
          });
          return;
        }

        if (this.currentUser.role !== 'courier') {
          resolve({
            success: false,
            data: this.currentUser,
            message: 'المستخدم ليس مندوب توصيل'
          });
          return;
        }

        this.currentUser = {
          ...this.currentUser,
          isCourierActive: !this.currentUser.isCourierActive,
          updatedAt: new Date()
        };

        // Update in users array
        const userIndex = this.users.findIndex(u => u.id === this.currentUser!.id);
        if (userIndex !== -1) {
          this.users[userIndex] = this.currentUser;
        }

        resolve({
          success: true,
          data: this.currentUser,
          message: this.currentUser.isCourierActive ? 'تم تفعيل حالة التوصيل' : 'تم إيقاف حالة التوصيل'
        });
      }, 400);
    });
  }

  // Verify user account
  async verifyAccount(verificationCode: string): Promise<ApiResponse<User>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.currentUser) {
          resolve({
            success: false,
            data: {} as User,
            message: 'No user logged in'
          });
          return;
        }

        // Mock verification
        if (verificationCode !== '123456') {
          resolve({
            success: false,
            data: this.currentUser,
            message: 'رمز التحقق غير صحيح'
          });
          return;
        }

        this.currentUser = {
          ...this.currentUser,
          isVerified: true,
          updatedAt: new Date()
        };

        // Update in users array
        const userIndex = this.users.findIndex(u => u.id === this.currentUser!.id);
        if (userIndex !== -1) {
          this.users[userIndex] = this.currentUser;
        }

        resolve({
          success: true,
          data: this.currentUser,
          message: 'تم التحقق من الحساب بنجاح'
        });
      }, 800);
    });
  }

  // Logout
  async logout(): Promise<ApiResponse<boolean>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentUser = null;
        resolve({
          success: true,
          data: true,
          message: 'تم تسجيل الخروج بنجاح'
        });
      }, 300);
    });
  }

  // Delete account
  async deleteAccount(): Promise<ApiResponse<boolean>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.currentUser) {
          resolve({
            success: false,
            data: false,
            message: 'No user logged in'
          });
          return;
        }

        // Remove user from users array
        this.users = this.users.filter(u => u.id !== this.currentUser!.id);
        this.currentUser = null;

        resolve({
          success: true,
          data: true,
          message: 'تم حذف الحساب بنجاح'
        });
      }, 1000);
    });
  }

  // Get user statistics
  async getUserStats(): Promise<ApiResponse<{
    totalMissions: number;
    completedMissions: number;
    totalEarnings: number;
    averageRating: number;
    joinDate: Date;
  }>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.currentUser) {
          resolve({
            success: false,
            data: {
              totalMissions: 0,
              completedMissions: 0,
              totalEarnings: 0,
              averageRating: 0,
              joinDate: new Date()
            },
            message: 'No user logged in'
          });
          return;
        }

        // Mock statistics
        const stats = {
          totalMissions: Math.floor(Math.random() * 50) + 10,
          completedMissions: Math.floor(Math.random() * 40) + 5,
          totalEarnings: Math.floor(Math.random() * 2000) + 500,
          averageRating: 4.2 + Math.random() * 0.7,
          joinDate: this.currentUser.createdAt
        };

        resolve({
          success: true,
          data: stats,
          message: 'User statistics fetched successfully'
        });
      }, 500);
    });
  }
}

export default new UserAdapter();