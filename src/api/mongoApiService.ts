// Mock API service for MongoDB operations in the browser
import { toast } from 'sonner';
import { mongoDbService, DbDocument, DbOperationResult } from './mongoDbService';

// MongoDB API service
class MongoApiService {
  constructor() {
    // Initialize the MongoDB service when this service is created
    this.initialize();
  }

  // Initialize MongoDB connection
  async initialize(): Promise<boolean> {
    try {
      console.log('[MongoDB API] Initializing service...');
      
      // Connect to MongoDB using the mongoDbService
      await mongoDbService.connect();
      
      console.log('[MongoDB API] Service initialization complete');
      return true;
    } catch (error) {
      console.error('[MongoDB API] Initialization failed:', error);
      toast.error('Failed to connect to database. Some features may not work correctly.');
      return false;
    }
  }

  // Generic query to get all documents from a collection
  async queryDocuments(collectionName: string, query: any = {}): Promise<DbDocument[]> {
    try {
      return await mongoDbService.find(collectionName, query);
    } catch (error) {
      console.error(`[MongoDB API] Error querying ${collectionName}:`, error);
      return [];
    }
  }

  // Get a document by ID
  async getDocumentById(collectionName: string, id: string): Promise<DbDocument | null> {
    try {
      // Check if id is a valid string
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid ID provided');
      }

      // Try to find the document either by _id or id
      let document = await mongoDbService.findOne(collectionName, { _id: id });
      
      if (!document) {
        document = await mongoDbService.findOne(collectionName, { id: id });
      }
      
      return document;
    } catch (error) {
      console.error(`[MongoDB API] Error getting document by ID from ${collectionName}:`, error);
      return null;
    }
  }

  // Insert a new document
  async insertDocument(collectionName: string, data: any): Promise<DbDocument> {
    try {
      const result = await mongoDbService.insertOne(collectionName, data);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to insert document');
      }
      
      return result.data;
    } catch (error) {
      console.error(`[MongoDB API] Error inserting document into ${collectionName}:`, error);
      throw error;
    }
  }

  // Update a document
  async updateDocument(collectionName: string, id: string, data: any): Promise<any> {
    try {
      // Check if we should search by _id or id
      let filter;
      if (await mongoDbService.findOne(collectionName, { _id: id })) {
        filter = { _id: id };
      } else {
        filter = { id: id };
      }
      
      const result = await mongoDbService.updateOne(collectionName, filter, data);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to update document');
      }
      
      return { id, ...data, updated: result.modifiedCount > 0 };
    } catch (error) {
      console.error(`[MongoDB API] Error updating document in ${collectionName}:`, error);
      throw error;
    }
  }

  // Delete a document
  async deleteDocument(collectionName: string, id: string): Promise<any> {
    try {
      // Check if we should search by _id or id
      let filter;
      if (await mongoDbService.findOne(collectionName, { _id: id })) {
        filter = { _id: id };
      } else {
        filter = { id: id };
      }
      
      const result = await mongoDbService.deleteOne(collectionName, filter);
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete document');
      }
      
      return { id, deleted: result.deletedCount > 0 };
    } catch (error) {
      console.error(`[MongoDB API] Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  }
  
  // Posts API
  postsApi = {
    getAll: async () => {
      try {
        return await this.queryDocuments('posts');
      } catch (error) {
        console.error('[MongoDB API] Error getting all posts:', error);
        return [];
      }
    },
    
    getById: async (id: string) => {
      try {
        return await this.getDocumentById('posts', id);
      } catch (error) {
        console.error(`[MongoDB API] Error getting post with ID ${id}:`, error);
        return null;
      }
    },
    
    create: async (postData: any) => {
      try {
        return await this.insertDocument('posts', {
          ...postData,
          date: postData.date || new Date().toISOString(),
          likes: postData.likes || 0,
          comments: postData.comments || 0
        });
      } catch (error) {
        console.error('[MongoDB API] Error creating post:', error);
        throw error;
      }
    },
    
    update: async (id: string, postData: any) => {
      try {
        return await this.updateDocument('posts', id, postData);
      } catch (error) {
        console.error(`[MongoDB API] Error updating post with ID ${id}:`, error);
        throw error;
      }
    },
    
    delete: async (id: string) => {
      try {
        return await this.deleteDocument('posts', id);
      } catch (error) {
        console.error(`[MongoDB API] Error deleting post with ID ${id}:`, error);
        throw error;
      }
    },
    
    getComments: async (postId: string) => {
      try {
        return await this.queryDocuments('comments', { postId });
      } catch (error) {
        console.error(`[MongoDB API] Error getting comments for post ${postId}:`, error);
        return [];
      }
    },
    
    addComment: async (postId: string, commentData: any) => {
      try {
        const comment = {
          ...commentData,
          postId,
          date: commentData.date || new Date().toISOString(),
          likes: 0
        };
        
        return await this.insertDocument('comments', comment);
      } catch (error) {
        console.error(`[MongoDB API] Error adding comment to post ${postId}:`, error);
        throw error;
      }
    }
  };

  // Comments API
  commentsApi = {
    getAll: async () => {
      try {
        return await this.queryDocuments('comments');
      } catch (error) {
        console.error('[MongoDB API] Error getting all comments:', error);
        return [];
      }
    },
    
    getByPostId: async (postId: string) => {
      try {
        return await this.queryDocuments('comments', { postId });
      } catch (error) {
        console.error(`[MongoDB API] Error getting comments for post ${postId}:`, error);
        return [];
      }
    },
    
    getById: async (id: string) => {
      try {
        return await this.getDocumentById('comments', id);
      } catch (error) {
        console.error(`[MongoDB API] Error getting comment with ID ${id}:`, error);
        return null;
      }
    },
    
    create: async (commentData: any) => {
      try {
        return await this.insertDocument('comments', {
          ...commentData,
          date: commentData.date || new Date().toISOString(),
          likes: commentData.likes || 0
        });
      } catch (error) {
        console.error('[MongoDB API] Error creating comment:', error);
        throw error;
      }
    },
    
    update: async (id: string, commentData: any) => {
      try {
        return await this.updateDocument('comments', id, commentData);
      } catch (error) {
        console.error(`[MongoDB API] Error updating comment with ID ${id}:`, error);
        throw error;
      }
    },
    
    delete: async (id: string) => {
      try {
        return await this.deleteDocument('comments', id);
      } catch (error) {
        console.error(`[MongoDB API] Error deleting comment with ID ${id}:`, error);
        throw error;
      }
    }
  };
  
  // Categories API
  categoriesApi = {
    getAll: async () => {
      try {
        return await this.queryDocuments('categories');
      } catch (error) {
        console.error('[MongoDB API] Error getting all categories:', error);
        return [];
      }
    },
    
    getById: async (id: string) => {
      try {
        return await this.getDocumentById('categories', id);
      } catch (error) {
        console.error(`[MongoDB API] Error getting category with ID ${id}:`, error);
        return null;
      }
    },
    
    create: async (categoryData: any) => {
      try {
        return await this.insertDocument('categories', categoryData);
      } catch (error) {
        console.error('[MongoDB API] Error creating category:', error);
        throw error;
      }
    },
    
    update: async (id: string, categoryData: any) => {
      try {
        return await this.updateDocument('categories', id, categoryData);
      } catch (error) {
        console.error(`[MongoDB API] Error updating category with ID ${id}:`, error);
        throw error;
      }
    },
    
    delete: async (id: string) => {
      try {
        return await this.deleteDocument('categories', id);
      } catch (error) {
        console.error(`[MongoDB API] Error deleting category with ID ${id}:`, error);
        throw error;
      }
    }
  };
  
  // Topics API
  topicsApi = {
    getAll: async () => {
      try {
        return await this.queryDocuments('topics');
      } catch (error) {
        console.error('[MongoDB API] Error getting all topics:', error);
        return [];
      }
    },
    
    getById: async (id: string) => {
      try {
        return await this.getDocumentById('topics', id);
      } catch (error) {
        console.error(`[MongoDB API] Error getting topic with ID ${id}:`, error);
        return null;
      }
    },
    
    create: async (topicData: any) => {
      try {
        return await this.insertDocument('topics', topicData);
      } catch (error) {
        console.error('[MongoDB API] Error creating topic:', error);
        throw error;
      }
    },
    
    update: async (id: string, topicData: any) => {
      try {
        return await this.updateDocument('topics', id, topicData);
      } catch (error) {
        console.error(`[MongoDB API] Error updating topic with ID ${id}:`, error);
        throw error;
      }
    },
    
    delete: async (id: string) => {
      try {
        return await this.deleteDocument('topics', id);
      } catch (error) {
        console.error(`[MongoDB API] Error deleting topic with ID ${id}:`, error);
        throw error;
      }
    }
  };
}

// Create a singleton instance
export const mongoApiService = new MongoApiService();

// Export specific APIs for convenience
export const { postsApi, categoriesApi, topicsApi, commentsApi } = mongoApiService;
