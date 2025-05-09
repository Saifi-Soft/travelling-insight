
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

// MongoDB connection class that works in both server and browser environments
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
    const uri = import.meta.env.VITE_MONGODB_URI || 'mongodb+srv://saifibadshah10:2Fjs34snjd56p9@your-cluster.mongodb.net';
    const dbName = import.meta.env.VITE_DB_NAME || 'travel_blog';

    try {
      console.log('[MongoDB] Connecting to MongoDB Atlas...');
      
      this.connectionPromise = new Promise(async (resolve, reject) => {
        try {
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
        } catch (error) {
          console.error('[MongoDB] Error connecting to MongoDB:', error);
          this.isConnected = false;
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

    return this.db.collection(collectionName);
  }

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
      return await collection.insertOne(document);
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
