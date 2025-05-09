
// This file provides a mock MongoDB API for browser environments

// Initialize the mock database in the browser
export const initMongoApi = () => {
  if (typeof window === 'undefined') {
    // Server-side, don't start the mock server
    return;
  }

  console.log('Initializing mock MongoDB API for browser environment...');
  
  // Set the MongoDB connection URL in the mock server
  (window as any).MONGODB_URI = import.meta.env.VITE_MONGODB_URI || 'mongodb+srv://saifibadshah10:2Fjs34snjd56p9@travellinginsight.3fl6dwk.mongodb.net/';
  
  // Initialize mock database if needed
  if (!(window as any).mockDb) {
    (window as any).mockDb = {};
    console.log('Mock MongoDB initialized for browser environment');
  }
};
