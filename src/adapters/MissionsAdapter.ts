import { Mission, ApiResponse } from '../types';
import { generateMockMissions } from '../utils';

class MissionsAdapter {
  private missions: Mission[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    this.missions = generateMockMissions();
  }

  // Get all available missions
  async getAvailableMissions(): Promise<ApiResponse<Mission[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const availableMissions = this.missions.filter(mission => mission.status === 'available');
        resolve({
          success: true,
          data: availableMissions,
          message: 'Available missions fetched successfully'
        });
      }, 400);
    });
  }

  // Get missions by status
  async getMissionsByStatus(status: Mission['status']): Promise<ApiResponse<Mission[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredMissions = this.missions.filter(mission => mission.status === status);
        resolve({
          success: true,
          data: filteredMissions,
          message: `Missions with status ${status} fetched successfully`
        });
      }, 300);
    });
  }

  // Get user's missions (as courier)
  async getUserMissions(userId: string): Promise<ApiResponse<Mission[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userMissions = this.missions.filter(mission => 
          mission.courierId === userId || mission.requesterId === userId
        );
        resolve({
          success: true,
          data: userMissions,
          message: 'User missions fetched successfully'
        });
      }, 350);
    });
  }

  // Accept a mission
  async acceptMission(missionId: string, courierId: string): Promise<ApiResponse<Mission>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const missionIndex = this.missions.findIndex(m => m.id === missionId);
        if (missionIndex === -1) {
          resolve({
            success: false,
            data: {} as Mission,
            message: 'Mission not found'
          });
          return;
        }

        const mission = this.missions[missionIndex];
        if (mission.status !== 'available') {
          resolve({
            success: false,
            data: mission,
            message: 'Mission is no longer available'
          });
          return;
        }

        // Update mission status and assign courier
        this.missions[missionIndex] = {
          ...mission,
          status: 'accepted',
          courierId,
          updatedAt: new Date()
        };

        resolve({
          success: true,
          data: this.missions[missionIndex],
          message: 'Mission accepted successfully'
        });
      }, 600);
    });
  }

  // Start mission (change status to in_progress)
  async startMission(missionId: string, courierId: string): Promise<ApiResponse<Mission>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const missionIndex = this.missions.findIndex(m => m.id === missionId);
        if (missionIndex === -1) {
          resolve({
            success: false,
            data: {} as Mission,
            message: 'Mission not found'
          });
          return;
        }

        const mission = this.missions[missionIndex];
        if (mission.courierId !== courierId) {
          resolve({
            success: false,
            data: mission,
            message: 'Unauthorized to start this mission'
          });
          return;
        }

        if (mission.status !== 'accepted') {
          resolve({
            success: false,
            data: mission,
            message: 'Mission cannot be started'
          });
          return;
        }

        // Update mission status
        this.missions[missionIndex] = {
          ...mission,
          status: 'in_progress',
          updatedAt: new Date()
        };

        resolve({
          success: true,
          data: this.missions[missionIndex],
          message: 'Mission started successfully'
        });
      }, 500);
    });
  }

  // Complete mission
  async completeMission(missionId: string, courierId: string): Promise<ApiResponse<Mission>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const missionIndex = this.missions.findIndex(m => m.id === missionId);
        if (missionIndex === -1) {
          resolve({
            success: false,
            data: {} as Mission,
            message: 'Mission not found'
          });
          return;
        }

        const mission = this.missions[missionIndex];
        if (mission.courierId !== courierId) {
          resolve({
            success: false,
            data: mission,
            message: 'Unauthorized to complete this mission'
          });
          return;
        }

        if (mission.status !== 'in_progress') {
          resolve({
            success: false,
            data: mission,
            message: 'Mission is not in progress'
          });
          return;
        }

        // Update mission status
        this.missions[missionIndex] = {
          ...mission,
          status: 'completed',
          completedAt: new Date(),
          updatedAt: new Date()
        };

        resolve({
          success: true,
          data: this.missions[missionIndex],
          message: 'Mission completed successfully'
        });
      }, 700);
    });
  }

  // Cancel mission
  async cancelMission(missionId: string, userId: string): Promise<ApiResponse<Mission>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const missionIndex = this.missions.findIndex(m => m.id === missionId);
        if (missionIndex === -1) {
          resolve({
            success: false,
            data: {} as Mission,
            message: 'Mission not found'
          });
          return;
        }

        const mission = this.missions[missionIndex];
        if (mission.courierId !== userId && mission.requesterId !== userId) {
          resolve({
            success: false,
            data: mission,
            message: 'Unauthorized to cancel this mission'
          });
          return;
        }

        if (mission.status === 'completed' || mission.status === 'cancelled') {
          resolve({
            success: false,
            data: mission,
            message: 'Mission cannot be cancelled'
          });
          return;
        }

        // Update mission status
        this.missions[missionIndex] = {
          ...mission,
          status: 'cancelled',
          updatedAt: new Date()
        };

        resolve({
          success: true,
          data: this.missions[missionIndex],
          message: 'Mission cancelled successfully'
        });
      }, 500);
    });
  }

  // Create new mission
  async createMission(missionData: Omit<Mission, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'completedAt'>): Promise<ApiResponse<Mission>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMission: Mission = {
          ...missionData,
          id: `mission_${Date.now()}`,
          status: 'available',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        this.missions.push(newMission);

        resolve({
          success: true,
          data: newMission,
          message: 'Mission created successfully'
        });
      }, 600);
    });
  }

  // Get missions near location (mock implementation)
  async getMissionsNearLocation(latitude: number, longitude: number, radiusKm: number = 5): Promise<ApiResponse<Mission[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock implementation - in real app, this would use geolocation
        const nearbyMissions = this.missions.filter(mission => 
          mission.status === 'available' &&
          Math.abs(mission.location.latitude - latitude) < 0.05 &&
          Math.abs(mission.location.longitude - longitude) < 0.05
        );

        resolve({
          success: true,
          data: nearbyMissions,
          message: 'Nearby missions fetched successfully'
        });
      }, 450);
    });
  }

  // Get mission statistics
  async getMissionStats(userId: string): Promise<ApiResponse<{
    total: number;
    completed: number;
    inProgress: number;
    totalEarnings: number;
    averageRating: number;
  }>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userMissions = this.missions.filter(m => m.courierId === userId);
        const completedMissions = userMissions.filter(m => m.status === 'completed');
        const inProgressMissions = userMissions.filter(m => m.status === 'in_progress');
        const totalEarnings = completedMissions.reduce((sum, m) => sum + m.reward, 0);

        resolve({
          success: true,
          data: {
            total: userMissions.length,
            completed: completedMissions.length,
            inProgress: inProgressMissions.length,
            totalEarnings,
            averageRating: 4.7 // Mock rating
          },
          message: 'Mission statistics fetched successfully'
        });
      }, 400);
    });
  }
}

export default new MissionsAdapter();