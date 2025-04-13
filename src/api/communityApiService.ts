import { mongoApiService } from './mongoApiService';
import { CommunityUser, TravelGroup, CommunityEvent, TravelMatch } from '@/types/common';

// Define community user API
export const communityUsersApi = {
  getAll: async (): Promise<CommunityUser[]> => {
    try {
      return await mongoApiService.queryDocuments('communityUsers', {});
    } catch (error) {
      console.error('Error fetching all community users:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<CommunityUser | null> => {
    try {
      return await mongoApiService.getDocumentById('communityUsers', id);
    } catch (error) {
      console.error(`Error fetching community user with ID ${id}:`, error);
      return null;
    }
  },
  
  create: async (user: Omit<CommunityUser, 'id'>): Promise<CommunityUser> => {
    try {
      return await mongoApiService.insertDocument('communityUsers', user);
    } catch (error) {
      console.error('Error creating community user:', error);
      throw error;
    }
  },
  
  update: async (id: string, user: Partial<CommunityUser>): Promise<CommunityUser | null> => {
    try {
      return await mongoApiService.updateDocument('communityUsers', id, user);
    } catch (error) {
      console.error(`Error updating community user with ID ${id}:`, error);
      throw error;
    }
  },
  
  updateStatus: async (id: string, status: 'active' | 'blocked' | 'pending'): Promise<CommunityUser | null> => {
    try {
      return await mongoApiService.updateDocument('communityUsers', id, { status });
    } catch (error) {
      console.error(`Error updating user status with ID ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      return await mongoApiService.deleteDocument('communityUsers', id);
    } catch (error) {
      console.error(`Error deleting community user with ID ${id}:`, error);
      throw error;
    }
  }
};

// Define travel groups API
export const travelGroupsApi = {
  getAll: async (): Promise<TravelGroup[]> => {
    try {
      return await mongoApiService.queryDocuments('travelGroups', {});
    } catch (error) {
      console.error('Error fetching all travel groups:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<TravelGroup | null> => {
    try {
      return await mongoApiService.getDocumentById('travelGroups', id);
    } catch (error) {
      console.error(`Error fetching travel group with ID ${id}:`, error);
      return null;
    }
  },
  
  create: async (group: Omit<TravelGroup, 'id'>): Promise<TravelGroup> => {
    try {
      return await mongoApiService.insertDocument('travelGroups', group);
    } catch (error) {
      console.error('Error creating travel group:', error);
      throw error;
    }
  },
  
  update: async (id: string, group: Partial<TravelGroup>): Promise<TravelGroup | null> => {
    try {
      return await mongoApiService.updateDocument('travelGroups', id, group);
    } catch (error) {
      console.error(`Error updating travel group with ID ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      return await mongoApiService.deleteDocument('travelGroups', id);
    } catch (error) {
      console.error(`Error deleting travel group with ID ${id}:`, error);
      throw error;
    }
  }
};

// Define community events API
export const communityEventsApi = {
  getAll: async (): Promise<CommunityEvent[]> => {
    try {
      return await mongoApiService.queryDocuments('communityEvents', {});
    } catch (error) {
      console.error('Error fetching all community events:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<CommunityEvent | null> => {
    try {
      return await mongoApiService.getDocumentById('communityEvents', id);
    } catch (error) {
      console.error(`Error fetching community event with ID ${id}:`, error);
      return null;
    }
  },
  
  create: async (event: Omit<CommunityEvent, 'id'>): Promise<CommunityEvent> => {
    try {
      return await mongoApiService.insertDocument('communityEvents', event);
    } catch (error) {
      console.error('Error creating community event:', error);
      throw error;
    }
  },
  
  update: async (id: string, event: Partial<CommunityEvent>): Promise<CommunityEvent | null> => {
    try {
      return await mongoApiService.updateDocument('communityEvents', id, event);
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

// Define travel matches API
export const travelMatchesApi = {
  findPotentialMatches: async (userId: string, preferences: any): Promise<TravelMatch[]> => {
    try {
      // In a real app, this would use a sophisticated matching algorithm
      const allUsers = await mongoApiService.queryDocuments('communityUsers', {
        id: { $ne: userId } // Exclude the current user
      });
      
      // Convert users to matches with compatibility scores
      const potentialMatches: TravelMatch[] = allUsers.map((user: CommunityUser) => ({
        userId: user.id,
        name: user.name,
        avatar: user.avatar,
        compatibilityScore: Math.floor(Math.random() * 100), // Simplified scoring
        destinations: user.interests.filter(interest => 
          preferences.destinations.some((dest: string) => interest.toLowerCase().includes(dest.toLowerCase()))
        ),
        travelStyles: user.travelStyles || [],
        interests: user.interests || []
      }));
      
      return potentialMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    } catch (error) {
      console.error('Error finding potential matches:', error);
      return [];
    }
  }
};

// Define community payment API
export const communityPaymentApi = {
  getSubscription: async (userId: string) => {
    try {
      return await mongoApiService.getSubscriptionByUserId(userId);
    } catch (error) {
      console.error(`Error getting subscription for user ${userId}:`, error);
      return null;
    }
  },

  createSubscription: async (userId: string, plan: 'monthly' | 'annual', subscriptionDetails: any) => {
    try {
      const subscription = {
        userId,
        plan,
        ...subscriptionDetails,
        createdAt: new Date()
      };
      return await mongoApiService.insertDocument('subscriptions', subscription);
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  },

  cancelSubscription: async (subscriptionId: string) => {
    try {
      return await mongoApiService.updateDocument('subscriptions', subscriptionId, { 
        status: 'cancelled',
        cancelledAt: new Date()
      });
    } catch (error) {
      console.error(`Error cancelling subscription ${subscriptionId}:`, error);
      throw error;
    }
  }
};

// Combined community API for convenience
export const communityApi = {
  users: communityUsersApi,
  groups: travelGroupsApi,
  events: communityEventsApi,
  matches: travelMatchesApi,
  payments: communityPaymentApi
};
