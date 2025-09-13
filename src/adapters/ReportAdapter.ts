// Report interfaces
export interface Report {
  id: string;
  reporterId: string;
  reportedUserId?: string;
  reportedMissionId?: string;
  type: 'user' | 'mission' | 'inappropriate_content' | 'fraud' | 'harassment' | 'other';
  category: string;
  description: string;
  evidence?: {
    screenshots?: string[];
    messages?: string[];
    additionalInfo?: string;
  };
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  adminNotes?: string;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface CreateReportRequest {
  reportedUserId?: string;
  reportedMissionId?: string;
  type: 'user' | 'mission' | 'inappropriate_content' | 'fraud' | 'harassment' | 'other';
  category: string;
  description: string;
  evidence?: {
    screenshots?: string[];
    messages?: string[];
    additionalInfo?: string;
  };
}

export interface ReportStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  reportsByType: Record<string, number>;
  reportsByPriority: Record<string, number>;
  averageResolutionTime: number; // in hours
}

export interface UserSafetyScore {
  userId: string;
  safetyScore: number; // 0-100
  reportsAgainst: number;
  reportsResolved: number;
  trustLevel: 'new' | 'trusted' | 'verified' | 'flagged' | 'suspended';
  lastIncident?: Date;
}

class ReportAdapter {
  private static instance: ReportAdapter;
  private reports: Report[] = [];
  private userSafetyScores: Map<string, UserSafetyScore> = new Map();
  private initialized = false;

  private constructor() {}

  static getInstance(): ReportAdapter {
    if (!ReportAdapter.instance) {
      ReportAdapter.instance = new ReportAdapter();
    }
    return ReportAdapter.instance;
  }

  private async initialize(): Promise<void> {
    if (this.initialized) return;

    // Initialize with mock data
    await this.initializeMockData();
    this.initialized = true;
  }

