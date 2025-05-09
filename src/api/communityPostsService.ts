
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
  
  // Get posts by user ID
  getUserPosts: async (userId: string) => {
    try {
      if (!userId) {
        console.error('getUserPosts called with no userId');
        return [];
      }
      
      const posts = await mongoApiService.queryDocuments('communityPosts', { userId });
      return posts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error(`Error fetching user posts for ${userId}:`, error);
      toast.error('Failed to load your posts');
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
      
      const result = await mongoApiService.insertDocument('communityPosts', newPost);
      return { ...newPost, _id: result.insertedId };
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
  
  // Add comment to post
  addComment: async (postId: string, comment: {
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
  }) => {
    try {
      if (!postId || !comment.userId || !comment.content) {
        throw new Error('Missing required fields for comment');
      }
      
      const post = await mongoApiService.getDocumentById('communityPosts', postId);
      if (!post) {
        throw new Error('Post not found');
      }
      
      // Create new comment
      const newComment = {
        ...comment,
        commentId: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      // Add to comments collection with reference to post
      await mongoApiService.insertDocument('comments', {
        ...newComment,
        postId
      });
      
      // Update comment count on post
      await mongoApiService.updateDocument('communityPosts', postId, {
        comments: (post.comments || 0) + 1
      });
      
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      throw error;
    }
  },
  
  // Get comments for a post
  getComments: async (postId: string) => {
    try {
      if (!postId) {
        return [];
      }
      
      const comments = await mongoApiService.queryDocuments('comments', { postId });
      return comments.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } catch (error) {
      console.error(`Error getting comments for post ${postId}:`, error);
      toast.error('Failed to load comments');
      return [];
    }
  }
};
