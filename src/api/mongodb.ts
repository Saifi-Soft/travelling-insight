
// MongoDB API implementation for browser environments
import { Post, Category, Topic, Comment } from '@/types/common';
import { PostSchema } from '@/models/Post';
import { CategorySchema } from '@/models/Category';
import { TopicSchema } from '@/models/Topic';
import { CommentSchema } from '@/models/Comment';

// Collections
export const COLLECTIONS = {
  POSTS: 'posts',
  CATEGORIES: 'categories',
  TOPICS: 'topics',
  COMMENTS: 'comments',
  USERS: 'users'
};

// For browser compatibility, we'll use a serverless approach
// This implementation will work for demonstration purposes,
// but in a real app you would use API routes to communicate with MongoDB

// Mock MongoDB ObjectId generator
export function toObjectId(id: string) {
  return id;
}

// Format data to ensure IDs are consistent
export function formatMongoData(data: any) {
  if (Array.isArray(data)) {
    return data.map(item => {
      if (!item) return null;
      return {
        ...item,
        id: item.id || item._id,
      };
    }).filter(Boolean);
  } else if (data && typeof data === 'object') {
    return {
      ...data,
      id: data.id || data._id,
    };
  }
  return data;
}

// Connect to "database" - in this case, just prepare our storage
export async function connectToDatabase() {
  console.log('Connecting to database');
  
  // Initialize collections in localStorage if they don't exist
  if (!localStorage.getItem(COLLECTIONS.POSTS)) {
    localStorage.setItem(COLLECTIONS.POSTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(COLLECTIONS.CATEGORIES)) {
    localStorage.setItem(COLLECTIONS.CATEGORIES, JSON.stringify([]));
  }
  if (!localStorage.getItem(COLLECTIONS.TOPICS)) {
    localStorage.setItem(COLLECTIONS.TOPICS, JSON.stringify([]));
  }
  if (!localStorage.getItem(COLLECTIONS.COMMENTS)) {
    localStorage.setItem(COLLECTIONS.COMMENTS, JSON.stringify([]));
  }

  return {
    client: null,
    db: null,
    collections: {
      posts: {
        find: () => createFindCursor(COLLECTIONS.POSTS),
        findOne: (query: any) => findOne(COLLECTIONS.POSTS, query),
        insertOne: (doc: any) => insertOne(COLLECTIONS.POSTS, doc),
        insertMany: (docs: any[]) => insertMany(COLLECTIONS.POSTS, docs),
        updateOne: (query: any, update: any) => updateOne(COLLECTIONS.POSTS, query, update),
        deleteOne: (query: any) => deleteOne(COLLECTIONS.POSTS, query),
        countDocuments: (query: any = {}) => countDocuments(COLLECTIONS.POSTS, query)
      },
      categories: {
        find: () => createFindCursor(COLLECTIONS.CATEGORIES),
        findOne: (query: any) => findOne(COLLECTIONS.CATEGORIES, query),
        insertOne: (doc: any) => insertOne(COLLECTIONS.CATEGORIES, doc),
        insertMany: (docs: any[]) => insertMany(COLLECTIONS.CATEGORIES, docs),
        updateOne: (query: any, update: any) => updateOne(COLLECTIONS.CATEGORIES, query, update),
        deleteOne: (query: any) => deleteOne(COLLECTIONS.CATEGORIES, query),
        countDocuments: (query: any = {}) => countDocuments(COLLECTIONS.CATEGORIES, query),
        createIndex: () => Promise.resolve({ result: true })
      },
      topics: {
        find: () => createFindCursor(COLLECTIONS.TOPICS),
        findOne: (query: any) => findOne(COLLECTIONS.TOPICS, query),
        insertOne: (doc: any) => insertOne(COLLECTIONS.TOPICS, doc),
        insertMany: (docs: any[]) => insertMany(COLLECTIONS.TOPICS, docs),
        updateOne: (query: any, update: any) => updateOne(COLLECTIONS.TOPICS, query, update),
        deleteOne: (query: any) => deleteOne(COLLECTIONS.TOPICS, query),
        countDocuments: (query: any = {}) => countDocuments(COLLECTIONS.TOPICS, query),
        createIndex: () => Promise.resolve({ result: true })
      },
      comments: {
        find: () => createFindCursor(COLLECTIONS.COMMENTS),
        findOne: (query: any) => findOne(COLLECTIONS.COMMENTS, query),
        insertOne: (doc: any) => insertOne(COLLECTIONS.COMMENTS, doc),
        insertMany: (docs: any[]) => insertMany(COLLECTIONS.COMMENTS, docs),
        updateOne: (query: any, update: any) => updateOne(COLLECTIONS.COMMENTS, query, update),
        deleteOne: (query: any) => deleteOne(COLLECTIONS.COMMENTS, query),
        countDocuments: (query: any = {}) => countDocuments(COLLECTIONS.COMMENTS, query)
      }
    }
  };
}

// Initialize database with indexes and validations
export async function initializeDatabase() {
  try {
    console.log('Initializing database');
    // Nothing to do for localStorage implementation
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

// Helper functions to simulate MongoDB operations
function createFindCursor(collection: string) {
  let docsArray = JSON.parse(localStorage.getItem(collection) || '[]');
  let limitVal = 0;
  let skipVal = 0;
  let sortField: any = null;
  
  return {
    toArray: () => {
      let result = [...docsArray];
      
      if (sortField) {
        const [field, order] = Object.entries(sortField)[0];
        result.sort((a, b) => {
          if (a[field] < b[field]) return order === 1 ? -1 : 1;
          if (a[field] > b[field]) return order === 1 ? 1 : -1;
          return 0;
        });
      }
      
      if (skipVal) {
        result = result.slice(skipVal);
      }
      
      if (limitVal > 0) {
        result = result.slice(0, limitVal);
      }
      
      return Promise.resolve(result);
    },
    limit: (limit: number) => {
      limitVal = limit;
      return { toArray: () => Promise.resolve(docsArray.slice(0, limit)) };
    },
    sort: (sort: any) => {
      sortField = sort;
      return {
        limit: (limit: number) => {
          limitVal = limit;
          return {
            toArray: () => {
              let result = [...docsArray];
              
              const [field, order] = Object.entries(sort)[0];
              result.sort((a, b) => {
                if (a[field] < b[field]) return order === 1 ? -1 : 1;
                if (a[field] > b[field]) return order === 1 ? 1 : -1;
                return 0;
              });
              
              return Promise.resolve(result.slice(0, limit));
            }
          };
        },
        toArray: () => {
          let result = [...docsArray];
          
          const [field, order] = Object.entries(sort)[0];
          result.sort((a, b) => {
            if (a[field] < b[field]) return order === 1 ? -1 : 1;
            if (a[field] > b[field]) return order === 1 ? 1 : -1;
            return 0;
          });
          
          return Promise.resolve(result);
        }
      };
    }
  };
}

// Improved query matching with proper type handling for MongoDB operators
function queryMatches(doc: any, query: any): boolean {
  for (const [key, value] of Object.entries(query)) {
    if (key === '_id') {
      if (doc.id !== value && doc._id !== value) {
        return false;
      }
    } else if (typeof value === 'object' && value !== null) {
      // Handle MongoDB operators
      if (key === '$in') {
        return false; // Not implemented for simplicity
      } else if (value.$in) {
        // Handle {topics: {$in: [tag]}}
        const targetArray = doc[key];
        const valuesToFind = value.$in as any[];
        if (!targetArray || !Array.isArray(targetArray)) return false;
        
        // Check if any value in valuesToFind exists in targetArray
        const found = valuesToFind.some((v: any) => targetArray.includes(v));
        if (!found) return false;
      } else {
        // Recursive object match
        if (!queryMatches(doc[key], value)) {
          return false;
        }
      }
    } else if (doc[key] !== value) {
      return false;
    }
  }
  return true;
}

function findOne(collection: string, query: any) {
  const docs = JSON.parse(localStorage.getItem(collection) || '[]');
  const result = docs.find((doc: any) => queryMatches(doc, query));
  return Promise.resolve(result || null);
}

function insertOne(collection: string, doc: any) {
  const docs = JSON.parse(localStorage.getItem(collection) || '[]');
  const id = Math.random().toString(36).substring(2, 15);
  const newDoc = { ...doc, _id: id, id };
  docs.push(newDoc);
  localStorage.setItem(collection, JSON.stringify(docs));
  return Promise.resolve({ insertedId: id, insertedCount: 1 });
}

function insertMany(collection: string, docsToInsert: any[]) {
  const docs = JSON.parse(localStorage.getItem(collection) || '[]');
  const newDocs = docsToInsert.map(doc => {
    const id = Math.random().toString(36).substring(2, 15);
    return { ...doc, _id: id, id };
  });
  docs.push(...newDocs);
  localStorage.setItem(collection, JSON.stringify(docs));
  return Promise.resolve({ insertedCount: newDocs.length });
}

function updateOne(collection: string, query: any, update: any) {
  const docs = JSON.parse(localStorage.getItem(collection) || '[]');
  let updated = false;
  
  const updatedDocs = docs.map((doc: any) => {
    if (!updated && queryMatches(doc, query)) {
      updated = true;
      
      if (update.$set) {
        return { ...doc, ...update.$set };
      } else if (update.$inc) {
        const result = { ...doc };
        for (const [key, value] of Object.entries(update.$inc)) {
          result[key] = (result[key] || 0) + (value as number);
        }
        return result;
      } else if (update.$push) {
        const result = { ...doc };
        for (const [key, value] of Object.entries(update.$push)) {
          if (!result[key]) result[key] = [];
          if (Array.isArray(result[key])) {
            result[key] = [...result[key], value];
          }
        }
        return result;
      }
      
      return update;
    }
    return doc;
  });
  
  localStorage.setItem(collection, JSON.stringify(updatedDocs));
  return Promise.resolve({ modifiedCount: updated ? 1 : 0, upsertedId: null, upsertedCount: 0 });
}

function deleteOne(collection: string, query: any) {
  const docs = JSON.parse(localStorage.getItem(collection) || '[]');
  const index = docs.findIndex((doc: any) => queryMatches(doc, query));
  
  if (index !== -1) {
    docs.splice(index, 1);
    localStorage.setItem(collection, JSON.stringify(docs));
    return Promise.resolve({ deletedCount: 1 });
  }
  
  return Promise.resolve({ deletedCount: 0 });
}

function countDocuments(collection: string, query: any = {}) {
  const docs = JSON.parse(localStorage.getItem(collection) || '[]');
  if (Object.keys(query).length === 0) {
    return Promise.resolve(docs.length);
  }
  
  const count = docs.filter((doc: any) => queryMatches(doc, query)).length;
  return Promise.resolve(count);
}

// Export a mock db object for direct usage in components if needed
export const db = {
  collection: (name: string) => ({
    find: () => createFindCursor(name),
    findOne: (query: any) => findOne(name, query),
    insertOne: (doc: any) => insertOne(name, doc),
    insertMany: (docs: any[]) => insertMany(name, docs),
    updateOne: (query: any, update: any) => updateOne(name, query, update),
    deleteOne: (query: any) => deleteOne(name, query),
    countDocuments: (query: any = {}) => countDocuments(name, query),
    createIndex: () => Promise.resolve({ result: true })
  })
};
