
// MongoDB service for browser environments
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Generic DB document type that can be used throughout the application
export interface DbDocument {
  _id?: string;
  id?: string;
  [key: string]: any;
}

// Result of database operations
export interface DbOperationResult {
  success: boolean;
  message?: string;
  data?: any;
  modifiedCount?: number;
  deletedCount?: number;
}

// MongoDB service class
export class MongoDbService {
  private storage: { [collectionName: string]: DbDocument[] } = {};
  private isConnected: boolean = false;

  constructor() {
    // Initialize the storage if running in browser
    this.initStorage();
  }

  private initStorage() {
    if (typeof window !== 'undefined') {
      if (!(window as any).dbStorage) {
        (window as any).dbStorage = {};
        console.log('Browser database storage initialized');
      }
      this.storage = (window as any).dbStorage;
    }
  }

  // Connect to the MongoDB (in browser environment, this just initializes the storage)
  async connect(): Promise<boolean> {
    try {
      console.log('Initializing browser-based MongoDB service...');
      
      if (this.isConnected) {
        console.log('MongoDB service already connected');
        return true;
      }

      // Initialize collections if they don't exist
      const defaultCollections = [
        'posts', 
        'comments', 
        'categories', 
        'topics', 
        'settings',
        'communityEvents',
        'users',
        'communityPosts'
      ];

      for (const collection of defaultCollections) {
        if (!this.storage[collection]) {
          this.storage[collection] = [];
        }
      }
      
      this.isConnected = true;
      console.log('MongoDB service initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing MongoDB service:', error);
      return false;
    }
  }

  // Disconnect from MongoDB (in browser environment, this just clears some state)
  async disconnect(): Promise<boolean> {
    try {
      this.isConnected = false;
      console.log('MongoDB service disconnected');
      return true;
    } catch (error) {
      console.error('Error disconnecting MongoDB service:', error);
      return false;
    }
  }

  // Check if connected
  async isConnectedToDb(): Promise<boolean> {
    return this.isConnected;
  }

  // Generic find method to retrieve documents from a collection
  async find(collectionName: string, query: any = {}): Promise<DbDocument[]> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      const collection = this.storage[collectionName] || [];

      if (Object.keys(query).length === 0) {
        return collection;
      }

