
// Content moderation service for detecting inappropriate content
import { mongoApiService } from './mongoApiService';
import { toast } from 'sonner';

// List of keywords that might indicate adult content - this is very basic
// In a production environment, you would use a more sophisticated AI-based solution
const adultContentKeywords = [
  'xxx', 'porn', 'adult content', 'explicit content', 'nsfw',
  'sexual', 'naked', 'nude', '18+', 'adult only', 'xxx',
];

export const contentModerationApi = {
  // Scan text content for inappropriate content
  scanContent: async (content: string): Promise<{isInappropriate: boolean, reason?: string}> => {
    try {
      // Convert content to lowercase for case-insensitive matching
      const lowercaseContent = content.toLowerCase();
      
      // Check for adult content keywords
      for (const keyword of adultContentKeywords) {
        if (lowercaseContent.includes(keyword)) {
          return { 
            isInappropriate: true, 
            reason: `Contains prohibited keyword: ${keyword}` 
          };
        }
      }
      
      return { isInappropriate: false };
    } catch (error) {
      console.error('Error scanning content:', error);
      // If the moderation service fails, we allow the content by default
      // but log the error - in production you might want different behavior
      return { isInappropriate: false };
    }
  },
  
  // Record a warning for a user
  addWarningToUser: async (userId: string, contentId: string, reason: string): Promise<{
    success: boolean, 
    warningCount: number,
    blocked: boolean
  }> => {
    try {
      // Create a new warning
      const warning = {
        userId,
        contentId,
        reason,
        createdAt: new Date().toISOString(),
        acknowledged: false
      };
      
      await mongoApiService.insertDocument('contentWarnings', warning);
      
      // Count user's existing warnings
      const userWarnings = await mongoApiService.queryDocuments('contentWarnings', { userId });
      const warningCount = userWarnings.length;
      
      // If this is the third or more warning, block the user
      let blocked = false;
      if (warningCount >= 3) {
        await mongoApiService.updateDocument('communityUsers', userId, {
          status: 'blocked',
          blockReason: 'Multiple content warnings (3 or more)',
          blockedAt: new Date().toISOString()
        });
        blocked = true;
      }
      
      // Create notification to inform user about the warning
      const notificationText = blocked 
        ? 'Your account has been blocked due to multiple content warnings for posting inappropriate content.'
        : `Warning: Your post was removed for containing inappropriate content. Warning ${warningCount}/3.`;
      
      await mongoApiService.insertDocument('notifications', {
        userId,
        type: blocked ? 'account_blocked' : 'content_warning',
        message: notificationText,
        relatedContentId: contentId,
        createdAt: new Date().toISOString(),
        read: false
      });
      
      return {
        success: true,
        warningCount,
        blocked
      };
    } catch (error) {
      console.error('Error adding warning to user:', error);
      return {
        success: false,
        warningCount: 0,
        blocked: false
      };
    }
  },

  // Get all content warnings for admin panel
  getAllContentWarnings: async () => {
    try {
      const warnings = await mongoApiService.queryDocuments('contentWarnings', {});
      
      // Enhance warnings with user information
      const enhancedWarnings = [];
      for (const warning of warnings) {
        const user = await mongoApiService.getDocumentById('communityUsers', warning.userId);
        enhancedWarnings.push({
          ...warning,
          userName: user ? user.userName : 'Unknown User',
          userEmail: user ? user.email : 'No email',
          userStatus: user ? user.status : 'unknown'
        });
      }
      
      return enhancedWarnings.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error getting content warnings:', error);
      return [];
    }
  },
  
  // Get warnings for a specific user
  getUserWarnings: async (userId: string) => {
    try {
      const warnings = await mongoApiService.queryDocuments('contentWarnings', { userId });
      return warnings.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error(`Error getting warnings for user ${userId}:`, error);
      return [];
    }
  },
  
  // Mark a warning as acknowledged by the user
  acknowledgeWarning: async (warningId: string) => {
    try {
      await mongoApiService.updateDocument('contentWarnings', warningId, {
        acknowledged: true,
        acknowledgedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error(`Error acknowledging warning ${warningId}:`, error);
      return { success: false };
    }
  }
};
