
// This is a mock API service for community-related operations
import { toast } from 'sonner';
import { mongoApiService } from './mongoApiService';

export interface CommunityProfile {
  id?: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  experienceLevel: string;
  travelStyles: string[];
  interests: string[];
}

export interface SubscriptionData {
  userId: string;
  planType: 'monthly' | 'annual';
  status: 'active' | 'canceled' | 'expired';
  paymentMethod: {
    method: string;
    cardLastFour?: string;
    expiryDate?: string;
  };
  startDate: Date;
  endDate: Date;
  amount: number;
  autoRenew: boolean;
  canceledAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

class CommunityApiService {
  // Create a new community profile
  async createProfile(profileData: CommunityProfile): Promise<CommunityProfile> {
    try {
      const newProfile = await mongoApiService.insertDocument('communityUsers', profileData);
      localStorage.setItem('community_user_id', newProfile.id || '');
      return newProfile;
    } catch (error) {
      console.error('Error creating community profile:', error);
      throw error;
    }
  }
  
  // Get a community profile by ID
  async getProfileById(id: string): Promise<CommunityProfile | null> {
    try {
      return await mongoApiService.getDocumentById('communityUsers', id);
    } catch (error) {
      console.error('Error fetching community profile:', error);
      return null;
    }
  }
  
  // Update a community profile
  async updateProfile(id: string, profileData: Partial<CommunityProfile>): Promise<CommunityProfile | null> {
    try {
      return await mongoApiService.updateDocument('communityUsers', id, profileData);
    } catch (error) {
      console.error('Error updating community profile:', error);
      return null;
    }
  }
  
  // Create a new subscription
  async createSubscription(userId: string, planType: 'monthly' | 'annual', subscriptionData: Partial<SubscriptionData>): Promise<SubscriptionData> {
    try {
      const fullSubscriptionData = {
        userId,
        planType,
        ...subscriptionData
      };
      
      const newSubscription = await mongoApiService.insertDocument('subscriptions', fullSubscriptionData);
      return newSubscription as SubscriptionData;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }
  
  // Get subscription by user ID
  async getSubscriptionByUserId(userId: string): Promise<SubscriptionData | null> {
    try {
      const subscriptions = await mongoApiService.queryDocuments('subscriptions', { userId, status: 'active' });
      return subscriptions.length > 0 ? subscriptions[0] as SubscriptionData : null;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  }
  
  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<SubscriptionData | null> {
    try {
      const now = new Date();
      return await mongoApiService.updateDocument('subscriptions', subscriptionId, {
        status: 'canceled',
        canceledAt: now,
        updatedAt: now
      });
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return null;
    }
  }
}

export const communityPaymentApi = {
  // Create a subscription
  createSubscription: async (
    userId: string, 
    planType: 'monthly' | 'annual',
    subscriptionData: Partial<SubscriptionData>
  ): Promise<SubscriptionData> => {
    try {
      const api = new CommunityApiService();
      return await api.createSubscription(userId, planType, subscriptionData);
    } catch (error) {
      toast.error('Failed to create subscription');
      throw error;
    }
  },

  // Get subscription for a user
  getSubscription: async (userId: string): Promise<SubscriptionData | null> => {
    try {
      const api = new CommunityApiService();
      return await api.getSubscriptionByUserId(userId);
    } catch (error) {
      toast.error('Failed to fetch subscription');
      return null;
    }
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId: string): Promise<boolean> => {
    try {
      const api = new CommunityApiService();
      const result = await api.cancelSubscription(subscriptionId);
      return result !== null;
    } catch (error) {
      toast.error('Failed to cancel subscription');
      return false;
    }
  }
};

export const communityApi = new CommunityApiService();