  private async initializeMockData(): Promise<void> {
    const mockReports: Report[] = [
      {
        id: '1',
        reporterId: 'user1',
        reportedUserId: 'user2',
        type: 'user',
        category: 'سلوك غير لائق',
        description: 'المستخدم لم يلتزم بالموعد المحدد وكان غير مهذب',
        status: 'resolved',
        priority: 'medium',
        resolution: 'تم التحدث مع المستخدم وتم التحذير',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-12'),
        resolvedAt: new Date('2024-01-12'),
        resolvedBy: 'admin1',
      },
      {
        id: '2',
        reporterId: 'user3',
        reportedMissionId: 'mission1',
        type: 'fraud',
        category: 'احتيال مالي',
        description: 'طلب دفع مبلغ إضافي غير متفق عليه',
        status: 'under_review',
        priority: 'high',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
    ];

    this.reports = mockReports;

    // Initialize safety scores
    const mockSafetyScores: UserSafetyScore[] = [
      {
        userId: 'user1',
        safetyScore: 95,
        reportsAgainst: 0,
        reportsResolved: 0,
        trustLevel: 'trusted',
      },
      {
        userId: 'user2',
        safetyScore: 75,
        reportsAgainst: 1,
        reportsResolved: 1,
        trustLevel: 'trusted',
        lastIncident: new Date('2024-01-12'),
      },
    ];

    mockSafetyScores.forEach(score => {
      this.userSafetyScores.set(score.userId, score);
    });
  }

  // Create a new report
  async createReport(reporterId: string, request: CreateReportRequest): Promise<Report> {
    await this.initialize();

    // Determine priority based on type
    let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
    if (request.type === 'fraud' || request.type === 'harassment') {
      priority = 'high';
    } else if (request.type === 'inappropriate_content') {
      priority = 'urgent';
    }

    const newReport: Report = {
      id: Date.now().toString(),
      reporterId,
      ...request,
      status: 'pending',
      priority,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.reports.push(newReport);
    
    // Update safety score for reported user
    if (request.reportedUserId) {
      await this.updateUserSafetyScore(request.reportedUserId, 'report_received');
    }

    return newReport;
  }

  // Get reports by status
  async getReportsByStatus(status?: Report['status']): Promise<Report[]> {
    await this.initialize();

    let filteredReports = this.reports;
    if (status) {
      filteredReports = filteredReports.filter(report => report.status === status);
    }

    return filteredReports.sort((a, b) => {
      // Sort by priority first, then by creation date
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  // Get reports for a specific user
  async getUserReports(userId: string, type?: 'reported_by' | 'reported_against'): Promise<Report[]> {
    await this.initialize();

    let userReports = this.reports;

    if (type === 'reported_by') {
      userReports = userReports.filter(report => report.reporterId === userId);
    } else if (type === 'reported_against') {
      userReports = userReports.filter(report => report.reportedUserId === userId);
    } else {
      userReports = userReports.filter(
        report => report.reporterId === userId || report.reportedUserId === userId
      );
    }

    return userReports.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Update report status
  async updateReportStatus(
    reportId: string,
    status: Report['status'],
    adminId?: string,
    adminNotes?: string,
    resolution?: string
  ): Promise<Report> {
    await this.initialize();

    const reportIndex = this.reports.findIndex(report => report.id === reportId);
    if (reportIndex === -1) {
      throw new Error('البلاغ غير موجود');
    }

    const updatedReport: Report = {
      ...this.reports[reportIndex],
      status,
      updatedAt: new Date(),
    };

    if (adminNotes) updatedReport.adminNotes = adminNotes;
    if (resolution) updatedReport.resolution = resolution;
    if (status === 'resolved' || status === 'dismissed') {
      updatedReport.resolvedAt = new Date();
      updatedReport.resolvedBy = adminId;
    }

    this.reports[reportIndex] = updatedReport;

    // Update safety score based on resolution
    if (updatedReport.reportedUserId && status === 'resolved') {
      await this.updateUserSafetyScore(updatedReport.reportedUserId, 'report_resolved');
    }

    return updatedReport;
  }

  // Get user safety score
  async getUserSafetyScore(userId: string): Promise<UserSafetyScore> {
    await this.initialize();

    let safetyScore = this.userSafetyScores.get(userId);
    if (!safetyScore) {
      // Create new safety score for user
      safetyScore = {
        userId,
        safetyScore: 100,
        reportsAgainst: 0,
        reportsResolved: 0,
        trustLevel: 'new',
      };
      this.userSafetyScores.set(userId, safetyScore);
    }

    return safetyScore;
  }

  // Update user safety score
  private async updateUserSafetyScore(
    userId: string,
    action: 'report_received' | 'report_resolved' | 'positive_interaction'
  ): Promise<void> {
    const currentScore = await this.getUserSafetyScore(userId);

    switch (action) {
      case 'report_received':
        currentScore.reportsAgainst++;
        currentScore.safetyScore = Math.max(0, currentScore.safetyScore - 10);
        currentScore.lastIncident = new Date();
        break;
      case 'report_resolved':
        currentScore.reportsResolved++;
        // Slight penalty even if resolved
        currentScore.safetyScore = Math.max(0, currentScore.safetyScore - 5);
        break;
      case 'positive_interaction':
        currentScore.safetyScore = Math.min(100, currentScore.safetyScore + 1);
        break;
    }

    // Update trust level based on safety score
    if (currentScore.safetyScore >= 90) {
      currentScore.trustLevel = 'verified';
    } else if (currentScore.safetyScore >= 70) {
      currentScore.trustLevel = 'trusted';
    } else if (currentScore.safetyScore >= 50) {
      currentScore.trustLevel = 'new';
    } else if (currentScore.safetyScore >= 30) {
      currentScore.trustLevel = 'flagged';
    } else {
      currentScore.trustLevel = 'suspended';
    }

    this.userSafetyScores.set(userId, currentScore);
  }

  // Get report statistics
  async getReportStats(): Promise<ReportStats> {
    await this.initialize();

    const totalReports = this.reports.length;
    const pendingReports = this.reports.filter(r => r.status === 'pending').length;
    const resolvedReports = this.reports.filter(r => r.status === 'resolved').length;

    const reportsByType: Record<string, number> = {};
    const reportsByPriority: Record<string, number> = {};

    this.reports.forEach(report => {
      reportsByType[report.type] = (reportsByType[report.type] || 0) + 1;
      reportsByPriority[report.priority] = (reportsByPriority[report.priority] || 0) + 1;
    });

    // Calculate average resolution time
    const resolvedReportsWithTime = this.reports.filter(r => r.resolvedAt && r.createdAt);
    const totalResolutionTime = resolvedReportsWithTime.reduce((sum, report) => {
      const resolutionTime = report.resolvedAt!.getTime() - report.createdAt.getTime();
      return sum + (resolutionTime / (1000 * 60 * 60)); // Convert to hours
    }, 0);
    const averageResolutionTime = resolvedReportsWithTime.length > 0 
      ? totalResolutionTime / resolvedReportsWithTime.length 
      : 0;

    return {
      totalReports,
      pendingReports,
      resolvedReports,
      reportsByType,
      reportsByPriority,
      averageResolutionTime: Math.round(averageResolutionTime * 10) / 10,
    };
  }

  // Check if user is safe to interact with
  async isUserSafeToInteract(userId: string): Promise<boolean> {
    const safetyScore = await this.getUserSafetyScore(userId);
    return safetyScore.trustLevel !== 'suspended' && safetyScore.safetyScore >= 30;
  }

  // Get flagged users
  async getFlaggedUsers(): Promise<UserSafetyScore[]> {
    await this.initialize();

    return Array.from(this.userSafetyScores.values())
      .filter(score => score.trustLevel === 'flagged' || score.trustLevel === 'suspended')
      .sort((a, b) => a.safetyScore - b.safetyScore);
  }

  // Delete a report (admin only)
  async deleteReport(reportId: string): Promise<void> {
    await this.initialize();

    this.reports = this.reports.filter(report => report.id !== reportId);
  }
}

export default ReportAdapter;