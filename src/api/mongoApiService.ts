import { MongoOperators, Post, Category, Topic, Comment } from '@/types/common';
import { toast } from 'sonner';
import { mongoDbService } from './mongoDbService';

// MongoDB API service that uses the mongoDbService
class MongoApiService {
  private initialized = false;

  // Initialize MongoDB connection
  async initialize(): Promise<boolean> {
    try {
      if (this.initialized) {
        console.log('[MongoDB] Already initialized');
        return true;
      }

      console.log('[MongoDB] Initializing...');
      
      // Connect to MongoDB
      await mongoDbService.connect();
      
      this.initialized = true;
      console.log('[MongoDB] Initialization complete');
      return true;
    } catch (error) {
      console.error('[MongoDB] Initialization failed:', error);
      return false;
    }
  }

  // Insert a document into a collection
  async insertDocument(collectionName: string, document: any): Promise<any> {
    try {
      // Generate an ID if one doesn't exist
      const id = document.id || document._id;
      
      const newDocument = {
        ...document,
        createdAt: document.createdAt || new Date().toISOString(),
        updatedAt: document.updatedAt || new Date().toISOString()
      };
      
      const result = await mongoDbService.insertOne(collectionName, newDocument);
      console.log(`[MongoDB] Inserted document in ${collectionName}:`, result);
      
      // Return the document with the inserted ID
      return {
        ...newDocument,
        _id: result.insertedId || id
      };
    } catch (error) {
      console.error(`[MongoDB] Error inserting document into ${collectionName}:`, error);
      throw error;
    }
  }
  
  // Get a document by ID
  async getDocumentById(collectionName: string, id: string): Promise<any | null> {
    try {
      const filter = { _id: id };
      
      const document = await mongoDbService.findOne(collectionName, filter);
      console.log(`[MongoDB] Retrieved document from ${collectionName}:`, document);
      return document || null;
    } catch (error) {
      console.error(`[MongoDB] Error getting document from ${collectionName}:`, error);
      return null;
    }
  }
  
  // Update a document
  async updateDocument(collectionName: string, id: string, update: any): Promise<any | null> {
    try {
      const filter = { _id: id };
      
      const updatedDocument = {
        ...update,
        updatedAt: new Date().toISOString()
      };
      
      await mongoDbService.updateOne(collectionName, filter, updatedDocument);
      
      // Return the updated document
      const result = await this.getDocumentById(collectionName, id);
      console.log(`[MongoDB] Updated document in ${collectionName}:`, result);
      return result;
    } catch (error) {
      console.error(`[MongoDB] Error updating document in ${collectionName}:`, error);
      return null;
    }
  }
  
  // Delete a document
  async deleteDocument(collectionName: string, id: string): Promise<boolean> {
    try {
      const filter = { _id: id };
      
      const result = await mongoDbService.deleteOne(collectionName, filter);
      const success = result && result.deletedCount && result.deletedCount > 0;
      console.log(`[MongoDB] Deleted document from ${collectionName}:`, success);
      return success;
    } catch (error) {
      console.error(`[MongoDB] Error deleting document from ${collectionName}:`, error);
      return false;
    }
  }
  
  // Query documents with filter
  async queryDocuments(collectionName: string, filter: Record<string, any>): Promise<any[]> {
    try {
      const results = await mongoDbService.find(collectionName, filter);
      console.log(`[MongoDB] Queried documents from ${collectionName}:`, results.length);
      return results;
    } catch (error) {
      console.error(`[MongoDB] Error querying documents from ${collectionName}:`, error);
      return [];
    }
  }

  // Added method for subscription queries
  async getSubscriptionByUserId(userId: string): Promise<any | null> {
    try {
      const subscriptions = await this.queryDocuments('subscriptions', { userId, status: 'active' });
      return subscriptions.length > 0 ? subscriptions[0] : null;
    } catch (error) {
      console.error(`[MongoDB] Error getting subscription by user ID:`, error);
      return null;
    }
  }
}

export const mongoApiService = new MongoApiService();

