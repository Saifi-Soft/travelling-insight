
// Mock API service for MongoDB operations in the browser
import { toast } from 'sonner';

// Mock API service for MongoDB operations that works in browser environments
class MongoApiService {
  private initialized = false;
  private mockDb: Record<string, any[]> = {};
  private mongoUrl: string;

  constructor() {
    // Store the MongoDB connection URL
    this.mongoUrl = import.meta.env.VITE_MONGODB_URI || 'mongodb+srv://saifibadshah10:2Fjs34snjd56p9@travellinginsight.3fl6dwk.mongodb.net/';
    console.log('[MongoDB] Using connection URL:', this.mongoUrl);
  }

  // Initialize MongoDB connection
  async initialize(): Promise<boolean> {
    try {
      if (this.initialized) {
        console.log('[MongoDB] Already initialized');
        return true;
      }

      console.log('[MongoDB] Initializing API service...');
      console.log('[MongoDB] Using connection URL:', this.mongoUrl);
      
      if (typeof window !== 'undefined') {
        // Browser environment - initialize mock database
        console.log('[MongoDB] Browser environment detected, using mock implementation');
        this.mockDb = {};
        toast.success('Connected to mock database for development');
      } else {
        // Server environment - would connect to real MongoDB
        // This is just a placeholder as the real connection would be server-side
        console.log('[MongoDB] Server environment detected, would connect to real MongoDB');
      }
      
      this.initialized = true;
      console.log('[MongoDB] Service initialization complete');
      return true;
    } catch (error) {
      console.error('[MongoDB] Initialization failed:', error);
      toast.error('Failed to connect to database. Some features may not work correctly.');
      return false;
    }
  }

  // Get a document by ID
  async getDocumentById(collectionName: string, id: string): Promise<any | null> {
    try {
      this.ensureCollection(collectionName);
      
      const document = this.mockDb[collectionName].find(doc => 
        doc._id === id || doc.id === id
      );
      
      console.log(`[MongoDB] Retrieved document from ${collectionName}:`, document);
      return document ? { ...document } : null;
    } catch (error) {
      console.error(`[MongoDB] Error getting document from ${collectionName}:`, error);
      return null;
    }
  }
  
  // Query documents with filter
  async queryDocuments(collectionName: string, filter: Record<string, any> = {}): Promise<any[]> {
    try {
      this.ensureCollection(collectionName);
      
      let results = [...this.mockDb[collectionName]];
      
      // Apply filters if any
      if (Object.keys(filter).length > 0) {
        results = results.filter(doc => {
          return Object.entries(filter).every(([key, value]) => {
            if (key === '_id' || key === 'id') {
              return doc._id === value || doc.id === value;
            }
            return doc[key] === value;
          });
        });
      }
      
      console.log(`[MongoDB] Queried documents from ${collectionName}:`, results.length);
      return results.map(doc => ({ ...doc }));
    } catch (error) {
      console.error(`[MongoDB] Error querying documents from ${collectionName}:`, error);
      return [];
    }
  }
  
  // Insert a document into a collection
  async insertDocument(collectionName: string, document: any): Promise<any> {
    try {
      this.ensureCollection(collectionName);
      
      const newId = document._id || document.id || this.generateId();
      const now = new Date().toISOString();
      
      const newDocument = {
        ...document,
        _id: newId,
        id: newId,
        createdAt: document.createdAt || now,
        updatedAt: document.updatedAt || now
      };
      
      this.mockDb[collectionName].push(newDocument);
      console.log(`[MongoDB] Inserted document in ${collectionName}:`, newDocument);
      
      return { ...newDocument };
    } catch (error) {
      console.error(`[MongoDB] Error inserting document into ${collectionName}:`, error);
      throw error;
    }
  }
  
