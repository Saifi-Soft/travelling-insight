
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import { toast } from 'sonner';

// MongoDB connection class that uses Node.js MongoDB driver
class MongoDbService {
  private client: MongoClient | null = null;
  private db: any = null;
  private isConnected = false;
  private connectionPromise: Promise<any> | null = null;

  // Connect to MongoDB
  async connect() {
    // If already connected or in process of connecting, return existing promise
    if (this.isConnected) {
      return { client: this.client, db: this.db };
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // Get MongoDB URI from environment variables
    const uri = import.meta.env.VITE_MONGODB_URI || 'mongodb+srv://saifibadshah10:2Fjs34snjd56p9@travellinginsight.3fl6dwk.mongodb.net/';
    const dbName = import.meta.env.VITE_DB_NAME || 'travel_blog';

    try {
      console.log('[MongoDB] Connecting to MongoDB Atlas...');
      console.log('[MongoDB] Using URI:', uri);
      
      this.connectionPromise = new Promise(async (resolve, reject) => {
        try {
          // For server-side usage in Node.js
          if (typeof window === 'undefined') {
            const client = new MongoClient(uri, {
              serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
              }
            });

            await client.connect();
            console.log('[MongoDB] Connected to MongoDB Atlas');

            const db = client.db(dbName);
            this.client = client;
            this.db = db;
            this.isConnected = true;

            resolve({ client, db });
          } else {
            // For browser environment, use a mock implementation
            console.log('[MongoDB] Browser environment detected, using mock implementation');
            
            // Initialize mock DB if needed
            if (!(window as any).mockDb) {
              (window as any).mockDb = {};
            }
            
            this.isConnected = true;
            resolve({ mockDb: (window as any).mockDb });
            
            // Warning for development
            console.warn('[MongoDB] Using mock MongoDB implementation in browser. Real MongoDB connections require server-side code.');
            toast.warning('Using mock database in browser environment', {
              duration: 5000,
            });
          }
        } catch (error) {
          console.error('[MongoDB] Error connecting to MongoDB:', error);
          this.isConnected = false;
          toast.error('Failed to connect to database. Some features may not work correctly.');
          reject(error);
        }
      });

      return this.connectionPromise;
    } catch (error) {
      console.error('[MongoDB] Connection error:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      this.isConnected = false;
      this.connectionPromise = null;
      console.log('[MongoDB] Disconnected from MongoDB');
    }
  }

  async getCollection(collectionName: string) {
    if (!this.isConnected) {
      await this.connect();
    }

    // Handle both real MongoDB and mock implementation
    if (typeof window === 'undefined' && this.db) {
      return this.db.collection(collectionName);
    } else {
      // Mock collection for browser
      if (!(window as any).mockDb[collectionName]) {
        (window as any).mockDb[collectionName] = [];
      }
      return {
        findOne: async (filter: any) => this.mockFindOne(collectionName, filter),
        find: () => ({ toArray: async () => this.mockFind(collectionName, {}) }),
        insertOne: async (doc: any) => this.mockInsertOne(collectionName, doc),
        updateOne: async (filter: any, update: any) => this.mockUpdateOne(collectionName, filter, update),
        deleteOne: async (filter: any) => this.mockDeleteOne(collectionName, filter),
        countDocuments: async () => (window as any).mockDb[collectionName].length,
      };
    }
  }
  
  // Mock implementations for browser environment
  private async mockFindOne(collectionName: string, filter: any) {
    try {
      const docs = (window as any).mockDb[collectionName] || [];
      return docs.find((doc: any) => {
        return Object.keys(filter).every(key => {
          if (key === '_id') {
            return doc._id?.toString() === filter[key]?.toString();
          }
          return doc[key] === filter[key];
        });
      });
    } catch (error) {
      console.error(`[MockDB] findOne error for ${collectionName}:`, error);
      return null;
    }
  }
  
  private async mockFind(collectionName: string, filter: any = {}) {
    try {
      const docs = (window as any).mockDb[collectionName] || [];
      if (Object.keys(filter).length === 0) {
        return [...docs]; // Return a copy to prevent mutations
      }
      
      return docs.filter((doc: any) => {
        return Object.keys(filter).every(key => {
          if (key === '_id') {
            return doc._id?.toString() === filter[key]?.toString();
          }
          return doc[key] === filter[key];
        });
      });
    } catch (error) {
      console.error(`[MockDB] find error for ${collectionName}:`, error);
      return [];
    }
  }
  
  private async mockInsertOne(collectionName: string, document: any) {
    try {
      const _id = document._id || new ObjectId().toString();
      const newDoc = { ...document, _id };
      (window as any).mockDb[collectionName].push(newDoc);
      
      return { insertedId: _id };
    } catch (error) {
      console.error(`[MockDB] insertOne error for ${collectionName}:`, error);
      throw error;
    }
  }
  
  private async mockUpdateOne(collectionName: string, filter: any, update: any) {
    try {
      let modifiedCount = 0;
      (window as any).mockDb[collectionName] = (window as any).mockDb[collectionName].map((doc: any) => {
        const isMatch = Object.keys(filter).every(key => {
          if (key === '_id') {
            return doc._id?.toString() === filter[key]?.toString();
          }
          return doc[key] === filter[key];
        });
        
        if (isMatch) {
          modifiedCount++;
          const updateData = update.$set || update;
          return { ...doc, ...updateData };
        }
        
        return doc;
      });
      
      return { modifiedCount };
    } catch (error) {
      console.error(`[MockDB] updateOne error for ${collectionName}:`, error);
      throw error;
    }
  }
  
  private async mockDeleteOne(collectionName: string, filter: any) {
    try {
      const initialLength = (window as any).mockDb[collectionName].length;
      (window as any).mockDb[collectionName] = (window as any).mockDb[collectionName].filter((doc: any) => {
        return !Object.keys(filter).every(key => {
          if (key === '_id') {
            return doc._id?.toString() === filter[key]?.toString();
          }
          return doc[key] === filter[key];
        });
      });
      
      const deletedCount = initialLength - (window as any).mockDb[collectionName].length;
      return { deletedCount };
    } catch (error) {
      console.error(`[MockDB] deleteOne error for ${collectionName}:`, error);
      throw error;
    }
  }

  // Normal operations that work in both environments
  async findOne(collectionName: string, filter: object) {
    try {
      const collection = await this.getCollection(collectionName);
      return await collection.findOne(filter);
    } catch (error) {
      console.error(`[MongoDB] Error in findOne operation for ${collectionName}:`, error);
      return null;
    }
  }

  async find(collectionName: string, filter: object = {}) {
    try {
      const collection = await this.getCollection(collectionName);
      return await collection.find(filter).toArray();
    } catch (error) {
      console.error(`[MongoDB] Error in find operation for ${collectionName}:`, error);
      return [];
    }
  }

  async insertOne(collectionName: string, document: object) {
    try {
      const collection = await this.getCollection(collectionName);
      const result = await collection.insertOne(document);
      return { ...document, _id: result.insertedId };
    } catch (error) {
      console.error(`[MongoDB] Error in insertOne operation for ${collectionName}:`, error);
      throw error;
    }
  }

  async updateOne(collectionName: string, filter: object, update: object) {
    try {
      const collection = await this.getCollection(collectionName);
      return await collection.updateOne(filter, { $set: update });
    } catch (error) {
      console.error(`[MongoDB] Error in updateOne operation for ${collectionName}:`, error);
      throw error;
    }
  }

  async deleteOne(collectionName: string, filter: object) {
    try {
      const collection = await this.getCollection(collectionName);
      return await collection.deleteOne(filter);
    } catch (error) {
      console.error(`[MongoDB] Error in deleteOne operation for ${collectionName}:`, error);
      throw error;
    }
  }

  // Count documents in a collection
  async countDocuments(collectionName: string, filter: object = {}) {
    try {
      const collection = await this.getCollection(collectionName);
      return await collection.countDocuments(filter);
    } catch (error) {
      console.error(`[MongoDB] Error in countDocuments operation for ${collectionName}:`, error);
      return 0;
    }
  }

  // Utility to convert string IDs to MongoDB ObjectId
  toObjectId(id: string) {
    try {
      return new ObjectId(id);
    } catch (error) {
      console.error(`Invalid ObjectId: ${id}`);
      throw new Error(`Invalid ObjectId: ${id}`);
    }
  }
}

// Create a singleton instance
export const mongoDbService = new MongoDbService();
