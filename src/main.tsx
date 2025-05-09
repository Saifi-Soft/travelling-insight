
import { createRoot } from 'react-dom/client';
import React from 'react';
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
mongoApiService.initialize()
  .then(() => {
    console.log('MongoDB API service initialized successfully');
    renderApp();
  })
  .catch(error => {
    console.error('Failed to initialize MongoDB API service:', error);
    renderApp();
  });

function renderApp() {
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster position="top-right" />
      </QueryClientProvider>
    </React.StrictMode>
  );
}
