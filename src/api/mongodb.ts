// Define collections enum
export enum COLLECTIONS {
  POSTS = 'posts',
  CATEGORIES = 'categories',
  TOPICS = 'topics',
  COMMENTS = 'comments',
  NEWSLETTER = 'newsletter',
  COMMUNITY_USERS = 'community_users',
  TRAVEL_GROUPS = 'travel_groups',
  COMMUNITY_EVENTS = 'community_events',
  TRAVEL_MATCHES = 'travel_matches',
  USER_SUBSCRIPTIONS = 'user_subscriptions',
  USER_SETTINGS = 'user_settings',
  ADS = 'ads',
  AD_STATS = 'ad_stats'
}

// Create a proper ObjectId class that works in browser
export class ObjectId {
  private id: string;
  
  constructor(id?: string) {
    if (id) {
      this.id = id;
    } else {
      // Generate a random hexadecimal string of 24 characters
      this.id = Array.from({ length: 24 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
    }
  }

  toString() {
    return this.id;
  }

  equals(other: ObjectId) {
    return this.id === other.id;
  }
}

// Mock in-memory database for browser compatibility
const mockDb: Record<string, any[]> = {
  [COLLECTIONS.POSTS]: [],
  [COLLECTIONS.CATEGORIES]: [],
  [COLLECTIONS.TOPICS]: [],
  [COLLECTIONS.COMMENTS]: [],
  [COLLECTIONS.NEWSLETTER]: [],
  [COLLECTIONS.COMMUNITY_USERS]: [],
  [COLLECTIONS.TRAVEL_GROUPS]: [],
  [COLLECTIONS.COMMUNITY_EVENTS]: [],
  [COLLECTIONS.TRAVEL_MATCHES]: [],
  [COLLECTIONS.USER_SUBSCRIPTIONS]: [],
  [COLLECTIONS.USER_SETTINGS]: [],
  [COLLECTIONS.ADS]: [],
  [COLLECTIONS.AD_STATS]: []
};

// Define collections type
export type Collections = {
  [COLLECTIONS.POSTS]: any;
  [COLLECTIONS.CATEGORIES]: any;
  [COLLECTIONS.TOPICS]: any;
  [COLLECTIONS.COMMENTS]: any;
  [COLLECTIONS.NEWSLETTER]: any;
  [COLLECTIONS.COMMUNITY_USERS]: any;
  [COLLECTIONS.TRAVEL_GROUPS]: any;
  [COLLECTIONS.COMMUNITY_EVENTS]: any;
  [COLLECTIONS.TRAVEL_MATCHES]: any;
  [COLLECTIONS.USER_SUBSCRIPTIONS]: any;
  [COLLECTIONS.USER_SETTINGS]: any;
  [COLLECTIONS.ADS]: any;
  [COLLECTIONS.AD_STATS]: any;
};

// Mock collection class
class MockCollection {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    // Initialize collection if it doesn't exist
    if (!mockDb[collectionName]) {
      mockDb[collectionName] = [];
    }
  }

  find(filter = {}) {
    // Return object directly with methods, not a promise that resolves to an object with methods
    return {
      async toArray() {
        return mockDb[this.collectionName].filter(item => {
          // Simple filtering
          return Object.entries(filter).every(([key, value]) => {
            if (key === '_id') {
              // Compare ObjectId or string
              if (typeof value === 'string') {
                return item._id.toString() === value;
              } else if (value instanceof ObjectId) {
                return item._id.toString() === value.toString();
              }
            }
            return item[key] === value;
          });
        });
      },
      sort: () => this,
      limit: () => this,
    };
  }

  async findOne(filter: any) {
    const items = await this.find(filter).toArray();
    return items[0] || null;
  }

  async insertOne(document: any) {
    const _id = new ObjectId();
    const newDoc = { ...document, _id };
    mockDb[this.collectionName].push(newDoc);
    return { insertedId: _id };
  }

  async insertMany(documents: any[]) {
    const result = { insertedIds: [] as ObjectId[] };
    for (const document of documents) {
      const { insertedId } = await this.insertOne(document);
      result.insertedIds.push(insertedId);
    }
    return result;
  }

  async updateOne(filter: any, update: any) {
    let matchedCount = 0;
    let modifiedCount = 0;

    mockDb[this.collectionName] = mockDb[this.collectionName].map(item => {
      // Match filter
      const isMatch = Object.entries(filter).every(([key, value]) => {
        if (key === '_id') {
          if (typeof value === 'string') {
            return item._id.toString() === value;
          } else if (value instanceof ObjectId) {
            return item._id.toString() === value.toString();
          }
          return false;
        }
        return item[key] === value;
      });

      if (isMatch) {
        matchedCount++;
        if (update.$set) {
          // Apply $set updates
          modifiedCount++;
          return { ...item, ...update.$set };
        }
        if (update.$inc) {
          // Apply $inc updates
          modifiedCount++;
          const newItem = { ...item };
          Object.entries(update.$inc).forEach(([key, value]) => {
            newItem[key] = (newItem[key] || 0) + Number(value);
          });
          return newItem;
        }
        if (update.$push) {
          // Apply $push updates
          modifiedCount++;
          const newItem = { ...item };
          Object.entries(update.$push).forEach(([key, value]) => {
            newItem[key] = [...(newItem[key] || []), value];
          });
          return newItem;
        }
        if (update.$pull) {
          // Apply $pull updates
          modifiedCount++;
          const newItem = { ...item };
          Object.entries(update.$pull).forEach(([key, value]) => {
            newItem[key] = (newItem[key] || []).filter((v: any) => v !== value);
          });
          return newItem;
        }
      }
      return item;
    });

    return { matchedCount, modifiedCount };
  }

  async deleteOne(filter: any) {
    const initialLength = mockDb[this.collectionName].length;
    mockDb[this.collectionName] = mockDb[this.collectionName].filter(item => {
      const isMatch = Object.entries(filter).every(([key, value]) => {
        if (key === '_id') {
          if (typeof value === 'string') {
            return item._id.toString() === value;
          } else if (value instanceof ObjectId) {
            return item._id.toString() === value.toString();
          }
          return false;
        }
        return item[key] === value;
      });
      return !isMatch;
    });
    const deletedCount = initialLength - mockDb[this.collectionName].length;
    return { deletedCount };
  }

  async countDocuments() {
    return mockDb[this.collectionName].length;
  }
}

// Mock DB and client classes
class MockDb {
  collection(name: string) {
    return new MockCollection(name);
  }
}

class MockClient {
  async connect() {
    console.log('Connected to mock MongoDB');
    return this;
  }

