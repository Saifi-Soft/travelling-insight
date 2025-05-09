
// This file provides MongoDB API access for browser environments

// Initialize MongoDB connection in the browser
export const initMongoApi = () => {
  if (typeof window === 'undefined') {
    // Server-side, don't start the connection
    return;
  }

  console.log('Initializing MongoDB API for browser environment...');
  
  // Set the MongoDB connection URL from environment variables
  const mongoUri = import.meta.env.VITE_MONGODB_URI || 'mongodb+srv://saifibadshah10:2Fjs34snjd56p9@travellinginsight.3fl6dwk.mongodb.net/';
  const dbName = import.meta.env.VITE_DB_NAME || 'travel_blog';
  
  // Store connection info in window for access across modules
  (window as any).MONGODB_CONFIG = {
    uri: mongoUri,
    dbName: dbName
  };
  
  // Initialize database access layer
  if (!(window as any).dbStorage) {
    (window as any).dbStorage = {};
    console.log('Browser database storage initialized');
  }
};
