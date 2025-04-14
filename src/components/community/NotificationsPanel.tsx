
import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  AlertTriangle, 
  MessageCircle, 
  UserPlus,
  CheckCheck,
  Trash2,
  X
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface NotificationsPanelProps {
  userId: string;
  onClose?: () => void;
}

// Define the return type for markAllAsRead to resolve TypeScript errors
interface MarkAllAsReadResponse {
  success: boolean;
  count: number;
}

const NotificationsPanel = ({ userId, onClose }: NotificationsPanelProps) => {
  const queryClient = useQueryClient();
  
  // Ensure we have the notifications API
  const { data: communityApi } = useQuery({
    queryKey: ['communityApiWithNotifications'],
    queryFn: async () => {
      // This relies on the extension being loaded elsewhere
      // In a real app, you'd want to ensure this is loaded properly
      const globalCommunityApi = (window as any).communityApi || {};
      if (!globalCommunityApi.notifications) {
        throw new Error('Notifications API not loaded');
      }
      return globalCommunityApi;
    }
  });
  
  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => communityApi?.notifications?.getAll(userId) || [],
    enabled: !!userId && !!communityApi?.notifications,
  });
  
  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => 
      communityApi?.notifications?.markAsRead(notificationId) || Promise.resolve({ success: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
  
  // Mark all as read with proper type annotation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => 
      communityApi?.notifications?.markAllAsRead(userId) as Promise<MarkAllAsReadResponse> || Promise.resolve({ success: false, count: 0 }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      if (data.success) {
        toast.success(`Marked ${data.count} notifications as read`);
      }
    }
  });
  
  // Delete notification
  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => 
      communityApi?.notifications?.delete(notificationId) || Promise.resolve({ success: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
  
  // Helper function to get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'content_warning':
      case 'account_blocked':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'message':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'connection_request':
        return <UserPlus className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Auto-mark viewed notifications as read
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      notifications.forEach(notification => {
        if (!notification.read) {
          markAsReadMutation.mutate(notification._id);
        }
      });
    }
  }, [notifications]);
  
  const hasUnread = notifications.some(notification => !notification.read);
  
  return (
    <div className="w-full max-w-sm bg-card border border-border rounded-lg shadow-lg">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Notifications</h3>
          {hasUnread && (
            <Badge variant="destructive" className="ml-2">New</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={!hasUnread}
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <ScrollArea className="h-[400px] p-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Bell className="h-10 w-10 text-muted-foreground mb-3 opacity-30" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.map((notification) => (
              <div 
                key={notification._id} 
                className={`p-3 rounded-lg transition-colors ${notification.read ? 'bg-background' : 'bg-secondary/30'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-background p-2 rounded-full">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm">
                      {notification.message}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => deleteNotificationMutation.mutate(notification._id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default NotificationsPanel;
