
import { MongoOperators } from '@/types/common';
import { toast } from 'sonner';

// Simulated MongoDB collections
const collections: Record<string, any[]> = {
  posts: [],
  comments: [],
  users: [],
  topics: [],
  categories: [],
  communityUsers: [],
  subscriptions: [],
  travelGroups: [],
  travelMatches: [],
  communityEvents: []
};

// Generate a mock ObjectId
const generateObjectId = () => {
  const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
    return (Math.random() * 16 | 0).toString(16);
  }).toLowerCase();
};

// Simple in-memory MongoDB-like API service
class MongoApiService {
  // Insert a document into a collection
  async insertDocument(collectionName: string, document: any): Promise<any> {
    try {
      if (!collections[collectionName]) {
        collections[collectionName] = [];
      }
      
      const newDocument = {
        ...document,
        id: generateObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      collections[collectionName].push(newDocument);
      console.log(`[MongoDB] Inserted document in ${collectionName}:`, newDocument);
      return newDocument;
    } catch (error) {
      console.error(`[MongoDB] Error inserting document into ${collectionName}:`, error);
      throw error;
    }
  }
  
  // Get a document by ID
  async getDocumentById(collectionName: string, id: string): Promise<any | null> {
    try {
      if (!collections[collectionName]) {
        return null;
      }
      
      const document = collections[collectionName].find(doc => doc.id === id);
      console.log(`[MongoDB] Retrieved document from ${collectionName}:`, document);
      return document || null;
    } catch (error) {
      console.error(`[MongoDB] Error getting document from ${collectionName}:`, error);
      return null;
    }
  }
  
  // Update a document
  async updateDocument(collectionName: string, id: string, update: any): Promise<any | null> {
    try {
      if (!collections[collectionName]) {
        return null;
      }
      
      const index = collections[collectionName].findIndex(doc => doc.id === id);
      if (index === -1) {
        return null;
      }
      
      const updatedDocument = {
        ...collections[collectionName][index],
        ...update,
        updatedAt: new Date()
      };
      
      collections[collectionName][index] = updatedDocument;
      console.log(`[MongoDB] Updated document in ${collectionName}:`, updatedDocument);
      return updatedDocument;
    } catch (error) {
      console.error(`[MongoDB] Error updating document in ${collectionName}:`, error);
      return null;
    }
  }
  
  // Delete a document
  async deleteDocument(collectionName: string, id: string): Promise<boolean> {
    try {
      if (!collections[collectionName]) {
        return false;
      }
      
      const initialLength = collections[collectionName].length;
      collections[collectionName] = collections[collectionName].filter(doc => doc.id !== id);
      
      const success = collections[collectionName].length < initialLength;
      console.log(`[MongoDB] Deleted document from ${collectionName}:`, success);
      return success;
    } catch (error) {
      console.error(`[MongoDB] Error deleting document from ${collectionName}:`, error);
      return false;
    }
  }
  
  // Query documents with filter
  async queryDocuments(collectionName: string, filter: Record<string, any>): Promise<any[]> {
    try {
      if (!collections[collectionName]) {
        return [];
      }
      
      // Simple filtering (not supporting complex MongoDB queries)
      const results = collections[collectionName].filter(doc => {
        return Object.entries(filter).every(([key, value]) => {
          if (typeof value === 'object' && value !== null && Object.keys(value).some(k => k.startsWith('$'))) {
            // Handle MongoDB operators like $gt, $lt, etc.
            return this.handleOperators(doc[key], value as MongoOperators<any>);
          }
          return doc[key] === value;
        });
      });
      
      console.log(`[MongoDB] Queried documents from ${collectionName}:`, results.length);
      return [...results]; // Return a copy to prevent mutation
    } catch (error) {
      console.error(`[MongoDB] Error querying documents from ${collectionName}:`, error);
      return [];
    }
  }
  
  // Handle MongoDB operators
  private handleOperators<T>(fieldValue: T, operators: MongoOperators<T>): boolean {
    try {
      // Handle $gt operator
      if ('$gt' in operators && !(fieldValue > operators.$gt)) {
        return false;
      }
      
      // Handle $gte operator
      if ('$gte' in operators && !(fieldValue >= operators.$gte)) {
        return false;
      }
      
      // Handle $lt operator
      if ('$lt' in operators && !(fieldValue < operators.$lt)) {
        return false;
      }
      
      // Handle $lte operator
      if ('$lte' in operators && !(fieldValue <= operators.$lte)) {
        return false;
      }
      
      // Handle $eq operator
      if ('$eq' in operators && fieldValue !== operators.$eq) {
        return false;
      }
      
      // Handle $ne operator
      if ('$ne' in operators && fieldValue === operators.$ne) {
        return false;
      }
      
      // Handle $in operator for arrays
      if ('$in' in operators) {
        const inArray = operators.$in as unknown as Array<T>;
        if (!inArray.includes(fieldValue)) {
          return false;
        }
      }
      
      // Handle $nin operator for arrays
      if ('$nin' in operators) {
        const ninArray = operators.$nin as unknown as Array<T>;
        if (ninArray.includes(fieldValue)) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('[MongoDB] Error handling operators:', error);
      return false;
    }
  }
}

export const mongoApiService = new MongoApiService();