      // Simple query matching
      return collection.filter(doc => 
        Object.entries(query).every(([key, value]) => doc[key] === value)
      );
    } catch (error) {
      console.error(`Error finding documents in ${collectionName}:`, error);
      return [];
    }
  }

  // Find a single document
  async findOne(collectionName: string, query: any): Promise<DbDocument | null> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      const collection = this.storage[collectionName] || [];
      
      // Simple query matching for the first matching document
      const result = collection.find(doc => 
        Object.entries(query).every(([key, value]) => doc[key] === value)
      );

      return result || null;
    } catch (error) {
      console.error(`Error finding document in ${collectionName}:`, error);
      return null;
    }
  }

  // Insert a document
  async insertOne(collectionName: string, document: any): Promise<DbOperationResult> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      if (!this.storage[collectionName]) {
        this.storage[collectionName] = [];
      }

      // Generate a unique ID if not provided
      if (!document._id && !document.id) {
        document._id = uuidv4();
        document.id = document._id;
      } else if (document._id && !document.id) {
        document.id = document._id;
      } else if (!document._id && document.id) {
        document._id = document.id;
      }

      // Add creation timestamp if not provided
      if (!document.createdAt) {
        document.createdAt = new Date().toISOString();
      }

      this.storage[collectionName].push(document);
      
      console.log(`Document inserted into ${collectionName}:`, document);
      
      return {
        success: true,
        message: 'Document inserted successfully',
        data: document
      };
    } catch (error) {
      console.error(`Error inserting document into ${collectionName}:`, error);
      return {
        success: false,
        message: `Error: ${(error as Error).message}`
      };
    }
  }

  // Update a document
  async updateOne(collectionName: string, filter: any, update: any): Promise<DbOperationResult> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      if (!this.storage[collectionName]) {
        return {
          success: false,
          message: `Collection ${collectionName} does not exist`,
          modifiedCount: 0
        };
      }

      const collection = this.storage[collectionName];
      let modifiedCount = 0;

      for (let i = 0; i < collection.length; i++) {
        const doc = collection[i];
        
        // Check if document matches filter
        const isMatch = Object.entries(filter).every(([key, value]) => doc[key] === value);
        
        if (isMatch) {
          // Apply updates
          const updatedDoc = { ...doc, ...update, updatedAt: new Date().toISOString() };
          collection[i] = updatedDoc;
          modifiedCount++;
          break; // Only update the first matching document
        }
      }

      return {
        success: true,
        message: 'Document updated successfully',
        modifiedCount
      };
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      return {
        success: false,
        message: `Error: ${(error as Error).message}`,
        modifiedCount: 0
      };
    }
  }

  // Delete a document
  async deleteOne(collectionName: string, filter: any): Promise<DbOperationResult> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      if (!this.storage[collectionName]) {
        return {
          success: false,
          message: `Collection ${collectionName} does not exist`,
          deletedCount: 0
        };
      }

      const collection = this.storage[collectionName];
      const initialLength = collection.length;

      // Find the index of the document to delete
      const indexToDelete = collection.findIndex(doc =>
        Object.entries(filter).every(([key, value]) => doc[key] === value)
      );

      if (indexToDelete !== -1) {
        // Remove the document at the found index
        collection.splice(indexToDelete, 1);
      }

      const deletedCount = initialLength - collection.length;

      return {
        success: true,
        message: 'Document deleted successfully',
        deletedCount
      };
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      return {
        success: false,
        message: `Error: ${(error as Error).message}`,
        deletedCount: 0
      };
    }
  }

  // Clear a collection
  async clearCollection(collectionName: string): Promise<DbOperationResult> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      if (!this.storage[collectionName]) {
        this.storage[collectionName] = [];
        return {
          success: true,
          message: `Collection ${collectionName} created and is empty`,
          deletedCount: 0
        };
      }

      const deletedCount = this.storage[collectionName].length;
      this.storage[collectionName] = [];

      return {
        success: true,
        message: `Collection ${collectionName} cleared successfully`,
        deletedCount
      };
    } catch (error) {
      console.error(`Error clearing collection ${collectionName}:`, error);
      return {
        success: false,
        message: `Error: ${(error as Error).message}`,
        deletedCount: 0
      };
    }
  }

  // Seed a collection with initial data if empty
  async seedCollection(collectionName: string, data: any[]): Promise<DbOperationResult> {
    try {
      if (!this.isConnected) {
        await this.connect();
      }

      if (!this.storage[collectionName]) {
        this.storage[collectionName] = [];
      }

      // Only seed if the collection is empty
      if (this.storage[collectionName].length === 0) {
        // Generate IDs for each document if needed
        const dataWithIds = data.map(item => {
          if (!item._id && !item.id) {
            const id = uuidv4();
            return { ...item, _id: id, id };
          } else if (item._id && !item.id) {
            return { ...item, id: item._id };
          } else if (!item._id && item.id) {
            return { ...item, _id: item.id };
          }
          return item;
        });

        this.storage[collectionName] = dataWithIds;
        
        return {
          success: true,
          message: `Collection ${collectionName} seeded with ${data.length} documents`,
          data: dataWithIds
        };
      }

      return {
        success: true,
        message: `Collection ${collectionName} already contains data, skipping seed`,
        data: this.storage[collectionName]
      };
    } catch (error) {
      console.error(`Error seeding collection ${collectionName}:`, error);
      return {
        success: false,
        message: `Error: ${(error as Error).message}`
      };
    }
  }

  // Utility for query operations
  async queryDocuments(collectionName: string, query: any): Promise<DbDocument[]> {
    return this.find(collectionName, query);
  }
}

// Create a singleton instance
export const mongoDbService = new MongoDbService();
