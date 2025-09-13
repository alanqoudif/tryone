// Rating interfaces
export interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
  missionId: string;
  rating: number; // 1-5 stars
  comment?: string;
  type: 'student_to_courier' | 'courier_to_student';
  createdAt: Date;
  updatedAt: Date;
}

export interface RatingStats {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recentRatings: Rating[];
}

export interface CreateRatingRequest {
  toUserId: string;
  missionId: string;
  rating: number;
  comment?: string;
  type: 'student_to_courier' | 'courier_to_student';
}

class RatingAdapter {
  private static instance: RatingAdapter;
  private ratings: Rating[] = [];
  private initialized = false;

  private constructor() {}

  static getInstance(): RatingAdapter {
    if (!RatingAdapter.instance) {
      RatingAdapter.instance = new RatingAdapter();
    }
    return RatingAdapter.instance;
  }

  private async initialize(): Promise<void> {
    if (this.initialized) return;

    // Initialize with mock data
    await this.initializeMockData();
    this.initialized = true;
  }

  private async initializeMockData(): Promise<void> {
    const mockRatings: Rating[] = [
      {
        id: '1',
        fromUserId: 'user1',
        toUserId: 'courier1',
        missionId: 'mission1',
        rating: 5,
        comment: 'خدمة ممتازة وسريعة',
        type: 'student_to_courier',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        fromUserId: 'courier1',
        toUserId: 'user1',
        missionId: 'mission1',
        rating: 4,
        comment: 'طالب متعاون ومهذب',
        type: 'courier_to_student',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '3',
        fromUserId: 'user2',
        toUserId: 'courier2',
        missionId: 'mission2',
        rating: 4,
        comment: 'جيد جداً',
        type: 'student_to_courier',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16'),
      },
    ];

    this.ratings = mockRatings;
    await this.saveRatings();
  }

  private async saveRatings(): Promise<void> {
    // In a real app, this would save to persistent storage
    // For now, data is stored in memory
  }

  // Create a new rating
  async createRating(fromUserId: string, request: CreateRatingRequest): Promise<Rating> {
    await this.initialize();

    // Check if rating already exists for this mission
    const existingRating = this.ratings.find(
      rating => rating.fromUserId === fromUserId && 
                rating.toUserId === request.toUserId && 
                rating.missionId === request.missionId &&
                rating.type === request.type
    );

    if (existingRating) {
      throw new Error('تم تقييم هذه المهمة مسبقاً');
    }

    const newRating: Rating = {
      id: Date.now().toString(),
      fromUserId,
      ...request,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.ratings.push(newRating);
    await this.saveRatings();

    return newRating;
  }

  // Get ratings for a specific user
  async getUserRatings(userId: string, type?: 'received' | 'given'): Promise<Rating[]> {
    await this.initialize();

    let userRatings = this.ratings;

    if (type === 'received') {
      userRatings = userRatings.filter(rating => rating.toUserId === userId);
    } else if (type === 'given') {
      userRatings = userRatings.filter(rating => rating.fromUserId === userId);
    } else {
      userRatings = userRatings.filter(
        rating => rating.toUserId === userId || rating.fromUserId === userId
      );
    }

    return userRatings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Get rating statistics for a user
  async getUserRatingStats(userId: string): Promise<RatingStats> {
    await this.initialize();

    const receivedRatings = this.ratings.filter(rating => rating.toUserId === userId);
    
    if (receivedRatings.length === 0) {
      return {
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        recentRatings: [],
      };
    }

    const totalRating = receivedRatings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRating / receivedRatings.length;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    receivedRatings.forEach(rating => {
      ratingDistribution[rating.rating as keyof typeof ratingDistribution]++;
    });

    const recentRatings = receivedRatings
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: receivedRatings.length,
      ratingDistribution,
      recentRatings,
    };
  }

  // Get ratings for a specific mission
  async getMissionRatings(missionId: string): Promise<Rating[]> {
    await this.initialize();

    return this.ratings
      .filter(rating => rating.missionId === missionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Check if user can rate another user for a mission
  async canRate(fromUserId: string, toUserId: string, missionId: string, type: 'student_to_courier' | 'courier_to_student'): Promise<boolean> {
    await this.initialize();

    const existingRating = this.ratings.find(
      rating => rating.fromUserId === fromUserId && 
                rating.toUserId === toUserId && 
                rating.missionId === missionId &&
                rating.type === type
    );

    return !existingRating;
  }

  // Update a rating
  async updateRating(ratingId: string, updates: Partial<Pick<Rating, 'rating' | 'comment'>>): Promise<Rating> {
    await this.initialize();

    const ratingIndex = this.ratings.findIndex(rating => rating.id === ratingId);
    if (ratingIndex === -1) {
      throw new Error('التقييم غير موجود');
    }

    this.ratings[ratingIndex] = {
      ...this.ratings[ratingIndex],
      ...updates,
      updatedAt: new Date(),
    };

    await this.saveRatings();
    return this.ratings[ratingIndex];
  }

  // Delete a rating
  async deleteRating(ratingId: string): Promise<void> {
    await this.initialize();

    this.ratings = this.ratings.filter(rating => rating.id !== ratingId);
    await this.saveRatings();
  }

  // Get top rated users
  async getTopRatedUsers(limit: number = 10): Promise<Array<{ userId: string; averageRating: number; totalRatings: number }>> {
    await this.initialize();

    const userRatings = new Map<string, { total: number; count: number }>();

    this.ratings.forEach(rating => {
      if (!userRatings.has(rating.toUserId)) {
        userRatings.set(rating.toUserId, { total: 0, count: 0 });
      }
      const userRating = userRatings.get(rating.toUserId)!;
      userRating.total += rating.rating;
      userRating.count += 1;
    });

    const topUsers = Array.from(userRatings.entries())
      .map(([userId, { total, count }]) => ({
        userId,
        averageRating: Math.round((total / count) * 10) / 10,
        totalRatings: count,
      }))
      .filter(user => user.totalRatings >= 3) // Minimum 3 ratings
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, limit);

    return topUsers;
  }
}

export default RatingAdapter;