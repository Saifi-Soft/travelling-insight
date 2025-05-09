
import { createRoot } from 'react-dom/client';
import React, { useEffect, useState } from 'react';
import App from './App.tsx';
import './index.css';

// Import QueryClient and QueryClientProvider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Import MongoDB API service
import { mongoApiService } from './api/mongoApiService';
import { Toaster } from 'sonner';

// Create a new QueryClient instance with retry configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Initialize MongoDB API service
console.log('Initializing MongoDB API service...');

// Create a wrapper component that initializes the MongoDB service
const AppWithMongoDB = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initMongoDB = async () => {
      try {
        await mongoApiService.initialize();
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize MongoDB API service:', err);
        setError(err as Error);
        setIsInitialized(true); // Still set to initialized so the app renders
      }
    };

    initMongoDB();
  }, []);

  if (!isInitialized) {
    // You could show a loading spinner here
    return <div>Loading application...</div>;
  }

  return <App />;
};

// Render the app
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppWithMongoDB />
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster position="top-right" />
    </QueryClientProvider>
  </React.StrictMode>
);
