
// API service for community posts
import { mongoApiService } from './mongoApiService';
import { toast } from 'sonner';

export const communityPostsApi = {
  // Get all community posts
  getAllPosts: async () => {
    try {
      const posts = await mongoApiService.queryDocuments('communityPosts', {});
      return posts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error fetching community posts:', error);
      toast.error('Failed to load community posts');
      return [];
    }
  },
  
  // Create a new post
  createPost: async (postData: {
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    images?: string[];
    location?: string;
    tags?: string[];
    visibility?: string;
  }) => {
    try {
      // Validate required fields
      if (!postData.userId || !postData.userName || !postData.content) {
        throw new Error('Missing required fields for post creation');
      }
      
      const newPost = {
        ...postData,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        likedBy: []
      };
      
      // Check for inappropriate content (mock implementation)
      const containsInappropriateContent = 
        postData.content.toLowerCase().includes("xxx") || 
        postData.content.toLowerCase().includes("explicit");
      
      if (containsInappropriateContent) {
        // Store record but mark as moderated
        const moderatedPost = {
          ...newPost,
          moderated: true,
          moderationReason: 'Inappropriate content detected',
          moderatedAt: new Date().toISOString()
        };
        
        await mongoApiService.insertDocument('communityPosts', moderatedPost);
        
        // Return with wasModerated flag for UI handling
        return { 
          ...moderatedPost, 
          wasModerated: true 
        };
      }
      
      const result = await mongoApiService.insertDocument('communityPosts', newPost);
      return { 
        ...result, 
        wasModerated: false 
      };
    } catch (error) {
      console.error('Error creating community post:', error);
      toast.error('Failed to create post');
      throw error;
    }
  },
  
  // Like or unlike a post
  likePost: async (postId: string, userId: string) => {
    try {
      if (!postId || !userId) {
        throw new Error('Post ID and User ID are required');
      }
      
      // Get current post data
      const post = await mongoApiService.getDocumentById('communityPosts', postId);
      if (!post) {
        throw new Error('Post not found');
      }
      
      // Check if user already liked the post
      const likedBy = post.likedBy || [];
      const isLiked = likedBy.includes(userId);
      
      if (isLiked) {
        // Unlike the post
        await mongoApiService.updateDocument('communityPosts', postId, {
          likes: Math.max(0, post.likes - 1),
          likedBy: likedBy.filter((id: string) => id !== userId)
        });
        return { liked: false, likes: Math.max(0, post.likes - 1) };
      } else {
        // Like the post
        await mongoApiService.updateDocument('communityPosts', postId, {
          likes: (post.likes || 0) + 1,
          likedBy: [...likedBy, userId]
        });
        return { liked: true, likes: (post.likes || 0) + 1 };
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      toast.error('Failed to update post');
      throw error;
    }
  },
  
  // Save post (bookmark functionality)
  savePost: async (postId: string, userId: string) => {
    try {
      if (!postId || !userId) {
        throw new Error('Post ID and User ID are required');
      }
      
      // Check if post is already saved
      const savedPosts = await mongoApiService.queryDocuments('savedPosts', { userId, postId });
      
      if (savedPosts.length > 0) {
        // Post is already saved, so unsave it
        await mongoApiService.deleteDocument('savedPosts', savedPosts[0]._id);
        return { saved: false };
      } else {
        // Save the post
        await mongoApiService.insertDocument('savedPosts', {
          userId, 
          postId,
          savedAt: new Date().toISOString()
        });
        return { saved: true };
      }
    } catch (error) {
      console.error('Error saving/unsaving post:', error);
      toast.error('Failed to save post');
      throw error;
    }
  },
  
  // Get comments for a post
  getComments: async (postId: string) => {
    try {
      const comments = await mongoApiService.queryDocuments('comments', { postId });
      return comments.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } catch (error) {
      console.error(`Error getting comments for post ${postId}:`, error);
      toast.error('Failed to load comments');
      return [];
    }
  },
  
  // Add a comment to a post
  addComment: async (postId: string, comment: {
    userId: string;
    userName: string;
    content: string;
    userAvatar?: string;
  }) => {
    try {
      if (!postId || !comment.userId || !comment.userName || !comment.content) {
        throw new Error('Missing required fields for comment');
      }
      
      const post = await mongoApiService.getDocumentById('communityPosts', postId);
      if (!post) {
        throw new Error('Post not found');
      }
      
      const newComment = {
        ...comment,
        postId,
        createdAt: new Date().toISOString(),
        likes: 0
      };
      
      // Insert comment
      const result = await mongoApiService.insertDocument('comments', newComment);
      
      // Update post comment count
      await mongoApiService.updateDocument('communityPosts', postId, {
        comments: (post.comments || 0) + 1
      });
      
      return result;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      throw error;
    }
  }
};