  // Update a document
  async updateDocument(collectionName: string, id: string, update: any): Promise<any | null> {
    try {
      this.ensureCollection(collectionName);
      
      const index = this.mockDb[collectionName].findIndex(doc => 
        doc._id === id || doc.id === id
      );
      
      if (index === -1) {
        return null;
      }
      
      const currentDoc = this.mockDb[collectionName][index];
      const updatedDoc = {
        ...currentDoc,
        ...update,
        updatedAt: new Date().toISOString()
      };
      
      this.mockDb[collectionName][index] = updatedDoc;
      console.log(`[MongoDB] Updated document in ${collectionName}:`, updatedDoc);
      
      return { ...updatedDoc };
    } catch (error) {
      console.error(`[MongoDB] Error updating document in ${collectionName}:`, error);
      return null;
    }
  }
  
  // Delete a document
  async deleteDocument(collectionName: string, id: string): Promise<boolean> {
    try {
      this.ensureCollection(collectionName);
      
      const initialLength = this.mockDb[collectionName].length;
      this.mockDb[collectionName] = this.mockDb[collectionName].filter(doc => 
        doc._id !== id && doc.id !== id
      );
      
      const success = this.mockDb[collectionName].length < initialLength;
      console.log(`[MongoDB] Deleted document from ${collectionName}:`, success);
      return success;
    } catch (error) {
      console.error(`[MongoDB] Error deleting document from ${collectionName}:`, error);
      return false;
    }
  }

  // Helper method to ensure collection exists
  private ensureCollection(collectionName: string): void {
    if (!this.mockDb[collectionName]) {
      this.mockDb[collectionName] = [];
    }
  }
  
  // Helper method to generate a unique ID
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Add helper to check if we're using mock service
  isMockService(): boolean {
    return true;
  }
}

// Create a singleton instance
export const mongoApiService = new MongoApiService();

// Add API services for specific collections
export const postsApi = {
  getAll: async () => {
    return await mongoApiService.queryDocuments('posts', {});
  },
  
  getById: async (id: string) => {
    return await mongoApiService.getDocumentById('posts', id);
  },
  
  create: async (post: any) => {
    return await mongoApiService.insertDocument('posts', post);
  },
  
  update: async (id: string, post: any) => {
    return await mongoApiService.updateDocument('posts', id, post);
  },
  
  delete: async (id: string) => {
    return await mongoApiService.deleteDocument('posts', id);
  }
};

export const commentsApi = {
  getAll: async () => {
    return await mongoApiService.queryDocuments('comments', {});
  },
  
  getByPostId: async (postId: string) => {
    return await mongoApiService.queryDocuments('comments', { postId });
  },
  
  create: async (comment: any) => {
    return await mongoApiService.insertDocument('comments', comment);
  },
  
  update: async (id: string, comment: any) => {
    return await mongoApiService.updateDocument('comments', id, comment);
  },
  
  delete: async (id: string) => {
    return await mongoApiService.deleteDocument('comments', id);
  }
};

export const categoriesApi = {
  getAll: async () => {
    return await mongoApiService.queryDocuments('categories', {});
  },
  
  getById: async (id: string) => {
    return await mongoApiService.getDocumentById('categories', id);
  },
  
  create: async (category: any) => {
    return await mongoApiService.insertDocument('categories', category);
  },
  
  update: async (id: string, category: any) => {
    return await mongoApiService.updateDocument('categories', id, category);
  },
  
  delete: async (id: string) => {
    return await mongoApiService.deleteDocument('categories', id);
  }
};

export const topicsApi = {
  getAll: async () => {
    return await mongoApiService.queryDocuments('topics', {});
  },
  
  getById: async (id: string) => {
    return await mongoApiService.getDocumentById('topics', id);
  },
  
  create: async (topic: any) => {
    return await mongoApiService.insertDocument('topics', topic);
  },
  
  update: async (id: string, topic: any) => {
    return await mongoApiService.updateDocument('topics', id, topic);
  },
  
  delete: async (id: string) => {
    return await mongoApiService.deleteDocument('topics', id);
  }
};
