
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

    // For browser environments, use a proxy API endpoint
    if (typeof window !== 'undefined') {
      console.log('Browser environment detected, using proxy for MongoDB operations');
      this.isConnected = true;
      return { client: null, db: null };
    }

    // For server environments (Node.js), directly connect to MongoDB
    const uri = process.env.VITE_MONGODB_URI || 'mongodb+srv://saifibadshah10:2Fjs34snjd56p9@your-cluster.mongodb.net';
    const dbName = process.env.VITE_DB_NAME || 'travel_blog';

    try {
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
          console.log('Connected to MongoDB Atlas');

          const db = client.db(dbName);
          this.client = client;
          this.db = db;
          this.isConnected = true;

          resolve({ client, db });
        } catch (error) {
          console.error('Error connecting to MongoDB:', error);
          this.isConnected = false;
          reject(error);
        }
      });

      return this.connectionPromise;
    } catch (error) {
      console.error('MongoDB connection error:', error);
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
      console.log('Disconnected from MongoDB');
    }
  }

  async getCollection(collectionName: string) {
    if (!this.isConnected) {
      await this.connect();
    }

    if (typeof window !== 'undefined') {
      // In browser, return mock collection that will forward requests to API
      return {
        findOne: (filter: any) => this.findOne(collectionName, filter),
        find: (filter: any = {}) => ({
          toArray: () => this.find(collectionName, filter)
        }),
        insertOne: (doc: any) => this.insertOne(collectionName, doc),
        updateOne: (filter: any, update: any) => this.updateOne(collectionName, filter, update),
        deleteOne: (filter: any) => this.deleteOne(collectionName, filter),
        countDocuments: (filter: any = {}) => this.countDocuments(collectionName, filter)
      };
    }

    // Direct MongoDB access on server
    return this.db.collection(collectionName);
  }

  async findOne(collectionName: string, filter: object) {
    try {
      if (typeof window !== 'undefined') {
        const response = await fetch(`/api/db/${collectionName}/findOne`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filter })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      }

      // Direct DB access
      const collection = await this.getCollection(collectionName);
      return await collection.findOne(filter);
    } catch (error) {
      console.error(`Error in findOne operation for ${collectionName}:`, error);
      return null;
    }
  }

  async find(collectionName: string, filter: object = {}) {
    try {
      if (typeof window !== 'undefined') {
        const response = await fetch(`/api/db/${collectionName}/find`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filter })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      }

      // Direct DB access
      const collection = await this.getCollection(collectionName);
      return await collection.find(filter).toArray();
    } catch (error) {
      console.error(`Error in find operation for ${collectionName}:`, error);
      return [];
    }
  }

  async insertOne(collectionName: string, document: object) {
    try {
      if (typeof window !== 'undefined') {
        const response = await fetch(`/api/db/${collectionName}/insertOne`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ document })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      }

      // Direct DB access
      const collection = await this.getCollection(collectionName);
      return await collection.insertOne(document);
    } catch (error) {
      console.error(`Error in insertOne operation for ${collectionName}:`, error);
      throw error;
    }
  }

  async updateOne(collectionName: string, filter: object, update: object) {
    try {
      if (typeof window !== 'undefined') {
        const response = await fetch(`/api/db/${collectionName}/updateOne`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filter, update })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      }

      // Direct DB access
      const collection = await this.getCollection(collectionName);
      return await collection.updateOne(filter, update);
    } catch (error) {
      console.error(`Error in updateOne operation for ${collectionName}:`, error);
      throw error;
    }
  }

  async deleteOne(collectionName: string, filter: object) {
    try {
      if (typeof window !== 'undefined') {
        const response = await fetch(`/api/db/${collectionName}/deleteOne`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filter })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      }

      // Direct DB access
      const collection = await this.getCollection(collectionName);
      return await collection.deleteOne(filter);
    } catch (error) {
      console.error(`Error in deleteOne operation for ${collectionName}:`, error);
      throw error;
    }
  }

  // Count documents in a collection
  async countDocuments(collectionName: string, filter: object = {}) {
    try {
      if (typeof window !== 'undefined') {
        const response = await fetch(`/api/db/${collectionName}/count`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filter })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result.count;
      }

      // Direct DB access
      const collection = await this.getCollection(collectionName);
      return await collection.countDocuments(filter);
    } catch (error) {
      console.error(`Error in countDocuments operation for ${collectionName}:`, error);
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
