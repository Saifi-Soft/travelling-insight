
import { connectToDatabase, formatMongoData, COLLECTIONS } from './mongodb';
import { 
  CommunityUser,
  TravelGroup,
  CommunityEvent,
  TravelMatch 
} from '@/types/common';

// Community users API
export const communityUsersApi = {
  getAll: async (): Promise<CommunityUser[]> => {
    try {
      const { collections } = await connectToDatabase();
      const users = await collections[COLLECTIONS.COMMUNITY_USERS].find().toArray();
      return formatMongoData(users);
    } catch (error) {
      console.error('Error fetching community users:', error);
      throw error;
    }
  },
  
  getById: async (id: string): Promise<CommunityUser> => {
    try {
      const { collections } = await connectToDatabase();
      const user = await collections[COLLECTIONS.COMMUNITY_USERS].findOne({ _id: id });
      if (!user) throw new Error('User not found');
      return formatMongoData(user);
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },
  
  getByStatus: async (status: string): Promise<CommunityUser[]> => {
    try {
      const { collections } = await connectToDatabase();
      const users = await collections[COLLECTIONS.COMMUNITY_USERS].find({ status }).toArray();
      return formatMongoData(users);
    } catch (error) {
      console.error(`Error fetching users with status ${status}:`, error);
      throw error;
    }
  },
  
  create: async (user: Omit<CommunityUser, 'id'>): Promise<CommunityUser> => {
    try {
      const { collections } = await connectToDatabase();
      
      // Generate username if not provided
      if (!user.username && user.email) {
        user.username = user.email.split('@')[0] + Math.floor(Math.random() * 1000);
      }
      
      const result = await collections.community_users.insertOne({
        ...user,
        joinDate: user.joinDate || new Date(),
        status: user.status || 'pending',
        reputation: user.reputation || 0
      });
      
      const newUser = { ...user, id: result.insertedId.toString() };
      return newUser;
    } catch (error) {
      console.error('Error creating community user:', error);
      throw error;
    }
  },
  
  update: async (id: string, user: Partial<CommunityUser>): Promise<CommunityUser> => {
    try {
      const { collections } = await connectToDatabase();
      
      await collections.community_users.updateOne(
        { _id: id },
        { $set: user }
      );
      
      const updatedUser = await collections.community_users.findOne({ _id: id });
      if (!updatedUser) throw new Error('User not found after update');
      return formatMongoData(updatedUser);
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },
  
  updateStatus: async (id: string, status: 'pending' | 'active' | 'blocked'): Promise<CommunityUser> => {
    try {
      const { collections } = await connectToDatabase();
      
      await collections.community_users.updateOne(
        { _id: id },
        { $set: { status, lastActive: new Date() } }
      );
      
      const updatedUser = await collections.community_users.findOne({ _id: id });
      if (!updatedUser) throw new Error('User not found after status update');
      return formatMongoData(updatedUser);
    } catch (error) {
      console.error(`Error updating user status ${id}:`, error);
      throw error;
    }
  },
  
  addBadge: async (userId: string, badge: { name: string, description: string, icon: string }): Promise<CommunityUser> => {
    try {
      const { collections } = await connectToDatabase();
      
      const newBadge = {
        ...badge,
        dateEarned: new Date()
      };
      
      await collections.community_users.updateOne(
        { _id: userId },
        { $push: { badges: newBadge } }
      );
      
      const updatedUser = await collections.community_users.findOne({ _id: userId });
      if (!updatedUser) throw new Error('User not found after adding badge');
      return formatMongoData(updatedUser);
    } catch (error) {
      console.error(`Error adding badge to user ${userId}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    try {
      const { collections } = await connectToDatabase();
      
      // Check if user exists
      const user = await collections.community_users.findOne({ _id: id });
      if (!user) {
        throw new Error('User not found');
      }
      
      // Delete the user
      const result = await collections.community_users.deleteOne({ _id: id });
      
      if (result.deletedCount === 0) {
        throw new Error('User not found');
      }
      
      return { success: true };
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
};

// Travel groups API
export const travelGroupsApi = {
  getAll: async (): Promise<TravelGroup[]> => {
    try {
      const { collections } = await connectToDatabase();
      const groups = await collections[COLLECTIONS.TRAVEL_GROUPS].find().toArray();
      return formatMongoData(groups);
    } catch (error) {
      console.error('Error fetching travel groups:', error);
      throw error;
    }
  },
  
  getById: async (id: string): Promise<TravelGroup> => {
    try {
      const { collections } = await connectToDatabase();
      const group = await collections[COLLECTIONS.TRAVEL_GROUPS].findOne({ _id: id });
      if (!group) throw new Error('Group not found');
      return formatMongoData(group);
    } catch (error) {
      console.error(`Error fetching group ${id}:`, error);
      throw error;
    }
  },
  
  getByCategory: async (category: string): Promise<TravelGroup[]> => {
    try {
      const { collections } = await connectToDatabase();
      const groups = await collections[COLLECTIONS.TRAVEL_GROUPS].find({ category }).toArray();
      return formatMongoData(groups);
    } catch (error) {
      console.error(`Error fetching groups for category ${category}:`, error);
      throw error;
    }
  },
  
  create: async (group: Omit<TravelGroup, 'id'>): Promise<TravelGroup> => {
    try {
      const { collections } = await connectToDatabase();
      
      // Generate slug if not provided
      if (!group.slug && group.name) {
        group.slug = group.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      
      const result = await collections.travel_groups.insertOne({
        ...group,
        dateCreated: group.dateCreated || new Date(),
        status: group.status || 'active',
        memberCount: group.members?.length || 0
      });
      
      const newGroup = { ...group, id: result.insertedId.toString() };
      return newGroup;
    } catch (error) {
      console.error('Error creating travel group:', error);
      throw error;
    }
  },
  
  update: async (id: string, group: Partial<TravelGroup>): Promise<TravelGroup> => {
    try {
      const { collections } = await connectToDatabase();
      
      await collections.travel_groups.updateOne(
        { _id: id },
        { $set: group }
      );
      
      const updatedGroup = await collections.travel_groups.findOne({ _id: id });
      if (!updatedGroup) throw new Error('Group not found after update');
      return formatMongoData(updatedGroup);
    } catch (error) {
      console.error(`Error updating group ${id}:`, error);
      throw error;
    }
  },
  
  addMember: async (groupId: string, userId: string): Promise<TravelGroup> => {
    try {
      const { collections } = await connectToDatabase();
      
      // Check if user is already a member
      const group = await collections.travel_groups.findOne({ _id: groupId });
      if (!group) throw new Error('Group not found');
      
      if (group.members.includes(userId)) {
        throw new Error('User is already a member of this group');
      }
      
      await collections.travel_groups.updateOne(
        { _id: groupId },
        { 
          $push: { members: userId },
          $inc: { memberCount: 1 }
        }
      );
      
      const updatedGroup = await collections.travel_groups.findOne({ _id: groupId });
      if (!updatedGroup) throw new Error('Group not found after adding member');
      return formatMongoData(updatedGroup);
    } catch (error) {
      console.error(`Error adding member to group ${groupId}:`, error);
      throw error;
    }
  },
  
  removeMember: async (groupId: string, userId: string): Promise<TravelGroup> => {
    try {
      const { collections } = await connectToDatabase();
      
      await collections.travel_groups.updateOne(
        { _id: groupId },
        { 
          $pull: { members: userId },
          $inc: { memberCount: -1 }
        }
      );
      
      const updatedGroup = await collections.travel_groups.findOne({ _id: groupId });
      if (!updatedGroup) throw new Error('Group not found after removing member');
      return formatMongoData(updatedGroup);
    } catch (error) {
      console.error(`Error removing member from group ${groupId}:`, error);
      throw error;
    }
  }
};

// Community events API
export const communityEventsApi = {
  getAll: async (): Promise<CommunityEvent[]> => {
    try {
      const { collections } = await connectToDatabase();
      const events = await collections[COLLECTIONS.COMMUNITY_EVENTS].find().toArray();
      return formatMongoData(events);
    } catch (error) {
      console.error('Error fetching community events:', error);
      throw error;
    }
  },
  
  getById: async (id: string): Promise<CommunityEvent> => {
    try {
      const { collections } = await connectToDatabase();
      const event = await collections[COLLECTIONS.COMMUNITY_EVENTS].findOne({ _id: id });
      if (!event) throw new Error('Event not found');
      return formatMongoData(event);
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw error;
    }
  },
  
  getByStatus: async (status: string): Promise<CommunityEvent[]> => {
    try {
      const { collections } = await connectToDatabase();
      const events = await collections[COLLECTIONS.COMMUNITY_EVENTS].find({ status }).toArray();
      return formatMongoData(events);
    } catch (error) {
      console.error(`Error fetching events with status ${status}:`, error);
      throw error;
    }
  },
  
  create: async (event: Omit<CommunityEvent, 'id'>): Promise<CommunityEvent> => {
    try {
      const { collections } = await connectToDatabase();
      
      const result = await collections.community_events.insertOne({
        ...event,
        createdAt: event.createdAt || new Date()
      });
      
      const newEvent = { ...event, id: result.insertedId.toString() };
      return newEvent;
    } catch (error) {
      console.error('Error creating community event:', error);
      throw error;
    }
  },
  
  update: async (id: string, event: Partial<CommunityEvent>): Promise<CommunityEvent> => {
    try {
      const { collections } = await connectToDatabase();
      
      await collections.community_events.updateOne(
        { _id: id },
        { $set: event }
      );
      
      const updatedEvent = await collections.community_events.findOne({ _id: id });
      if (!updatedEvent) throw new Error('Event not found after update');
      return formatMongoData(updatedEvent);
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      throw error;
    }
  },
  
  addAttendee: async (eventId: string, userId: string): Promise<CommunityEvent> => {
    try {
      const { collections } = await connectToDatabase();
      
      // Check if user is already an attendee
      const event = await collections.community_events.findOne({ _id: eventId });
      if (!event) throw new Error('Event not found');
      
      if (event.attendees.includes(userId)) {
        throw new Error('User is already registered for this event');
      }
      
      await collections.community_events.updateOne(
        { _id: eventId },
        { $push: { attendees: userId } }
      );
      
      const updatedEvent = await collections.community_events.findOne({ _id: eventId });
      if (!updatedEvent) throw new Error('Event not found after adding attendee');
      return formatMongoData(updatedEvent);
    } catch (error) {
      console.error(`Error adding attendee to event ${eventId}:`, error);
      throw error;
    }
  },
  
  removeAttendee: async (eventId: string, userId: string): Promise<CommunityEvent> => {
    try {
      const { collections } = await connectToDatabase();
      
      await collections.community_events.updateOne(
        { _id: eventId },
        { $pull: { attendees: userId } }
      );
      
      const updatedEvent = await collections.community_events.findOne({ _id: eventId });
      if (!updatedEvent) throw new Error('Event not found after removing attendee');
      return formatMongoData(updatedEvent);
    } catch (error) {
      console.error(`Error removing attendee from event ${eventId}:`, error);
      throw error;
    }
  }
};

// Travel matches API
export const travelMatchesApi = {
  getAll: async (): Promise<TravelMatch[]> => {
    try {
      const { collections } = await connectToDatabase();
      const matches = await collections[COLLECTIONS.TRAVEL_MATCHES].find().toArray();
      return formatMongoData(matches);
    } catch (error) {
      console.error('Error fetching travel matches:', error);
      throw error;
    }
  },
  
  getByUserId: async (userId: string): Promise<TravelMatch> => {
    try {
      const { collections } = await connectToDatabase();
      const match = await collections.travel_matches.findOne({ userId });
      if (!match) throw new Error('Match not found');
      return formatMongoData(match);
    } catch (error) {
      console.error(`Error fetching match for user ${userId}:`, error);
      throw error;
    }
  },
  
  findPotentialMatches: async (userId: string, preferences: any): Promise<any[]> => {
    try {
      const { collections } = await connectToDatabase();
      
      // Find other active travel matches
      const matches = await collections.travel_matches.find().toArray();
      const potentialMatches = matches.filter(match => 
        match.userId !== userId && 
        match.status === "active" && 
        match.preferences.destinations.some((d: string) => 
          preferences.destinations.includes(d)
        )
      );
      
      // Get user details for each potential match
      const matchesWithDetails = await Promise.all(
        potentialMatches.map(async (match) => {
          const userDetails = await collections.community_users.findOne({ _id: match.userId });
          return {
            matchId: match._id.toString(),
            userId: match.userId,
            name: userDetails?.name || 'Anonymous Traveler',
            avatar: userDetails?.avatar,
            destinations: match.preferences.destinations,
            travelStyles: match.preferences.travelStyles,
            interests: match.preferences.interests,
            dateRange: match.preferences.dateRange
          };
        })
      );
      
      return formatMongoData(matchesWithDetails);
    } catch (error) {
      console.error('Error finding potential matches:', error);
      throw error;
    }
  },
  
  create: async (match: Omit<TravelMatch, 'id'>): Promise<TravelMatch> => {
    try {
      const { collections } = await connectToDatabase();
      
      // Check if user already has a match profile
      const existingMatch = await collections.travel_matches.findOne({ userId: match.userId });
      if (existingMatch) {
        throw new Error('User already has an active match profile');
      }
      
      const result = await collections.travel_matches.insertOne({
        ...match,
        createdAt: match.createdAt || new Date(),
        updatedAt: match.updatedAt || new Date(),
        potentialMatches: match.potentialMatches || []
      });
      
      const newMatch = { ...match, id: result.insertedId.toString() };
      return newMatch;
    } catch (error) {
      console.error('Error creating travel match:', error);
      throw error;
    }
  },
  
  update: async (id: string, match: Partial<TravelMatch>): Promise<TravelMatch> => {
    try {
      const { collections } = await connectToDatabase();
      
      // Always update the updatedAt timestamp
      const updatedMatch = {
        ...match,
        updatedAt: new Date()
      };
      
      await collections.travel_matches.updateOne(
        { _id: id },
        { $set: updatedMatch }
      );
      
      const result = await collections.travel_matches.findOne({ _id: id });
      if (!result) throw new Error('Match not found after update');
      return formatMongoData(result);
    } catch (error) {
      console.error(`Error updating match ${id}:`, error);
      throw error;
    }
  },
  
  updateMatchStatus: async (id: string, matchUserId: string, status: 'pending' | 'accepted' | 'rejected'): Promise<TravelMatch> => {
    try {
      const { collections } = await connectToDatabase();
      
      await collections.travel_matches.updateOne(
        { 
          _id: id,
          'potentialMatches.userId': matchUserId
        },
        { 
          $set: { 
            'potentialMatches.$.status': status,
            updatedAt: new Date()
          } 
        }
      );
      
      const updatedMatch = await collections.travel_matches.findOne({ _id: id });
      if (!updatedMatch) throw new Error('Match not found after status update');
      return formatMongoData(updatedMatch);
    } catch (error) {
      console.error(`Error updating match status ${id}:`, error);
      throw error;
    }
  }
};

// New API for payment and subscription management
export const communityPaymentApi = {
  checkSubscriptionStatus: async (userId: string): Promise<boolean> => {
    try {
      const { collections } = await connectToDatabase();
      
      // Check if user has an active subscription
      const subscriptions = await collections.user_subscriptions.find().toArray();
      const subscription = subscriptions.find(sub => 
        sub.userId === userId && 
        sub.status === 'active' && 
        new Date(sub.expiresAt) > new Date()
      );
      
      return !!subscription;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  },
  
  createSubscription: async (userId: string, plan: string, paymentDetails: any): Promise<any> => {
    try {
      const { collections } = await connectToDatabase();
      
      // In a real implementation, this would connect to a payment processor
      // For now, we'll simulate a successful subscription
      
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1); // 1 month subscription
      
      const subscription = {
        userId,
        plan,
        status: 'active',
        startedAt: new Date(),
        expiresAt: expirationDate,
        paymentMethod: paymentDetails.method,
        lastFour: paymentDetails.cardLastFour || '1234',
        createdAt: new Date()
      };
      
      const result = await collections.user_subscriptions.insertOne(subscription);
      return { 
        ...subscription, 
        id: result.insertedId.toString() 
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }
};