  db() {
    return new MockDb();
  }
}

let cachedClient: MockClient | null = null;
let cachedDb: MockDb | null = null;

/**
 * Establishes a connection to the MongoDB database.
 * Uses a cached connection to improve performance.
 *
 * @returns {Promise<{ client: any, db: any, collections: Collections }>}
 *          An object containing the MongoDB client, database, and collections.
 */
export async function connectToDatabase(): Promise<{ client: any, db: any, collections: Collections }> {
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
      collections: {
        [COLLECTIONS.POSTS]: cachedDb.collection(COLLECTIONS.POSTS),
        [COLLECTIONS.CATEGORIES]: cachedDb.collection(COLLECTIONS.CATEGORIES),
        [COLLECTIONS.TOPICS]: cachedDb.collection(COLLECTIONS.TOPICS),
        [COLLECTIONS.COMMENTS]: cachedDb.collection(COLLECTIONS.COMMENTS),
        [COLLECTIONS.NEWSLETTER]: cachedDb.collection(COLLECTIONS.NEWSLETTER),
        [COLLECTIONS.COMMUNITY_USERS]: cachedDb.collection(COLLECTIONS.COMMUNITY_USERS),
        [COLLECTIONS.TRAVEL_GROUPS]: cachedDb.collection(COLLECTIONS.TRAVEL_GROUPS),
        [COLLECTIONS.COMMUNITY_EVENTS]: cachedDb.collection(COLLECTIONS.COMMUNITY_EVENTS),
        [COLLECTIONS.TRAVEL_MATCHES]: cachedDb.collection(COLLECTIONS.TRAVEL_MATCHES),
        [COLLECTIONS.USER_SUBSCRIPTIONS]: cachedDb.collection(COLLECTIONS.USER_SUBSCRIPTIONS),
        [COLLECTIONS.USER_SETTINGS]: cachedDb.collection(COLLECTIONS.USER_SETTINGS),
        [COLLECTIONS.ADS]: cachedDb.collection(COLLECTIONS.ADS),
        [COLLECTIONS.AD_STATS]: cachedDb.collection(COLLECTIONS.AD_STATS)
      }
    };
  }

  try {
    const client = new MockClient();
    await client.connect();

    const db = client.db();
    
    cachedClient = client;
    cachedDb = db;

    return {
      client,
      db,
      collections: {
        [COLLECTIONS.POSTS]: db.collection(COLLECTIONS.POSTS),
        [COLLECTIONS.CATEGORIES]: db.collection(COLLECTIONS.CATEGORIES),
        [COLLECTIONS.TOPICS]: db.collection(COLLECTIONS.TOPICS),
        [COLLECTIONS.COMMENTS]: db.collection(COLLECTIONS.COMMENTS),
        [COLLECTIONS.NEWSLETTER]: db.collection(COLLECTIONS.NEWSLETTER),
        [COLLECTIONS.COMMUNITY_USERS]: db.collection(COLLECTIONS.COMMUNITY_USERS),
        [COLLECTIONS.TRAVEL_GROUPS]: db.collection(COLLECTIONS.TRAVEL_GROUPS),
        [COLLECTIONS.COMMUNITY_EVENTS]: db.collection(COLLECTIONS.COMMUNITY_EVENTS),
        [COLLECTIONS.TRAVEL_MATCHES]: db.collection(COLLECTIONS.TRAVEL_MATCHES),
        [COLLECTIONS.USER_SUBSCRIPTIONS]: db.collection(COLLECTIONS.USER_SUBSCRIPTIONS),
        [COLLECTIONS.USER_SETTINGS]: db.collection(COLLECTIONS.USER_SETTINGS),
        [COLLECTIONS.ADS]: db.collection(COLLECTIONS.ADS),
        [COLLECTIONS.AD_STATS]: db.collection(COLLECTIONS.AD_STATS)
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
    const postsCount = await collections[COLLECTIONS.POSTS].countDocuments();
    if (postsCount === 0) {
      // Seed the posts collection with sample data
      await collections[COLLECTIONS.POSTS].insertMany([
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
    const categoriesCount = await collections[COLLECTIONS.CATEGORIES].countDocuments();
    if (categoriesCount === 0) {
      // Seed the categories collection with sample data
      await collections[COLLECTIONS.CATEGORIES].insertMany([
        { name: 'Travel', slug: 'travel' },
        { name: 'Food', slug: 'food' }
      ]);
      console.log('Categories collection initialized with sample data');
    }

    // Check if the topics collection is empty
    const topicsCount = await collections[COLLECTIONS.TOPICS].countDocuments();
    if (topicsCount === 0) {
      // Seed the topics collection with sample data
      await collections[COLLECTIONS.TOPICS].insertMany([
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

// Utility function to convert string IDs to ObjectIds
export const toObjectId = (id: string) => {
  try {
    return new ObjectId(id);
  } catch (error) {
    console.error(`Invalid ObjectId: ${id}`);
    throw new Error(`Invalid ObjectId: ${id}`);
  }
};