// Posts API
export const postsApi = {
  getAll: async (): Promise<Post[]> => {
    try {
      return await mongoApiService.queryDocuments('posts', {});
    } catch (error) {
      console.error('Error fetching all posts:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<Post | null> => {
    try {
      return await mongoApiService.getDocumentById('posts', id);
    } catch (error) {
      console.error(`Error fetching post with ID ${id}:`, error);
      return null;
    }
  },
  
  getTrending: async (): Promise<Post[]> => {
    try {
      // In a real app, this would use a more sophisticated algorithm
      const posts = await mongoApiService.queryDocuments('posts', {});
      return posts.sort((a, b) => b.likes - a.likes).slice(0, 10);
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      return [];
    }
  },
  
  create: async (post: Omit<Post, 'id'>): Promise<Post> => {
    try {
      return await mongoApiService.insertDocument('posts', post);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },
  
  update: async (id: string, post: Partial<Post>): Promise<Post | null> => {
    try {
      return await mongoApiService.updateDocument('posts', id, post);
    } catch (error) {
      console.error(`Error updating post with ID ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      return await mongoApiService.deleteDocument('posts', id);
    } catch (error) {
      console.error(`Error deleting post with ID ${id}:`, error);
      throw error;
    }
  },
  
  trackClick: async (id: string): Promise<void> => {
    try {
      const post = await mongoApiService.getDocumentById('posts', id);
      if (post) {
        await mongoApiService.updateDocument('posts', id, { clicks: (post.clicks || 0) + 1 });
      }
    } catch (error) {
      console.error(`Error tracking click for post with ID ${id}:`, error);
    }
  }
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    try {
      return await mongoApiService.queryDocuments('categories', {});
    } catch (error) {
      console.error('Error fetching all categories:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<Category | null> => {
    try {
      return await mongoApiService.getDocumentById('categories', id);
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      return null;
    }
  },
  
  create: async (category: Omit<Category, 'id'>): Promise<Category> => {
    try {
      return await mongoApiService.insertDocument('categories', category);
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },
  
  update: async (id: string, category: Partial<Category>): Promise<Category | null> => {
    try {
      return await mongoApiService.updateDocument('categories', id, category);
    } catch (error) {
      console.error(`Error updating category with ID ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      return await mongoApiService.deleteDocument('categories', id);
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error);
      throw error;
    }
  }
};

// Topics API
export const topicsApi = {
  getAll: async (): Promise<Topic[]> => {
    try {
      return await mongoApiService.queryDocuments('topics', {});
    } catch (error) {
      console.error('Error fetching all topics:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<Topic | null> => {
    try {
      return await mongoApiService.getDocumentById('topics', id);
    } catch (error) {
      console.error(`Error fetching topic with ID ${id}:`, error);
      return null;
    }
  },
  
  getTrending: async (): Promise<Topic[]> => {
    try {
      // In a real app, this would use a more sophisticated algorithm
      const topics = await mongoApiService.queryDocuments('topics', {});
      return topics.sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 10);
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      return [];
    }
  },
  
  create: async (topic: Omit<Topic, 'id'>): Promise<Topic> => {
    try {
      return await mongoApiService.insertDocument('topics', topic);
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  },
  
  update: async (id: string, topic: Partial<Topic>): Promise<Topic | null> => {
    try {
      return await mongoApiService.updateDocument('topics', id, topic);
    } catch (error) {
      console.error(`Error updating topic with ID ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      return await mongoApiService.deleteDocument('topics', id);
    } catch (error) {
      console.error(`Error deleting topic with ID ${id}:`, error);
      throw error;
    }
  }
};

// Comments API
export const commentsApi = {
  getAll: async (): Promise<Comment[]> => {
    try {
      return await mongoApiService.queryDocuments('comments', {});
    } catch (error) {
      console.error('Error fetching all comments:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<Comment | null> => {
    try {
      return await mongoApiService.getDocumentById('comments', id);
    } catch (error) {
      console.error(`Error fetching comment with ID ${id}:`, error);
      return null;
    }
  },
  
  getByPostId: async (postId: string): Promise<Comment[]> => {
    try {
      return await mongoApiService.queryDocuments('comments', { postId });
    } catch (error) {
      console.error(`Error fetching comments for post with ID ${postId}:`, error);
      return [];
    }
  },
  
  create: async (comment: Omit<Comment, 'id'>): Promise<Comment> => {
    try {
      return await mongoApiService.insertDocument('comments', comment);
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },
  
  update: async (id: string, comment: Partial<Comment>): Promise<Comment | null> => {
    try {
      return await mongoApiService.updateDocument('comments', id, comment);
    } catch (error) {
      console.error(`Error updating comment with ID ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<boolean> => {
    try {
      return await mongoApiService.deleteDocument('comments', id);
    } catch (error) {
      console.error(`Error deleting comment with ID ${id}:`, error);
      throw error;
    }
  }
};
