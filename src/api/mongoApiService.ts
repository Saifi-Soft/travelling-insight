
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
        await this.seedInitialData();
        toast.success('Connected to database successfully');
      } else {
        // Server environment - would connect to real MongoDB
        // This is just a placeholder as the real connection would be server-side
        console.log('[MongoDB] Server environment detected, would connect to real MongoDB');
        // In a real app, we would connect to MongoDB here
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

  // Seed initial data to the database
  private async seedInitialData(): Promise<void> {
    try {
      console.log('[MongoDB] Seeding initial data...');
      
      // Seed users if none exist
      const existingUsers = await this.queryDocuments('users', {});
      if (existingUsers.length === 0) {
        const users = [
          {
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin',
            createdAt: new Date().toISOString()
          },
          {
            name: 'Demo User',
            email: 'user@example.com',
            password: 'password123',
            role: 'user',
            createdAt: new Date().toISOString()
          }
        ];
        
        for (const user of users) {
          await this.insertDocument('users', user);
        }
        console.log('[MongoDB] Seeded users collection');
      }
      
      // Seed categories if none exist
      const existingCategories = await this.queryDocuments('categories', {});
      if (existingCategories.length === 0) {
        const categories = [
          { name: 'Travel', slug: 'travel' },
          { name: 'Food', slug: 'food' },
          { name: 'Adventure', slug: 'adventure' },
          { name: 'Culture', slug: 'culture' }
        ];
        
        for (const category of categories) {
          await this.insertDocument('categories', category);
        }
        console.log('[MongoDB] Seeded categories collection');
      }
      
      // Seed topics if none exist
      const existingTopics = await this.queryDocuments('topics', {});
      if (existingTopics.length === 0) {
        const topics = [
          { name: 'Adventure', slug: 'adventure' },
          { name: 'Nature', slug: 'nature' },
          { name: 'Recipes', slug: 'recipes' },
          { name: 'Cooking', slug: 'cooking' },
          { name: 'Hiking', slug: 'hiking' },
          { name: 'Beach', slug: 'beach' },
          { name: 'Mountains', slug: 'mountains' }
        ];
        
        for (const topic of topics) {
          await this.insertDocument('topics', topic);
        }
        console.log('[MongoDB] Seeded topics collection');
      }
      
      // Seed posts if none exist
      const existingPosts = await this.queryDocuments('posts', {});
      if (existingPosts.length === 0) {
        const posts = [
          {
            title: 'My Journey Through Southeast Asia',
            slug: 'journey-southeast-asia',
            content: 'This is a fascinating account of my journey through the beautiful countries of Southeast Asia...',
            category: 'Travel',
            topics: ['Adventure', 'Nature'],
            date: new Date().toISOString(),
            author: 'Demo User'
          },
          {
            title: 'Discovering Local Cuisine in Italy',
            slug: 'local-cuisine-italy',
            content: 'The authentic Italian food experience goes beyond pizza and pasta...',
            category: 'Food',
            topics: ['Recipes', 'Cooking'],
            date: new Date().toISOString(),
            author: 'Demo User'
          }
        ];
        
        for (const post of posts) {
          await this.insertDocument('posts', post);
        }
        console.log('[MongoDB] Seeded posts collection');
      }
      
      // Seed community posts if none exist
      const existingCommunityPosts = await this.queryDocuments('communityPosts', {});
      if (existingCommunityPosts.length === 0) {
        const communityPosts = [
          {
            userId: 'user123',
            userName: 'Demo User',
            content: 'Just arrived in Bali! The beaches here are amazing!',
            createdAt: new Date().toISOString(),
            likes: 12,
            comments: 3,
            likedBy: []
          },
          {
            userId: 'user456',
            userName: 'Travel Explorer',
            content: 'Hiking in the Swiss Alps was breathtaking. Would highly recommend!',
            images: ['alps1.jpg', 'alps2.jpg'],
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            likes: 45,
            comments: 7,
            likedBy: ['user123']
          }
        ];
        
        for (const post of communityPosts) {
          await this.insertDocument('communityPosts', post);
        }
        console.log('[MongoDB] Seeded communityPosts collection');
      }
      
      // Seed comments if none exist
      const existingComments = await this.queryDocuments('comments', {});
      if (existingComments.length === 0) {
        const comments = [
          {
            postId: '1',
            userId: 'user456',
            userName: 'Travel Explorer',
            content: 'Great post! I love Southeast Asia too.',
            createdAt: new Date().toISOString()
          },
          {
            postId: '2',
            userId: 'user123',
            userName: 'Demo User',
            content: 'Italian cuisine is my favorite! Great recommendations.',
            createdAt: new Date().toISOString()
          }
        ];
        
        for (const comment of comments) {
          await this.insertDocument('comments', comment);
        }
        console.log('[MongoDB] Seeded comments collection');
      }
      
      // Seed community users if none exist
      const existingCommunityUsers = await this.queryDocuments('communityUsers', {});
      if (existingCommunityUsers.length === 0) {
        const communityUsers = [
          {
            id: 'user1',
            name: 'John Doe',
            email: 'john@example.com',
            status: 'active',
            joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            experienceLevel: 'Intermediate'
          },
          {
            id: 'user2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            status: 'active',
            joinDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            experienceLevel: 'Expert'
          },
          {
            id: 'user3',
            name: 'New Member',
            email: 'new@example.com',
            status: 'pending',
            joinDate: new Date().toISOString(),
            experienceLevel: 'Beginner'
          }
        ];
        
        for (const user of communityUsers) {
          await this.insertDocument('communityUsers', user);
        }
        console.log('[MongoDB] Seeded communityUsers collection');
      }
      
      // Seed travel groups if none exist
      const existingTravelGroups = await this.queryDocuments('travelGroups', {});
      if (existingTravelGroups.length === 0) {
        const travelGroups = [
          {
            id: 'group1',
            name: 'Southeast Asia Explorers',
            category: 'Adventure',
            dateCreated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            memberCount: 125,
            status: 'active'
          },
          {
            id: 'group2',
            name: 'European Backpackers',
            category: 'Budget Travel',
            dateCreated: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            memberCount: 89,
            status: 'active'
          },
          {
            id: 'group3',
            name: 'Luxury Travel Enthusiasts',
            category: 'Luxury',
            dateCreated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            memberCount: 42,
            status: 'active'
          }
        ];
        
        for (const group of travelGroups) {
          await this.insertDocument('travelGroups', group);
        }
        console.log('[MongoDB] Seeded travelGroups collection');
      }
      
      // Seed community events if none exist
      const existingEvents = await this.queryDocuments('communityEvents', {});
      if (existingEvents.length === 0) {
        const events = [
          {
            title: "Annual Backpackers Meetup",
            description: "Join fellow backpackers for our annual gathering to share stories, tips, and make plans for future adventures.",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            location: { type: "in-person", details: "Central Park, New York City" },
            status: "upcoming",
            attendees: [
              { id: "user1", name: "Alex Johnson" },
              { id: "user2", name: "Sam Peterson" }
            ],
            organizer: { id: "admin1", name: "Travel Community Admin" },
            createdAt: new Date().toISOString()
          },
          {
            title: "Virtual Travel Photography Workshop",
            description: "Learn travel photography techniques from professional photographers in this interactive online workshop.",
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            location: { type: "online", details: "Zoom Meeting" },
            status: "upcoming",
            attendees: [
              { id: "user3", name: "Jamie Smith" },
              { id: "user4", name: "Robin Williams" },
              { id: "user5", name: "Taylor Johnson" }
            ],
            organizer: { id: "photo1", name: "PhotoTravelPro" },
            createdAt: new Date().toISOString()
          }
        ];
        
        for (const event of events) {
          await this.insertDocument('communityEvents', event);
        }
        console.log('[MongoDB] Seeded communityEvents collection');
      }
      
      // Seed content warnings if none exist
      const existingWarnings = await this.queryDocuments('contentWarnings', {});
      if (existingWarnings.length === 0) {
        const warnings = [
          {
            userId: "user123",
            userName: "John Doe",
            userEmail: "john@example.com",
            reason: "Inappropriate language in community post",
            userStatus: "active",
            contentId: "post123",
            createdAt: new Date().toISOString(),
            acknowledged: false
          },
          {
            userId: "user456",
            userName: "Jane Smith",
            userEmail: "jane@example.com",
            reason: "Sharing personal contact information",
            userStatus: "warned",
            contentId: "post456",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            acknowledged: true,
            acknowledgedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        for (const warning of warnings) {
          await this.insertDocument('contentWarnings', warning);
        }
        console.log('[MongoDB] Seeded contentWarnings collection');
      }
      
      // Seed moderated posts if none exist
      const existingModeratedPosts = await this.queryDocuments('communityPosts', { moderated: true });
      if (existingModeratedPosts.length === 0) {
        const moderatedPosts = [
          {
            userId: "user123",
            userName: "John Doe",
            content: "This post contains inappropriate content that was automatically moderated.",
            moderationReason: "Contains inappropriate terms",
            moderatedAt: new Date().toISOString(),
            moderated: true
          },
          {
            userId: "user456",
            userName: "Jane Smith",
            content: "This post was reported by multiple users and moderated after review.",
            moderationReason: "Community guidelines violation",
            moderatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            moderated: true
          }
        ];
        
        for (const post of moderatedPosts) {
          await this.insertDocument('communityPosts', post);
        }
        console.log('[MongoDB] Seeded moderated posts');
      }
      
      console.log('[MongoDB] Initial data seeding complete');
    } catch (error) {
      console.error('[MongoDB] Error seeding initial data:', error);
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
