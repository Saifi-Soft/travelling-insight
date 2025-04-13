
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
  status?: 'active' | 'blocked' | 'pending';
  joinDate?: Date;
}

export interface CommunityUser extends CommunityProfile {
  id: string;
  status: 'active' | 'blocked' | 'pending';
  joinDate: Date;
}

export interface TravelGroup {
  id: string;
  name: string;
  description?: string;
  category: string;
  members: string[];
  memberCount: number;
  owner: string;
  dateCreated: Date;
  status: 'active' | 'archived';
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: string;
  host: string;
  date: Date;
  location: {
    type: 'online' | 'physical';
    details: string;
  };
  attendees: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'canceled';
  createdAt: Date;
}

export interface TravelMatch {
  userId: string;
  name: string;
  avatar?: string;
  destinations: string[];
  travelStyles: string[];
  interests: string[];
  compatibilityScore: number;
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

export const communityApi = new CommunityApiService();

// Community Users API
export const communityUsersApi = {
  getAll: async (): Promise<CommunityUser[]> => {
    try {
      return await mongoApiService.queryDocuments('communityUsers', {}) as CommunityUser[];
    } catch (error) {
      console.error('Error fetching all community users:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<CommunityUser | null> => {
    try {
      return await mongoApiService.getDocumentById('communityUsers', id) as CommunityUser | null;
    } catch (error) {
      console.error(`Error fetching community user with ID ${id}:`, error);
      return null;
    }
  },
  
  create: async (user: Omit<CommunityUser, 'id'>): Promise<CommunityUser> => {
    try {
      return await mongoApiService.insertDocument('communityUsers', user) as CommunityUser;
    } catch (error) {
      console.error('Error creating community user:', error);
      throw error;
    }
  },
  
  update: async (id: string, user: Partial<CommunityUser>): Promise<CommunityUser | null> => {
    try {
      return await mongoApiService.updateDocument('communityUsers', id, user) as CommunityUser | null;
    } catch (error) {
      console.error(`Error updating community user with ID ${id}:`, error);
      throw error;
    }
  },
  
  updateStatus: async (id: string, status: 'active' | 'blocked' | 'pending'): Promise<CommunityUser | null> => {
    try {
      return await mongoApiService.updateDocument('communityUsers', id, { status }) as CommunityUser | null;
    } catch (error) {
      console.error(`Error updating status for community user with ID ${id}:`, error);
      throw error;
    }
  }
};

// Travel Groups API
export const travelGroupsApi = {
  getAll: async (): Promise<TravelGroup[]> => {
    try {
      return await mongoApiService.queryDocuments('travelGroups', {}) as TravelGroup[];
    } catch (error) {
      console.error('Error fetching all travel groups:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<TravelGroup | null> => {
    try {
      return await mongoApiService.getDocumentById('travelGroups', id) as TravelGroup | null;
    } catch (error) {
      console.error(`Error fetching travel group with ID ${id}:`, error);
      return null;
    }
  },
  
  create: async (group: Omit<TravelGroup, 'id'>): Promise<TravelGroup> => {
    try {
      return await mongoApiService.insertDocument('travelGroups', group) as TravelGroup;
    } catch (error) {
      console.error('Error creating travel group:', error);
      throw error;
    }
  },
  
  update: async (id: string, group: Partial<TravelGroup>): Promise<TravelGroup | null> => {
    try {
      return await mongoApiService.updateDocument('travelGroups', id, group) as TravelGroup | null;
    } catch (error) {
      console.error(`Error updating travel group with ID ${id}:`, error);
      throw error;
    }
  }
};

// Travel Matches API
export const travelMatchesApi = {
  findPotentialMatches: async (userId: string, preferences: any): Promise<TravelMatch[]> => {
    try {
      // In a real app, this would query a database based on the user's preferences
      // For this mock, we'll just return a few random matches
      const mockMatches: TravelMatch[] = [
        {
          userId: 'user1',
          name: 'Alex Morgan',
          avatar: 'https://i.pravatar.cc/150?img=1',
          destinations: ['Japan', 'Thailand', 'Italy'],
          travelStyles: ['Adventure', 'Cultural'],
          interests: ['Photography', 'Hiking', 'Food'],
          compatibilityScore: 85
        },
        {
          userId: 'user2',
          name: 'Sam Cooper',
          avatar: 'https://i.pravatar.cc/150?img=2',
          destinations: ['France', 'Spain', 'Italy'],
          travelStyles: ['Luxury', 'Cultural'],
          interests: ['Wine Tasting', 'Museums', 'History'],
          compatibilityScore: 72
        },
        {
          userId: 'user3',
          name: 'Jamie Lee',
          avatar: 'https://i.pravatar.cc/150?img=3',
          destinations: ['Thailand', 'Vietnam', 'Cambodia'],
          travelStyles: ['Budget', 'Backpacking'],
          interests: ['Street Food', 'Nature', 'Photography'],
          compatibilityScore: 68
        }
      ];
      
      return mockMatches;
    } catch (error) {
      console.error('Error finding potential matches:', error);
      return [];
    }
  }
};

// Community Events API
export const communityEventsApi = {
  getAll: async (): Promise<CommunityEvent[]> => {
    try {
      return await mongoApiService.queryDocuments('communityEvents', {}) as CommunityEvent[];
    } catch (error) {
      console.error('Error fetching all community events:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<CommunityEvent | null> => {
    try {
      return await mongoApiService.getDocumentById('communityEvents', id) as CommunityEvent | null;
    } catch (error) {
      console.error(`Error fetching community event with ID ${id}:`, error);
      return null;
    }
  },
  
  create: async (event: Omit<CommunityEvent, 'id'>): Promise<CommunityEvent> => {
    try {
      return await mongoApiService.insertDocument('communityEvents', event) as CommunityEvent;
    } catch (error) {
      console.error('Error creating community event:', error);
      throw error;
    }
  },
  
  update: async (id: string, event: Partial<CommunityEvent>): Promise<CommunityEvent | null> => {
    try {
      return await mongoApiService.updateDocument('communityEvents', id, event) as CommunityEvent | null;
    } catch (error) {
      console.error(`Error updating community event with ID ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      return await mongoApiService.deleteDocument('communityEvents', id);
    } catch (error) {
      console.error(`Error deleting community event with ID ${id}:`, error);
      throw error;
    }
  }
};

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
