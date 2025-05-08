
import { mongoApiService } from './mongoApiService';
import { communityApi } from './communityApiService';
import { Trip } from '@/models/Trip';

const COLLECTION = 'trips';

const tripsApi = {
  // Get all trips for the current user
  getAllTrips: async (userId: string): Promise<Trip[]> => {
    try {
      const trips = await mongoApiService.queryDocuments(COLLECTION, { userId });
      return trips as Trip[];
    } catch (error) {
      console.error('Error fetching user trips:', error);
      throw new Error('Failed to fetch trips');
    }
  },

  // Get trip by ID
  getTrip: async (tripId: string): Promise<Trip | null> => {
    try {
      const trip = await mongoApiService.getDocumentById(COLLECTION, tripId);
      return trip as Trip | null;
    } catch (error) {
      console.error('Error fetching trip:', error);
      throw new Error('Failed to fetch trip');
    }
  },

  // Create a new trip
  createTrip: async (tripData: Omit<Trip, '_id' | 'editCount' | 'createdAt' | 'updatedAt'>): Promise<Trip> => {
    try {
      // Check subscription limits
      const canCreateTrip = await tripsApi.checkCreatePermission(tripData.userId);
      
      if (!canCreateTrip) {
        throw new Error('You have reached the maximum number of trips for your free account. Please upgrade your subscription.');
      }

      const newTrip: Trip = {
        ...tripData,
        editCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await mongoApiService.insertDocument(COLLECTION, newTrip);
      return result as Trip;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  },

  // Update an existing trip
  updateTrip: async (tripId: string, userId: string, updates: Partial<Trip['details']>): Promise<Trip> => {
    try {
      // Get current trip
      const currentTrip = await mongoApiService.getDocumentById(COLLECTION, tripId) as Trip;
      
      // Verify ownership
      if (currentTrip.userId !== userId) {
        throw new Error('You do not have permission to edit this trip');
      }
      
      // Check edit count for free users
      const canEdit = await tripsApi.checkEditPermission(userId, currentTrip);
      if (!canEdit) {
        throw new Error('You have reached the maximum number of edits for your free account. Please upgrade your subscription.');
      }

      // Update the trip
      const updatedTrip = {
        ...currentTrip,
        details: { ...currentTrip.details, ...updates },
        editCount: currentTrip.editCount + 1,
        updatedAt: new Date()
      };

      await mongoApiService.updateDocument(COLLECTION, tripId, updatedTrip);
      return updatedTrip;
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  },

  // Cancel a trip
  cancelTrip: async (tripId: string, userId: string): Promise<Trip> => {
    try {
      // Get current trip
      const currentTrip = await mongoApiService.getDocumentById(COLLECTION, tripId) as Trip;
      
      // Verify ownership
      if (currentTrip.userId !== userId) {
        throw new Error('You do not have permission to cancel this trip');
      }

      // Update status to cancelled
      const updatedTrip = {
        ...currentTrip,
        status: 'cancelled' as const,
        updatedAt: new Date()
      };

      await mongoApiService.updateDocument(COLLECTION, tripId, updatedTrip);
      return updatedTrip;
    } catch (error) {
      console.error('Error cancelling trip:', error);
      throw error;
    }
  },

  // Delete a trip
  deleteTrip: async (tripId: string, userId: string): Promise<void> => {
    try {
      // Get current trip
      const currentTrip = await mongoApiService.getDocumentById(COLLECTION, tripId) as Trip;
      
      // Verify ownership
      if (currentTrip.userId !== userId) {
        throw new Error('You do not have permission to delete this trip');
      }

      await mongoApiService.deleteDocument(COLLECTION, tripId);
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  },

  // Check if user can create a new trip (based on subscription)
  checkCreatePermission: async (userId: string): Promise<boolean> => {
    try {
      // Check if user has an active subscription
      const subscription = await communityApi.payments.getSubscription(userId);
      
      if (subscription && subscription.status === 'active') {
        // Subscribed users can create unlimited trips
        return true;
      }

      // Free users can only create one trip
      const existingTrips = await mongoApiService.queryDocuments(COLLECTION, { 
        userId, 
        status: { $ne: 'cancelled' } 
      });

      return existingTrips.length < 1;
    } catch (error) {
      console.error('Error checking create permission:', error);
      return false;
    }
  },

  // Check if user can edit a trip (based on subscription and edit count)
  checkEditPermission: async (userId: string, trip: Trip): Promise<boolean> => {
    try {
      // Check if user has an active subscription
      const subscription = await communityApi.payments.getSubscription(userId);
      
      if (subscription && subscription.status === 'active') {
        // Subscribed users can edit unlimited times
        return true;
      }

      // Free users can edit up to 3 times
      return trip.editCount < 3;
    } catch (error) {
      console.error('Error checking edit permission:', error);
      return false;
    }
  }
};

export { tripsApi };
