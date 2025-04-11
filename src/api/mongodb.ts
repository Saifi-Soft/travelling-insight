
// Mock MongoDB implementation for browser environments
// This simulates MongoDB functionality using localStorage

import { ObjectId } from 'mongodb';

// Collections
const COLLECTIONS = {
  POSTS: 'posts',
  CATEGORIES: 'categories',
  TOPICS: 'topics'
};

// Helper function to generate new ObjectId
export function generateObjectId() {
  // Simple implementation to generate id similar to MongoDB's ObjectId
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16).padStart(8, '0');
  const machineId = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
  const processId = Math.floor(Math.random() * 65536).toString(16).padStart(4, '0');
  const counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
  return timestamp + machineId + processId + counter;
}

// Helper for local storage
const getLocalCollection = (collectionName: string) => {
  const collection = localStorage.getItem(collectionName);
  return collection ? JSON.parse(collection) : [];
};

const saveLocalCollection = (collectionName: string, data: any[]) => {
  localStorage.setItem(collectionName, JSON.stringify(data));
};

// Mock MongoDB ObjectId for browser
export function toObjectId(id: string) {
  return { toString: () => id };
}

// Helper function to convert "ObjectId" to string in mock environment
export function formatMongoData(data: any) {
  if (Array.isArray(data)) {
    return data.map(item => ({
      ...item,
      id: item._id || item.id,
      _id: undefined
    }));
  } else if (data && typeof data === 'object') {
    return {
      ...data,
      id: data._id || data.id,
      _id: undefined
    };
  }
  return data;
}

// Mock DB connection - returns empty object since we don't need real connection
export async function connectToDatabase() {
  console.log('Using browser-compatible MongoDB mock');
  
  // Mock DB object with collections method
  const db = {
    collection: (collectionName: string) => {
      return {
        find: (query = {}) => {
          return {
            toArray: async () => {
              const collection = getLocalCollection(collectionName);
              // Very simple query filtering - extend as needed
              if (Object.keys(query).length === 0) {
                return collection;
              }
              
              // Basic filtering
              return collection.filter((item: any) => {
                return Object.keys(query).every(key => {
                  if (key === '$in' && query[key] instanceof Array) {
                    return query[key].includes(item[key]);
                  }
                  
                  // Handle regex queries for text search
                  if (query[key] && query[key].$regex) {
                    const regex = new RegExp(query[key].$regex);
                    return regex.test(item[key]);
                  }
                  
                  return item[key] === query[key];
                });
              });
            },
            sort: function(sortOptions: any) {
              return {
                limit: function(n: number) {
                  return {
                    toArray: async () => {
                      let collection = getLocalCollection(collectionName);
                      
                      // Basic sorting
                      if (sortOptions) {
                        const sortKey = Object.keys(sortOptions)[0];
                        const sortDir = sortOptions[sortKey];
                        
                        collection = collection.sort((a: any, b: any) => {
                          if (sortDir === 1) {
                            return a[sortKey] - b[sortKey];
                          } else {
                            return b[sortKey] - a[sortKey];
                          }
                        });
                      }
                      
                      // Limit results
                      return collection.slice(0, n);
                    }
                  };
                }
              };
            }
          };
        },
        findOne: async (query: any) => {
          const collection = getLocalCollection(collectionName);
          if (query._id) {
            return collection.find((item: any) => item._id === query._id.toString());
          }
          return null;
        },
        insertOne: async (document: any) => {
          const collection = getLocalCollection(collectionName);
          const _id = generateObjectId();
          const newDoc = { ...document, _id };
          collection.push(newDoc);
          saveLocalCollection(collectionName, collection);
          return { insertedId: { toString: () => _id } };
        },
        insertMany: async (documents: any[]) => {
          const collection = getLocalCollection(collectionName);
          const docsWithIds = documents.map(doc => {
            const _id = doc._id || generateObjectId();
            return { ...doc, _id };
          });
          saveLocalCollection(collectionName, [...collection, ...docsWithIds]);
          return { insertedCount: documents.length };
        },
        updateOne: async (query: any, update: any) => {
          const collection = getLocalCollection(collectionName);
          const index = collection.findIndex((item: any) => 
            item._id === (query._id?.toString() || ""));
          
          if (index > -1) {
            if (update.$set) {
              collection[index] = { ...collection[index], ...update.$set };
            }
            saveLocalCollection(collectionName, collection);
            return { modifiedCount: 1 };
          }
          return { modifiedCount: 0 };
        },
        deleteOne: async (query: any) => {
          const collection = getLocalCollection(collectionName);
          const filtered = collection.filter((item: any) => 
            item._id !== (query._id?.toString() || ""));
            
          if (filtered.length < collection.length) {
            saveLocalCollection(collectionName, filtered);
            return { deletedCount: 1 };
          }
          return { deletedCount: 0 };
        },
        countDocuments: async () => {
          const collection = getLocalCollection(collectionName);
          return collection.length;
        }
      };
    }
  };
  
  return {
    client: { close: () => console.log('Mock connection closed') },
    db
  };
}
