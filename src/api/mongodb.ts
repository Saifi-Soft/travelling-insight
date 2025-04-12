import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
const dbName = process.env.DB_NAME || 'travel_blog';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

// Define collections enum
export enum COLLECTIONS {
  POSTS = 'posts',
  CATEGORIES = 'categories',
  TOPICS = 'topics',
  COMMENTS = 'comments',
  NEWSLETTER = 'newsletter'
}

// Define collections type
type Collections = {
  posts: Collection;
  categories: Collection;
  topics: Collection;
  comments: Collection;
  newsletter: Collection;
};

/**
 * Establishes a connection to the MongoDB database.
 * Uses a cached connection to improve performance.
 *
 * @returns {Promise<{ client: MongoClient, db: Db, collections: Collections }>}
 *          An object containing the MongoDB client, database, and collections.
 */
export async function connectToDatabase(): Promise<{ client: MongoClient, db: Db, collections: Collections }> {
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
      collections: {
        posts: cachedDb.collection(COLLECTIONS.POSTS),
        categories: cachedDb.collection(COLLECTIONS.CATEGORIES),
        topics: cachedDb.collection(COLLECTIONS.TOPICS),
        comments: cachedDb.collection(COLLECTIONS.COMMENTS),
        newsletter: cachedDb.collection(COLLECTIONS.NEWSLETTER)
      }
    };
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);

    cachedClient = client;
    cachedDb = db;

    return {
      client: client,
      db: db,
      collections: {
        posts: db.collection(COLLECTIONS.POSTS),
        categories: db.collection(COLLECTIONS.CATEGORIES),
        topics: db.collection(COLLECTIONS.TOPICS),
        comments: db.collection(COLLECTIONS.COMMENTS),
        newsletter: db.collection(COLLECTIONS.NEWSLETTER)
      }
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
}

/**
 * Initializes the database with sample data if it is empty.
 *
 * @returns {Promise<void>}
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const { collections } = await connectToDatabase();

    // Check if the posts collection is empty
    const postsCount = await collections.posts.countDocuments();
    if (postsCount === 0) {
      // Seed the posts collection with sample data
      await collections.posts.insertMany([
        {
          title: 'Sample Post 1',
          slug: 'sample-post-1',
          content: 'This is the first sample post.',
          category: 'Travel',
          topics: ['Adventure', 'Nature'],
          date: new Date(),
          author: 'John Doe'
        },
        {
          title: 'Sample Post 2',
          slug: 'sample-post-2',
          content: 'This is the second sample post.',
          category: 'Food',
          topics: ['Recipes', 'Cooking'],
          date: new Date(),
          author: 'Jane Smith'
        }
      ]);
      console.log('Posts collection initialized with sample data');
    }

    // Check if the categories collection is empty
    const categoriesCount = await collections.categories.countDocuments();
    if (categoriesCount === 0) {
      // Seed the categories collection with sample data
      await collections.categories.insertMany([
        { name: 'Travel', slug: 'travel' },
        { name: 'Food', slug: 'food' }
      ]);
      console.log('Categories collection initialized with sample data');
    }

    // Check if the topics collection is empty
    const topicsCount = await collections.topics.countDocuments();
    if (topicsCount === 0) {
      // Seed the topics collection with sample data
      await collections.topics.insertMany([
        { name: 'Adventure', slug: 'adventure' },
        { name: 'Nature', slug: 'nature' },
        { name: 'Recipes', slug: 'recipes' },
        { name: 'Cooking', slug: 'cooking' }
      ]);
      console.log('Topics collection initialized with sample data');
    }
  } catch (e) {
    console.error('Error initializing database:', e);
  }
}

/**
 * Formats MongoDB data by converting the _id field to id.
 *
 * @param {any | any[]} data The MongoDB data to format.
 * @returns {any | any[]} The formatted data.
 */
export function formatMongoData(data: any | any[]) {
  if (!data) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => {
      if (!item) return item;
      return {
        ...item,
        id: item._id.toString(),
        _id: undefined
      };
    });
  } else {
    return {
      ...data,
      id: data._id.toString(),
      _id: undefined
    };
  }
}

// Fix the toObjectId function that was causing the error
export const toObjectId = (id: string) => {
  try {
    return new ObjectId(id);
  } catch (error) {
    console.error(`Invalid ObjectId: ${id}`);
    throw new Error(`Invalid ObjectId: ${id}`);
  }
};
