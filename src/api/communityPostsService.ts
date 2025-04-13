
// Updated version of the community posts service with additional functionality
import { mongoApiService } from './mongoApiService';

// Define API for community posts
export const communityPostsApi = {
  getAllPosts: async () => {
    try {
      const posts = await mongoApiService.queryDocuments('communityPosts', {});
      return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
    tags?: string[];
    visibility?: string;
    likes?: number;
    comments?: number;
  }) => {
    try {
      const newPost = {
        ...post,
        createdAt: new Date().toISOString(),
        likes: post.likes || 0,
        comments: post.comments || 0,
        visibility: post.visibility || 'public'
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
        await mongoApiService.deleteDocument('postLikes', postLikes[0]._id);
        
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
  
  savePost: async (id: string, userId: string) => {
    try {
      // Check if already saved
      const savedPosts = await mongoApiService.queryDocuments('savedPosts', {
        postId: id,
        userId: userId
      });
      
      if (savedPosts.length > 0) {
        // Already saved, remove it
        await mongoApiService.deleteDocument('savedPosts', savedPosts[0]._id);
        return { saved: false };
      } else {
        // Save the post
        await mongoApiService.insertDocument('savedPosts', {
          postId: id,
          userId: userId,
          createdAt: new Date().toISOString()
        });
        return { saved: true };
      }
    } catch (error) {
      console.error(`Error saving post ${id}:`, error);
      throw error;
    }
  },
  
  getSavedPosts: async (userId: string) => {
    try {
      // Get all saved post IDs for this user
      const savedPostRefs = await mongoApiService.queryDocuments('savedPosts', { userId });
      const postIds = savedPostRefs.map(ref => ref.postId);
      
      // No saved posts
      if (postIds.length === 0) return [];
      
      // Fetch the actual posts
      const savedPosts = [];
      for (const postId of postIds) {
        const post = await mongoApiService.getDocumentById('communityPosts', postId);
        if (post) savedPosts.push(post);
      }
      
      return savedPosts;
    } catch (error) {
      console.error(`Error fetching saved posts for user ${userId}:`, error);
      return [];
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
      return comments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error(`Error getting comments for post ${postId}:`, error);
      return [];
    }
  },
  
  sharePost: async (postId: string, userId: string, shareType: 'profile' | 'group' | 'message', targetId: string) => {
    try {
      const shareData = {
        originalPostId: postId,
        userId,
        shareType,
        targetId,
        createdAt: new Date().toISOString()
      };
      
      return await mongoApiService.insertDocument('postShares', shareData);
    } catch (error) {
      console.error(`Error sharing post ${postId}:`, error);
      throw error;
    }
  },
  
  getTrendingPosts: async () => {
    try {
      const allPosts = await mongoApiService.queryDocuments('communityPosts', {});
      
      // Sort by engagement (likes + comments) in the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentPosts = allPosts.filter(post => 
        new Date(post.createdAt) >= sevenDaysAgo
      );
      
      return recentPosts.sort((a, b) => 
        (b.likes + b.comments) - (a.likes + a.comments)
      ).slice(0, 10);
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      return [];
    }
  },
  
  searchPosts: async (query: string) => {
    try {
      const allPosts = await mongoApiService.queryDocuments('communityPosts', {});
      
      const lowercaseQuery = query.toLowerCase();
      return allPosts.filter(post => 
        post.content.toLowerCase().includes(lowercaseQuery) ||
        post.location?.toLowerCase().includes(lowercaseQuery) ||
        post.userName.toLowerCase().includes(lowercaseQuery) ||
        post.tags?.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery))
      );
    } catch (error) {
      console.error(`Error searching posts for "${query}":`, error);
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
