import { MongoOperators, Post, Category, Topic, Comment } from '@/types/common';
import { toast } from 'sonner';

// Type definitions for our API functions
// We'll use interfaces that match our common types but with optional IDs
// since MongoDB will assign IDs

// Simulated MongoDB collections
const collections: Record<string, any[]> = {
  posts: [],
  comments: [],
  users: [],
  topics: [],
  categories: [],
  communityUsers: [],
  subscriptions: [],
  travelGroups: [],
  travelMatches: [],
  communityEvents: [],
  adminUsers: []
};

// Generate a mock ObjectId
const generateObjectId = () => {
  const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
    return (Math.random() * 16 | 0).toString(16);
  }).toLowerCase();
};

// Simple in-memory MongoDB-like API service
class MongoApiService {
  // Insert a document into a collection
  async insertDocument(collectionName: string, document: any): Promise<any> {
    try {
      if (!collections[collectionName]) {
        collections[collectionName] = [];
      }
      
      // Generate an ID if one doesn't exist
      const id = document.id || generateObjectId();
      
      const newDocument = {
        ...document,
        id: id,
        _id: id, // Keep both id and _id for compatibility
        createdAt: document.createdAt || new Date(),
        updatedAt: document.updatedAt || new Date()
      };
      
      collections[collectionName].push(newDocument);
      console.log(`[MongoDB] Inserted document in ${collectionName}:`, newDocument);
      return newDocument;
    } catch (error) {
      console.error(`[MongoDB] Error inserting document into ${collectionName}:`, error);
      throw error;
    }
  }
  
  // Get a document by ID
  async getDocumentById(collectionName: string, id: string): Promise<any | null> {
    try {
      if (!collections[collectionName]) {
        return null;
      }
      
      const document = collections[collectionName].find(doc => doc.id === id || doc._id === id);
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
      if (!collections[collectionName]) {
        return null;
      }
      
      const index = collections[collectionName].findIndex(doc => doc.id === id || doc._id === id);
      if (index === -1) {
        return null;
      }
      
      const updatedDocument = {
        ...collections[collectionName][index],
        ...update,
        updatedAt: new Date()
      };
      
      collections[collectionName][index] = updatedDocument;
      console.log(`[MongoDB] Updated document in ${collectionName}:`, updatedDocument);
      return updatedDocument;
    } catch (error) {
      console.error(`[MongoDB] Error updating document in ${collectionName}:`, error);
      return null;
    }
  }
  
  // Delete a document
  async deleteDocument(collectionName: string, id: string): Promise<boolean> {
    try {
      if (!collections[collectionName]) {
        return false;
      }
      
      const initialLength = collections[collectionName].length;
      collections[collectionName] = collections[collectionName].filter(doc => doc.id !== id && doc._id !== id);
      
      const success = collections[collectionName].length < initialLength;
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
      if (!collections[collectionName]) {
        collections[collectionName] = []; // Initialize collection if it doesn't exist
      }
      
      // Simple filtering (not supporting complex MongoDB queries)
      const results = collections[collectionName].filter(doc => {
        return Object.entries(filter).every(([key, value]) => {
          if (typeof value === 'object' && value !== null && Object.keys(value).some(k => k.startsWith('$'))) {
            // Handle MongoDB operators like $gt, $lt, etc.
            return this.handleOperators(doc[key], value);
          }
          return doc[key] === value;
        });
      });
      
      console.log(`[MongoDB] Queried documents from ${collectionName}:`, results.length);
      return [...results]; // Return a copy to prevent mutation
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
  
  // Handle MongoDB operators
  private handleOperators(fieldValue: any, operators: any): boolean {
    try {
      // Handle $gt operator
      if ('$gt' in operators && !(fieldValue > operators.$gt)) {
        return false;
      }
      
      // Handle $gte operator
      if ('$gte' in operators && !(fieldValue >= operators.$gte)) {
        return false;
      }
      
      // Handle $lt operator
      if ('$lt' in operators && !(fieldValue < operators.$lt)) {
        return false;
      }
      
      // Handle $lte operator
      if ('$lte' in operators && !(fieldValue <= operators.$lte)) {
        return false;
      }
      
      // Handle $eq operator
      if ('$eq' in operators && fieldValue !== operators.$eq) {
        return false;
      }
      
      // Handle $ne operator
      if ('$ne' in operators && fieldValue === operators.$ne) {
        return false;
      }
      
      // Handle $in operator for arrays
      if ('$in' in operators) {
        const inArray = operators.$in as any[];
        if (!inArray.includes(fieldValue)) {
          return false;
        }
      }
      
      // Handle $nin operator for arrays
      if ('$nin' in operators) {
        const ninArray = operators.$nin as any[];
        if (ninArray.includes(fieldValue)) {
          return false;
        }
      }
      
      // Handle $exists operator
      if ('$exists' in operators) {
        const shouldExist = operators.$exists;
        const doesExist = fieldValue !== undefined && fieldValue !== null;
        
        if (shouldExist !== doesExist) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('[MongoDB] Error handling operators:', error);
      return false;
    }
  }
}

export const mongoApiService = new MongoApiService();

// Initialize collections with sample data
export const initializeCollectionsWithSampleData = async (
  mockPosts: Post[],
  mockCategories: Category[],
  mockTopics: Topic[]
) => {
  try {
    // Check if posts collection is empty and initialize with sample data if it is
    if (collections.posts.length === 0 && mockPosts.length > 0) {
      collections.posts = mockPosts.map(post => ({
        ...post,
        id: post.id || generateObjectId(),
        _id: post.id || generateObjectId(), // Keep both id and _id for compatibility
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      console.log('[MongoDB] Initialized posts collection with sample data');
    }

    // Check if categories collection is empty and initialize with sample data if it is
    if (collections.categories.length === 0 && mockCategories.length > 0) {
      collections.categories = mockCategories.map(category => ({
        ...category,
        id: category.id || generateObjectId(),
        _id: category.id || generateObjectId(), // Keep both id and _id for compatibility
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      console.log('[MongoDB] Initialized categories collection with sample data');
    }

    // Check if topics collection is empty and initialize with sample data if it is
    if (collections.topics.length === 0 && mockTopics.length > 0) {
      collections.topics = mockTopics.map(topic => ({
        ...topic,
        id: topic.id || generateObjectId(),
        _id: topic.id || generateObjectId(), // Keep both id and _id for compatibility
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      console.log('[MongoDB] Initialized topics collection with sample data');
    }
  } catch (error) {
    console.error('[MongoDB] Error initializing collections with sample data:', error);
    throw error;
  }
};

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
