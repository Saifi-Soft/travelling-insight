
// MongoDB service that works in browser environments
class MongoDbService {
  private apiUrl: string;
  private apiKey: string;
  private dataSource: string;
  private database: string;
  
  constructor() {
    // Values from environment variables or defaults
    this.apiUrl = import.meta.env.VITE_MONGODB_API_URL || 'https://data.mongodb-api.com/app/data-abcde/endpoint/data/v1';
    this.apiKey = import.meta.env.VITE_MONGODB_API_KEY || 'YOUR_API_KEY';
    this.dataSource = import.meta.env.VITE_MONGODB_DATA_SOURCE || 'Cluster0';
    this.database = import.meta.env.VITE_DB_NAME || 'travel_blog';
  }
  
  async connect() {
    console.log('[MongoDB] Using Data API for browser compatibility');
    return { success: true };
  }
  
  async findOne(collectionName: string, filter: object) {
    try {
      const response = await this.executeDataApiRequest('findOne', collectionName, { filter });
      return response.document;
    } catch (error) {
      console.error(`[MongoDB] Error in findOne operation for ${collectionName}:`, error);
      return null;
    }
  }
  
  async find(collectionName: string, filter: object = {}) {
    try {
      const response = await this.executeDataApiRequest('find', collectionName, { filter });
      return response.documents;
    } catch (error) {
      console.error(`[MongoDB] Error in find operation for ${collectionName}:`, error);
      return [];
    }
  }
  
  async insertOne(collectionName: string, document: object) {
    try {
      const response = await this.executeDataApiRequest('insertOne', collectionName, { document });
      return { insertedId: response.insertedId };
    } catch (error) {
      console.error(`[MongoDB] Error in insertOne operation for ${collectionName}:`, error);
      throw error;
    }
  }
  
  async updateOne(collectionName: string, filter: object, update: object) {
    try {
      const response = await this.executeDataApiRequest('updateOne', collectionName, {
        filter,
        update: { $set: update }
      });
      return response;
    } catch (error) {
      console.error(`[MongoDB] Error in updateOne operation for ${collectionName}:`, error);
      throw error;
    }
  }
  
  async deleteOne(collectionName: string, filter: object) {
    try {
      const response = await this.executeDataApiRequest('deleteOne', collectionName, { filter });
      return response;
    } catch (error) {
      console.error(`[MongoDB] Error in deleteOne operation for ${collectionName}:`, error);
      throw error;
    }
  }
  
  async countDocuments(collectionName: string, filter: object = {}) {
    try {
      const response = await this.executeDataApiRequest('aggregate', collectionName, {
        pipeline: [
          { $match: filter },
          { $count: "count" }
        ]
      });
      
      return response.documents[0]?.count || 0;
    } catch (error) {
      console.error(`[MongoDB] Error in countDocuments operation for ${collectionName}:`, error);
      return 0;
    }
  }
  
  // Helper method to execute Data API requests
  private async executeDataApiRequest(action: string, collection: string, data: any) {
    try {
      // If we're in development mode with mock data, use mock implementation
      if (typeof window !== 'undefined' && (!this.apiKey || this.apiKey === 'YOUR_API_KEY')) {
        console.log('[MongoDB] Using mock implementation for', action, 'on', collection);
        return this.mockDataApiRequest(action, collection, data);
      }
      
      // Prepare the request configuration
      const endpoint = this.apiUrl + '/action/' + action;
      const requestBody = {
        collection,
        database: this.database,
        dataSource: this.dataSource,
        ...data
      };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`MongoDB Data API error (${response.status}): ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('[MongoDB] Data API request failed:', error);
      throw error;
    }
  }
  
  // Mock implementation for development without real API key
  private mockDataApiRequest(action: string, collection: string, data: any) {
    // Initialize mock database if needed
    if (typeof window !== 'undefined' && !(window as any).mockDb) {
      (window as any).mockDb = {};
    }
    
    // Make sure collection exists
    if (typeof window !== 'undefined' && !(window as any).mockDb[collection]) {
      (window as any).mockDb[collection] = [];
    }
    
    const mockDb = typeof window !== 'undefined' ? (window as any).mockDb : {};
    
    switch (action) {
      case 'findOne': {
        const { filter } = data;
        const doc = mockDb[collection]?.find((doc: any) => this.matchesFilter(doc, filter));
        return { document: doc || null };
      }
      
      case 'find': {
        const { filter } = data;
        const docs = mockDb[collection]?.filter((doc: any) => this.matchesFilter(doc, filter)) || [];
        return { documents: docs };
      }
      
      case 'insertOne': {
        const { document } = data;
        const _id = this.generateObjectId();
        const newDoc = { ...document, _id };
        mockDb[collection].push(newDoc);
        return { insertedId: _id };
      }
      
      case 'updateOne': {
        const { filter, update } = data;
        let modifiedCount = 0;
        
        mockDb[collection] = mockDb[collection].map((doc: any) => {
          if (this.matchesFilter(doc, filter)) {
            modifiedCount++;
            return { ...doc, ...update.$set };
          }
          return doc;
        });
        
        return { matchedCount: modifiedCount, modifiedCount };
      }
      
      case 'deleteOne': {
        const { filter } = data;
        const initialLength = mockDb[collection].length;
        mockDb[collection] = mockDb[collection].filter((doc: any) => !this.matchesFilter(doc, filter));
        const deletedCount = initialLength - mockDb[collection].length;
        return { deletedCount };
      }
      
      case 'aggregate': {
        const { pipeline } = data;
        let result = [...mockDb[collection]];
        
        // Simple implementation of $match and $count
        for (const stage of pipeline) {
          if (stage.$match) {
            result = result.filter((doc: any) => this.matchesFilter(doc, stage.$match));
          } else if (stage.$count) {
            return { documents: [{ count: result.length }] };
          }
        }
        
        return { documents: result };
      }
      
      default:
        throw new Error(`Unsupported mock action: ${action}`);
    }
  }
  
  private matchesFilter(document: any, filter: any): boolean {
    return Object.entries(filter).every(([key, value]) => {
      // Handle _id specially
      if (key === '_id') {
        return document._id?.toString() === value.toString();
      }
      
      // Handle simple equality
      return document[key] === value;
    });
  }
  
  private generateObjectId(): string {
    const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
    const machineId = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
    const processId = Math.floor(Math.random() * 65536).toString(16).padStart(4, '0');
    const counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
    
    return timestamp + machineId + processId + counter;
  }
  
  toObjectId(id: string) {
    // In the browser context, we just use the string ID as is
    return id;
  }
}

// Create a singleton instance
export const mongoDbService = new MongoDbService();
