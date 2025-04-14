
// API service for notifications
import { mongoApiService } from './mongoApiService';

export const notificationsApi = {
  getAll: async (userId: string) => {
    try {
      const notifications = await mongoApiService.queryDocuments('notifications', { userId });
      return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error(`Error fetching notifications for user ${userId}:`, error);
      return [];
    }
  },
  
  getUnreadCount: async (userId: string) => {
    try {
      const unreadNotifications = await mongoApiService.queryDocuments('notifications', { 
        userId, 
        read: false 
      });
      return unreadNotifications.length;
    } catch (error) {
      console.error(`Error fetching unread notification count for user ${userId}:`, error);
      return 0;
    }
  },
  
  markAsRead: async (notificationId: string) => {
    try {
      await mongoApiService.updateDocument('notifications', notificationId, { read: true });
      return { success: true };
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      return { success: false };
    }
  },
  
  markAllAsRead: async (userId: string) => {
    try {
      // In a real MongoDB setup, we'd use updateMany - here we'll get them all and update one by one
      const unreadNotifications = await mongoApiService.queryDocuments('notifications', { 
        userId, 
        read: false 
      });
      
      for (const notification of unreadNotifications) {
        await mongoApiService.updateDocument('notifications', notification._id, { read: true });
      }
      
      return { success: true, count: unreadNotifications.length };
    } catch (error) {
      console.error(`Error marking all notifications as read for user ${userId}:`, error);
      return { success: false, count: 0 };
    }
  },
  
  delete: async (notificationId: string) => {
    try {
      await mongoApiService.deleteDocument('notifications', notificationId);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting notification ${notificationId}:`, error);
      return { success: false };
    }
  }
};

// Extend the community API with notifications
export const extendCommunityApiWithNotifications = (existingApi: any) => {
  return {
    ...existingApi,
    notifications: notificationsApi
  };
};
