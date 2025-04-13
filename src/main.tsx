
import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App.tsx';
import './index.css';

// Initialize MongoDB for browser context
import { mongoApiService } from './api/mongoApiService';

// Initialize MongoDB connection
mongoApiService.initialize().then(() => {
  console.log('MongoDB initialized in main.tsx');
  // Create root and render app
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch(error => {
  console.error('Failed to initialize MongoDB:', error);
  // Still render the app, it will use fallback data
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
