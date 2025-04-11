
import { MongoClient, ObjectId } from 'mongodb';

// MongoDB connection string (will come from environment variables)
const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = 'travel_blog';

// Cached connection
let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return {
      client: cachedClient,
      db: cachedClient.db(DB_NAME)
    };
  }

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedClient = client;

  return {
    client,
    db: client.db(DB_NAME)
  };
}

// Helper function to convert MongoDB ObjectId to string
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

// Helper function to convert string ID to MongoDB ObjectId
export function toObjectId(id: string) {
  return new ObjectId(id);
}
