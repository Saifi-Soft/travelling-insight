
import { mongoApiService } from './mongoApiService';
import { toast } from 'sonner';
import { notificationsApi } from './notificationsService';

export const contentModerationApi = {
  // Check content for inappropriate terms
  checkContent: async (content: string): Promise<{isInappropriate: boolean, reason?: string}> => {
    try {
      // Basic inappropriate content detection (in a real app, this would be more sophisticated)
      const inappropriateTerms = ['xxx', 'explicit', 'adult content', 'obscene'];
      
      for (const term of inappropriateTerms) {
        if (content.toLowerCase().includes(term)) {
          return {
            isInappropriate: true,
            reason: `Contains inappropriate term: "${term}"`
          };
        }
      }
      
      return { isInappropriate: false };
    } catch (error) {
      console.error('Error checking content:', error);
      return { isInappropriate: false };
    }
  },
  
  // Flag a post as inappropriate
  flagPost: async (postId: string, reporterId: string, reason: string) => {
    try {
      const post = await mongoApiService.getDocumentById('communityPosts', postId);
      
      if (!post) {
        throw new Error('Post not found');
      }
      
      // Create a report
      const report = {
        itemType: 'post',
        itemId: postId,
        reporterId,
        reason,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      await mongoApiService.insertDocument('moderationReports', report);
      
      // Notify the reporter
      await notificationsApi.create({
        userId: reporterId,
        type: 'moderation_report',
        title: 'Report Received',
        message: 'Thank you for reporting content. Our moderation team will review it shortly.'
      });
      
      return true;
    } catch (error) {
      console.error('Error flagging post:', error);
      return false;
    }
  },
  
  // Get all moderation reports for admin
  getReports: async (status: string = 'all') => {
    try {
      let query = {};
      if (status !== 'all') {
        query = { status };
      }
      
      const reports = await mongoApiService.queryDocuments('moderationReports', query);
      return reports.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error fetching moderation reports:', error);
      return [];
    }
  },
  
  // Moderate content (approve or reject)
  moderateContent: async (reportId: string, decision: 'approve' | 'reject', adminId: string, notes?: string) => {
    try {
      const report = await mongoApiService.getDocumentById('moderationReports', reportId);
      
      if (!report) {
        throw new Error('Report not found');
      }
      
      // Update the report status
      await mongoApiService.updateDocument('moderationReports', reportId, {
        status: decision === 'approve' ? 'approved' : 'rejected',
        adminId,
        adminNotes: notes || '',
        resolvedAt: new Date().toISOString()
      });
      
      if (decision === 'approve' && report.itemType === 'post') {
        // Mark the post as moderated
        await mongoApiService.updateDocument('communityPosts', report.itemId, {
          moderated: true,
          moderationReason: report.reason,
          moderatedAt: new Date().toISOString()
        });
        
        // Notify the post creator
        const post = await mongoApiService.getDocumentById('communityPosts', report.itemId);
        if (post) {
          await notificationsApi.create({
            userId: post.userId,
            type: 'content_warning',
            title: 'Content Warning',
            message: 'Your post was removed for violating our community guidelines.',
            data: { postId: post.id }
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error moderating content:', error);
      return false;
    }
  }
};
