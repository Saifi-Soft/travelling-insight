
// Real MongoDB implementation for Node.js environments
import { MongoClient, ObjectId, Collection } from 'mongodb';
import { Post, Category, Topic, Comment } from '@/types/common';
import { PostSchema } from '@/models/Post';
import { CategorySchema } from '@/models/Category';
import { TopicSchema } from '@/models/Topic';
import { CommentSchema } from '@/models/Comment';

// MongoDB connection URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'travel_blog';

// Collections
export const COLLECTIONS = {
  POSTS: 'posts',
  CATEGORIES: 'categories',
  TOPICS: 'topics',
  COMMENTS: 'comments',
  USERS: 'users'
};

// Cached connection
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

// Collection references
let postsCollection: Collection;
let categoriesCollection: Collection;
let topicsCollection: Collection;
let commentsCollection: Collection;

// Helper function to convert string to ObjectId
export function toObjectId(id: string) {
  return new ObjectId(id);
}

// Format data returned from MongoDB to ensure IDs are consistent
export function formatMongoData(data: any) {
  if (Array.isArray(data)) {
    return data.map(item => {
      if (!item) return null;
      return {
        ...item,
        id: item._id ? item._id.toString() : undefined,
        _id: undefined
      };
    }).filter(Boolean);
  } else if (data && typeof data === 'object') {
    return {
      ...data,
      id: data._id ? data._id.toString() : undefined,
      _id: undefined
    };
  }
  return data;
}

// Connect to MongoDB
export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { 
      client: cachedClient, 
      db: cachedDb,
      collections: {
        posts: postsCollection,
        categories: categoriesCollection,
        topics: topicsCollection,
        comments: commentsCollection
      }
    };
  }

  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);

    // Initialize collections
    postsCollection = db.collection(COLLECTIONS.POSTS);
    categoriesCollection = db.collection(COLLECTIONS.CATEGORIES);
    topicsCollection = db.collection(COLLECTIONS.TOPICS);
    commentsCollection = db.collection(COLLECTIONS.COMMENTS);

    // Cache connection
    cachedClient = client;
    cachedDb = db;

    return { 
      client, 
      db,
      collections: {
        posts: postsCollection,
        categories: categoriesCollection,
        topics: topicsCollection,
        comments: commentsCollection
      }
    };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Initialize database with indexes and validations
export async function initializeDatabase() {
  try {
    const { db } = await connectToDatabase();
    
    // Create indexes for better query performance
    await db.collection(COLLECTIONS.POSTS).createIndex({ slug: 1 }, { unique: true });
    await db.collection(COLLECTIONS.POSTS).createIndex({ category: 1 });
    await db.collection(COLLECTIONS.POSTS).createIndex({ topics: 1 });
    
    await db.collection(COLLECTIONS.CATEGORIES).createIndex({ slug: 1 }, { unique: true });
    await db.collection(COLLECTIONS.TOPICS).createIndex({ slug: 1 }, { unique: true });
    
    console.log('MongoDB indexes created successfully');
    return true;
  } catch (error) {
    console.error('Error initializing MongoDB:', error);
    return false;
  }
}
