
// Real MongoDB implementation for Node.js environments
import { MongoClient, ObjectId } from 'mongodb';

// MongoDB connection URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'travel_blog';

// Cached connection
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

// Helper function to convert string to ObjectId
export function toObjectId(id: string) {
  return new ObjectId(id);
}

// Format data returned from MongoDB to ensure IDs are consistent
export function formatMongoData(data: any) {
  if (Array.isArray(data)) {
    return data.map(item => ({
      ...item,
      id: item._id.toString(),
      _id: undefined
    }));
  } else if (data && typeof data === 'object') {
    return {
      ...data,
      id: data._id.toString(),
      _id: undefined
    };
  }
  return data;
}

// Connect to MongoDB
export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);

    // Cache connection
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
