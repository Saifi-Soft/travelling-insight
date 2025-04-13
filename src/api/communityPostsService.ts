
import { mongoApiService } from './mongoApiService';

// Define API for community posts
export const communityPostsApi = {
  getAllPosts: async () => {
    try {
      return await mongoApiService.queryDocuments('communityPosts', {});
    } catch (error) {
      console.error('Error fetching community posts:', error);
      return [];
    }
  },
  
  getPostById: async (id: string) => {
    try {
      return await mongoApiService.getDocumentById('communityPosts', id);
    } catch (error) {
      console.error(`Error fetching post with ID ${id}:`, error);
      return null;
    }
  },
  
  createPost: async (post: {
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    images?: string[];
    location?: string;
    likes?: number;
    comments?: number;
  }) => {
    try {
      const newPost = {
        ...post,
        createdAt: new Date().toISOString(),
        likes: post.likes || 0,
        comments: post.comments || 0
      };
      
      return await mongoApiService.insertDocument('communityPosts', newPost);
    } catch (error) {
      console.error('Error creating community post:', error);
      throw error;
    }
  },
  
  updatePost: async (id: string, updates: any) => {
    try {
      return await mongoApiService.updateDocument('communityPosts', id, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Error updating post with ID ${id}:`, error);
      throw error;
    }
  },
  
  deletePost: async (id: string) => {
    try {
      return await mongoApiService.deleteDocument('communityPosts', id);
    } catch (error) {
      console.error(`Error deleting post with ID ${id}:`, error);
      throw error;
    }
  },
  
  likePost: async (id: string, userId: string) => {
    try {
      // First, check if the user already liked the post
      const postLikes = await mongoApiService.queryDocuments('postLikes', { 
        postId: id,
        userId: userId
      });
      
      if (postLikes.length > 0) {
        // User already liked, remove the like
        await mongoApiService.deleteDocument('postLikes', postLikes[0].id);
        
        // Decrement post's like count
        const post = await mongoApiService.getDocumentById('communityPosts', id);
        if (post) {
          await mongoApiService.updateDocument('communityPosts', id, {
            likes: Math.max(0, (post.likes || 1) - 1)
          });
        }
        
        return { liked: false, likes: post ? Math.max(0, (post.likes || 1) - 1) : 0 };
      } else {
        // Add new like
        await mongoApiService.insertDocument('postLikes', {
          postId: id,
          userId: userId,
          createdAt: new Date().toISOString()
        });
        
        // Increment post's like count
        const post = await mongoApiService.getDocumentById('communityPosts', id);
        if (post) {
          await mongoApiService.updateDocument('communityPosts', id, {
            likes: (post.likes || 0) + 1
          });
        }
        
        return { liked: true, likes: post ? (post.likes || 0) + 1 : 1 };
      }
    } catch (error) {
      console.error(`Error toggling like for post ${id}:`, error);
      throw error;
    }
  },
  
  addComment: async (comment: {
    postId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
  }) => {
    try {
      const newComment = {
        ...comment,
        createdAt: new Date().toISOString(),
        likes: 0
      };
      
      // Add the comment
      const result = await mongoApiService.insertDocument('postComments', newComment);
      
      // Increment post's comment count
      const post = await mongoApiService.getDocumentById('communityPosts', comment.postId);
      if (post) {
        await mongoApiService.updateDocument('communityPosts', comment.postId, {
          comments: (post.comments || 0) + 1
        });
      }
      
      return result;
    } catch (error) {
      console.error(`Error adding comment to post ${comment.postId}:`, error);
      throw error;
    }
  },
  
  getPostComments: async (postId: string) => {
    try {
      // Get comments for a specific post, sorted by creation date
      const comments = await mongoApiService.queryDocuments('postComments', { postId });
      return comments.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error(`Error getting comments for post ${postId}:`, error);
      return [];
    }
  }
};

// Add to the existing communityApi
export const extendCommunityApi = (existingApi: any) => {
  return {
    ...existingApi,
    posts: communityPostsApi
  };
};
