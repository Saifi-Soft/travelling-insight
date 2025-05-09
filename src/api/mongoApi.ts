
import { createServer } from 'http';
import { parse } from 'url';
import { mongoDbService } from './mongoDbService';

// This file simulates an API server for MongoDB operations in development
// It's a simplified version - in production, you would use a real backend

// Create a server to handle MongoDB API requests in development
const startMockApiServer = () => {
  if (typeof window === 'undefined') {
    // Server-side, don't start the mock server
    return;
  }

  // In a real application, this would be an Express or Next.js API route
  // For now, we'll simulate API functionality with local logic
  console.log('Starting mock MongoDB API server for development...');
  
  // Create global API handlers for MongoDB operations
  (window as any).mongoApi = {
    findOne: async (collectionName: string, filter: any) => {
      try {
        const docs = (window as any).mockDb?.[collectionName] || [];
        return docs.find((doc: any) => {
          return Object.keys(filter).every(key => {
            if (key === '_id' || key === 'id') {
              return doc._id?.toString() === filter[key]?.toString() || 
                     doc.id?.toString() === filter[key]?.toString();
            }
            return doc[key] === filter[key];
          });
        });
      } catch (error) {
        console.error(`Mock findOne error for ${collectionName}:`, error);
        return null;
      }
    },
    
    find: async (collectionName: string, filter: any = {}) => {
      try {
        const docs = (window as any).mockDb?.[collectionName] || [];
        if (Object.keys(filter).length === 0) {
          return [...docs]; // Return a copy to prevent mutations
        }
        
        return docs.filter((doc: any) => {
          return Object.keys(filter).every(key => {
            if (key === '_id' || key === 'id') {
              return doc._id?.toString() === filter[key]?.toString() || 
                     doc.id?.toString() === filter[key]?.toString();
            }
            return doc[key] === filter[key];
          });
        });
      } catch (error) {
        console.error(`Mock find error for ${collectionName}:`, error);
        return [];
      }
    },
    
    insertOne: async (collectionName: string, document: any) => {
      try {
        if (!(window as any).mockDb) {
          (window as any).mockDb = {};
        }
        
        if (!(window as any).mockDb[collectionName]) {
          (window as any).mockDb[collectionName] = [];
        }
        
        const _id = document._id || document.id || Math.random().toString(36).substring(2, 15);
        const newDoc = { ...document, _id, id: _id };
        (window as any).mockDb[collectionName].push(newDoc);
        
        return { insertedId: _id, acknowledged: true };
      } catch (error) {
        console.error(`Mock insertOne error for ${collectionName}:`, error);
        throw error;
      }
    },
    
    updateOne: async (collectionName: string, filter: any, update: any) => {
      try {
        if (!(window as any).mockDb?.[collectionName]) {
          return { modifiedCount: 0, acknowledged: true };
        }
        
        let modifiedCount = 0;
        (window as any).mockDb[collectionName] = (window as any).mockDb[collectionName].map((doc: any) => {
          const isMatch = Object.keys(filter).every(key => {
            if (key === '_id' || key === 'id') {
              return doc._id?.toString() === filter[key]?.toString() || 
                     doc.id?.toString() === filter[key]?.toString();
            }
            return doc[key] === filter[key];
          });
          
          if (isMatch) {
            modifiedCount++;
            const updateData = update.$set || update;
            return { ...doc, ...updateData };
          }
          
          return doc;
        });
        
        return { modifiedCount, acknowledged: true };
      } catch (error) {
        console.error(`Mock updateOne error for ${collectionName}:`, error);
        throw error;
      }
    },
    
    deleteOne: async (collectionName: string, filter: any) => {
      try {
        if (!(window as any).mockDb?.[collectionName]) {
          return { deletedCount: 0, acknowledged: true };
        }
        
        const originalLength = (window as any).mockDb[collectionName].length;
        (window as any).mockDb[collectionName] = (window as any).mockDb[collectionName].filter((doc: any) => {
          return !Object.keys(filter).every(key => {
            if (key === '_id' || key === 'id') {
              return doc._id?.toString() === filter[key]?.toString() || 
                     doc.id?.toString() === filter[key]?.toString();
            }
            return doc[key] === filter[key];
          });
        });
        
        const deletedCount = originalLength - (window as any).mockDb[collectionName].length;
        return { deletedCount, acknowledged: true };
      } catch (error) {
        console.error(`Mock deleteOne error for ${collectionName}:`, error);
        throw error;
      }
    },
    
    count: async (collectionName: string, filter: any = {}) => {
      try {
        if (!(window as any).mockDb?.[collectionName]) {
          return { count: 0 };
        }
        
        if (Object.keys(filter).length === 0) {
          return { count: (window as any).mockDb[collectionName].length };
        }
        
        const count = (window as any).mockDb[collectionName].filter((doc: any) => {
          return Object.keys(filter).every(key => {
            if (key === '_id' || key === 'id') {
              return doc._id?.toString() === filter[key]?.toString() || 
                     doc.id?.toString() === filter[key]?.toString();
            }
            return doc[key] === filter[key];
          });
        }).length;
        
        return { count };
      } catch (error) {
        console.error(`Mock count error for ${collectionName}:`, error);
        return { count: 0 };
      }
    }
  };
  
  // Initialize mock database if needed
  if (!(window as any).mockDb) {
    (window as any).mockDb = {};
    console.log('Mock MongoDB initialized for browser environment');
  }
};

// Initialize the API server
export const initMongoApi = () => {
  if (typeof window !== 'undefined') {
    startMockApiServer();
  }
};
