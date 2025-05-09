
import { mongoApiService } from './mongoApiService';
import { toast } from 'sonner';

export const notificationsApi = {
  // Get all notifications for a user
  getAll: async (userId: string) => {
    try {
      if (!userId) return [];
      
      const notifications = await mongoApiService.queryDocuments('notifications', { userId });
      return notifications.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },
  
  // Get count of unread notifications
  getUnreadCount: async (userId: string) => {
    try {
      if (!userId) return 0;
      
      const notifications = await mongoApiService.queryDocuments('notifications', { 
        userId, 
        read: false 
      });
      
      return notifications.length;
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
      return 0;
    }
  },
  
  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    try {
      await mongoApiService.updateDocument('notifications', notificationId, {
        read: true,
        readAt: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },
  
  // Mark all notifications as read for a user
  markAllAsRead: async (userId: string) => {
    try {
      const unreadNotifications = await mongoApiService.queryDocuments('notifications', {
        userId,
        read: false
      });
      
      for (const notification of unreadNotifications) {
        await mongoApiService.updateDocument('notifications', notification.id, {
          read: true,
          readAt: new Date().toISOString()
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  },
  
  // Create a new notification
  create: async (notification: {
    userId: string;
    type: string;
    title: string;
    message: string;
    linkTo?: string;
    data?: any;
  }) => {
    try {
      const newNotification = {
        ...notification,
        read: false,
        createdAt: new Date().toISOString()
      };
      
      return await mongoApiService.insertDocument('notifications', newNotification);
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }
};

// Function to extend the community API with notifications
export const extendCommunityApiWithNotifications = (existingApi: any) => {
  return {
    ...existingApi,
    notifications: notificationsApi
  };
};
