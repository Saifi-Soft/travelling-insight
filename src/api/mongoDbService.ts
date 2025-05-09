
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

// MongoDB connection class
class MongoDbService {
  private client: MongoClient | null = null;
  private db: any = null;
  private isConnected = false;

  constructor() {
    this.connect();
  }

  async connect() {
    try {
      if (this.isConnected) {
        return { client: this.client, db: this.db };
      }

      const uri = import.meta.env.VITE_MONGODB_URI || process.env.MONGODB_URI;
      const dbName = import.meta.env.VITE_DB_NAME || process.env.DB_NAME;

      if (!uri) {
        console.error('MongoDB URI is not defined');
        throw new Error('MongoDB URI is not defined');
      }

      console.log('Connecting to MongoDB...');
      this.client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });

      await this.client.connect();
      this.db = this.client.db(dbName || 'travel_blog');
      this.isConnected = true;

      console.log('Connected to MongoDB successfully');
      return { client: this.client, db: this.db };
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      this.client = null;
      this.db = null;
      console.log('Disconnected from MongoDB');
    }
  }

  async getCollection(collectionName: string) {
    if (!this.isConnected) {
      await this.connect();
    }
    return this.db.collection(collectionName);
  }

  async findOne(collectionName: string, filter: object) {
    const collection = await this.getCollection(collectionName);
    return await collection.findOne(filter);
  }

  async find(collectionName: string, filter: object = {}) {
    const collection = await this.getCollection(collectionName);
    return await collection.find(filter).toArray();
  }

  async insertOne(collectionName: string, document: object) {
    const collection = await this.getCollection(collectionName);
    return await collection.insertOne(document);
  }

  async updateOne(collectionName: string, filter: object, update: object) {
    const collection = await this.getCollection(collectionName);
    return await collection.updateOne(filter, update);
  }

  async deleteOne(collectionName: string, filter: object) {
    const collection = await this.getCollection(collectionName);
    return await collection.deleteOne(filter);
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
