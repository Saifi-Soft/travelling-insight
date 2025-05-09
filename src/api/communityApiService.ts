
// API service for community-related operations
import { mongoApiService } from './mongoApiService';
import { toast } from 'sonner';

// Mock data for subscriptions
const mockSubscriptions = [
  {
    userId: "user1",
    planType: "monthly",
    status: "active",
    paymentMethod: {
      method: "credit_card",
      cardLastFour: "1234",
      expiryDate: "12/25"
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    amount: 9.99,
    autoRenew: true
  }
];

// Mock data for users
const mockUsers = [
  {
    id: "user1",
    name: "Demo User",
    email: "demo@example.com",
    avatar: "",
    bio: "Travel enthusiast",
    location: "New York",
    travelStyles: ["adventure", "budget"],
    visitedCountries: ["USA", "Canada", "Japan"],
    connections: ["user2", "user3"],
    trips: ["trip1", "trip2"],
    createdAt: new Date().toISOString()
  }
];

// Add payment API methods
const payments = {
  getSubscription: async (userId: string) => {
    try {
      // Check if subscription exists in MongoDB
      const subscriptions = await mongoApiService.queryDocuments('subscriptions', { userId });
      
      if (subscriptions && subscriptions.length > 0) {
        return subscriptions[0];
      } else {
        // Return mock data for demo purposes
        const mockSubscription = mockSubscriptions.find(sub => sub.userId === userId);
        return mockSubscription || null;
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  },

  createSubscription: async (userId: string, planType: string, subscriptionData: any) => {
    try {
      const subscription = {
        userId,
        planType,
        ...subscriptionData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return await mongoApiService.insertDocument('subscriptions', subscription);
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }
};

// Add users API methods
const users = {
  getById: async (userId: string) => {
    try {
      // Check if user exists in MongoDB
      const user = await mongoApiService.getDocumentById('communityUsers', userId);
      
      if (user) {
        return user;
      } else {
        // Return mock data for demo purposes
        return mockUsers.find(user => user.id === userId) || null;
      }
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      return null;
    }
  },

  update: async (userId: string, userData: any) => {
    try {
      return await mongoApiService.updateDocument('communityUsers', userId, {
        ...userData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  create: async (userData: any) => {
    try {
      const newUser = {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return await mongoApiService.insertDocument('communityUsers', newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
};

// Add travel matches API
const matches = {
  findMatches: async (userId: string, criteria: any = {}) => {
    try {
      // In a real app, this would query the database based on matching algorithms
      // For demo, return some mock matches
      return [
        {
          userId: "match1",
          name: "Alex Johnson",
          location: "San Francisco",
          compatibilityScore: 92,
          travelStyles: ["adventure", "luxury"],
          commonDestinations: ["Japan", "Italy"]
        },
        {
          userId: "match2",
          name: "Jamie Smith",
          location: "London",
          compatibilityScore: 85,
          travelStyles: ["budget", "cultural"],
          commonDestinations: ["Thailand", "Spain"]
        }
      ];
    } catch (error) {
      console.error('Error finding matches:', error);
      return [];
    }
  }
};

// Export the community API
export const communityApi = {
  events: {
    getAll: async () => {
      try {
        // Initial demo data for community events
        const demoEvents = [
          {
            title: "Annual Backpackers Meetup",
            description: "Join fellow backpackers for our annual gathering to share stories, tips, and make plans for future adventures.",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            location: { type: "in-person", details: "Central Park, New York City" },
            status: "upcoming",
            attendees: [
              { id: "user1", name: "Alex Johnson" },
              { id: "user2", name: "Sam Peterson" }
            ],
            organizer: { id: "admin1", name: "Travel Community Admin" },
            createdAt: new Date().toISOString()
          },
          {
            title: "Virtual Travel Photography Workshop",
            description: "Learn travel photography techniques from professional photographers in this interactive online workshop.",
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            location: { type: "online", details: "Zoom Meeting" },
            status: "upcoming",
            attendees: [
              { id: "user3", name: "Jamie Smith" },
              { id: "user4", name: "Robin Williams" },
              { id: "user5", name: "Taylor Johnson" }
            ],
            organizer: { id: "photo1", name: "PhotoTravelPro" },
            createdAt: new Date().toISOString()
          },
          {
            title: "Southeast Asia Travel Planning Session",
            description: "Group session for travelers planning trips to Southeast Asia in the coming year. Share itineraries and connect with other travelers.",
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            location: { type: "online", details: "Google Meet" },
            status: "upcoming",
            attendees: [
              { id: "user6", name: "Jordan Lee" }
            ],
            organizer: { id: "user7", name: "Asia Travel Expert" },
            createdAt: new Date().toISOString()
          }
        ];
        
        // Store demo events if not exist
        const existingEvents = await mongoApiService.queryDocuments('communityEvents', {});
        if (existingEvents.length === 0) {
          for (const event of demoEvents) {
            await mongoApiService.insertDocument('communityEvents', event);
          }
          return demoEvents;
        }
        
        return existingEvents;
      } catch (error) {
        console.error('Error fetching community events:', error);
        return [];
      }
    },
    
    createEvent: async (eventData: any) => {
      try {
        return await mongoApiService.insertDocument('communityEvents', eventData);
      } catch (error) {
        console.error('Error creating community event:', error);
        throw error;
      }
    },
    
    attendEvent: async (eventId: string, attendee: { id: string, name: string }) => {
      try {
        const event = await mongoApiService.getDocumentById('communityEvents', eventId);
        if (!event) throw new Error('Event not found');
        
        const attendees = event.attendees || [];
        const alreadyAttending = attendees.some((a: any) => a.id === attendee.id);
        
        if (alreadyAttending) return event;
        
        const updatedAttendees = [...attendees, attendee];
        return await mongoApiService.updateDocument('communityEvents', eventId, {
          attendees: updatedAttendees
        });
      } catch (error) {
        console.error('Error attending event:', error);
        throw error;
      }
    }
  },

  // Add exports for additional APIs
  payments,
  users,
  matches
};

// Create separate exports for subscription modal and other components
export const communityPaymentApi = payments;
export const communityUsersApi = users;
export const travelMatchesApi = matches;
export const communityEventsApi = communityApi.events;
export const travelGroupsApi = {
  getAllGroups: async () => {
    try {
      const groups = await mongoApiService.queryDocuments('travelGroups', {});
      return groups;
    } catch (error) {
      console.error('Error fetching travel groups:', error);
      return [];
    }
  },
  
  createGroup: async (groupData: any) => {
    try {
      return await mongoApiService.insertDocument('travelGroups', groupData);
    } catch (error) {
      console.error('Error creating travel group:', error);
      throw error;
    }
  }
};
