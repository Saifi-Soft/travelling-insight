import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import Index from './pages/Index';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Travel from './pages/Travel';
import TravelPlanner from './pages/TravelPlanner';
import FlightResultsPage from './pages/FlightResultsPage';
import HotelResultsPage from './pages/HotelResultsPage';
import TourGuideResultsPage from './pages/TourGuideResultsPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import Community from './pages/Community';
import Destinations from './pages/Destinations';
import NotFound from './pages/NotFound';
import Login from './pages/Login';

// Admin routes
import AdminLogin from './pages/AdminLogin';
import AdminAuthGuard from './components/admin/AdminAuthGuard';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import AdminPosts from './pages/AdminPosts';
import AdminCategories from './pages/AdminCategories';
import AdminCreatePost from './pages/AdminCreatePost';
import AdminComments from './pages/AdminComments';
import AdminCommunity from './pages/AdminCommunity';
import AdminSettings from './pages/AdminSettings';
import AdminAds from './pages/AdminAds';
import AdminHashtags from './pages/AdminHashtags';

// MongoDB initialization
import { mongoApiService } from './api/mongoApiService';
import { MOCK_POSTS, MOCK_CATEGORIES, MOCK_TOPICS } from './api/sampleData';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Post, Category, Topic } from '@/types/common';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Extend Window interface to include our custom property
declare global {
  interface Window {
    adsbygoogle: any[];
    adsInitialized?: boolean;
  }
}

// Initialize ads for all pages - Modified to prevent duplicate ad initialization
const initializePageAds = () => {
  try {
    // Only initialize ads if they haven't been pushed yet
    if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function' && 
        !window.adsInitialized) {
      window.adsInitialized = true;
      window.adsbygoogle.push({});
      console.log('Global ads initialized');
    }
  } catch (error) {
    console.error('Error initializing page ads:', error);
  }
};

// Initialize MongoDB collections with sample data
const initializeCollectionsWithSampleData = async (
  posts: Post[],
  categories: Category[],
  topics: Topic[]
) => {
  try {
    // Check if posts collection is empty and initialize with sample data if it is
    const existingPosts = await mongoApiService.queryDocuments('posts', {});
    if (existingPosts.length === 0 && posts.length > 0) {
      for (const post of posts) {
        await mongoApiService.insertDocument('posts', post);
      }
      console.log('[MongoDB] Initialized posts collection with sample data');
    }

    // Check if categories collection is empty and initialize with sample data if it is
    const existingCategories = await mongoApiService.queryDocuments('categories', {});
    if (existingCategories.length === 0 && categories.length > 0) {
      for (const category of categories) {
        await mongoApiService.insertDocument('categories', category);
      }
      console.log('[MongoDB] Initialized categories collection with sample data');
    }

    // Check if topics collection is empty and initialize with sample data if it is
    const existingTopics = await mongoApiService.queryDocuments('topics', {});
    if (existingTopics.length === 0 && topics.length > 0) {
      for (const topic of topics) {
        await mongoApiService.insertDocument('topics', topic);
      }
      console.log('[MongoDB] Initialized topics collection with sample data');
    }
  } catch (error) {
    console.error('[MongoDB] Error initializing collections with sample data:', error);
    throw error;
  }
};

// Initialize MongoDB with sample ad placements
const initAdPlacements = async () => {
  try {
    const { connectToDatabase } = await import('./api/mongodb');
    const { collections } = await connectToDatabase();
    
    const MOCK_ADS = [
      {
        name: 'Header Banner',
        slot: '1234567890',
        type: 'header',
        format: 'horizontal',
        location: 'all-pages',
        isEnabled: true,
        responsive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sidebar Ad',
        slot: '0987654321',
        type: 'sidebar',
        format: 'vertical',
        location: 'blog',
        isEnabled: true,
        responsive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Between Posts',
        slot: '1122334455',
        type: 'between-posts',
        format: 'auto',
        location: 'blog',
        isEnabled: true,
        responsive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Footer Ad',
        slot: '5566778899',
        type: 'footer',
        format: 'horizontal',
        location: 'all-pages',
        isEnabled: true,
        responsive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    // Check if ads collection has data
    if (collections && collections.ads) {
      const existingAds = await collections.ads.find({}).toArray();

      if (existingAds.length === 0) {
        await collections.ads.insertMany(MOCK_ADS);
        console.log('Ad placements initialized with sample data');
      }
    }
  } catch (error) {
    console.error('Error initializing ad placements:', error);
  }
};

const App = () => {
  useEffect(() => {
    const initDB = async () => {
      try {
        // Initialize MongoDB collections with sample data if they're empty
        await initializeCollectionsWithSampleData(
          MOCK_POSTS,
          MOCK_CATEGORIES,
          MOCK_TOPICS
        );
        await initAdPlacements();
        console.log('MongoDB initialized successfully (browser compatible version)');
      } catch (error) {
        console.error('Error initializing MongoDB:', error);
        toast({
          title: "Database Error",
          description: "Failed to initialize database. Please check your connection.",
          variant: "destructive"
        });
      }
    };

    // Initialize database
    initDB();
    
    // Initialize ads when app loads - only once
    const timeoutId = setTimeout(() => {
      initializePageAds();
    }, 1000); // Delay to ensure DOM is ready
    
    // Clean up timeout
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/travel" element={<Travel />} />
            <Route path="/travel/planner" element={<TravelPlanner />} />
            <Route path="/travel/flights" element={<FlightResultsPage />} />
            <Route path="/travel/hotels" element={<HotelResultsPage />} />
            <Route path="/travel/guides" element={<TourGuideResultsPage />} />
            <Route path="/travel/booking" element={<BookingPage />} />
            <Route path="/travel/booking/confirmation" element={<BookingConfirmationPage />} />
            <Route path="/community" element={<Community />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes - Updated for proper authentication flow */}
            <Route path="/admin" element={<Navigate to="/admin/login" />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminAuthGuard><AdminDashboard /></AdminAuthGuard>} />
            <Route path="/admin/posts" element={<AdminAuthGuard><AdminPosts /></AdminAuthGuard>} />
            <Route path="/admin/posts/create" element={<AdminAuthGuard><AdminCreatePost /></AdminAuthGuard>} />
            <Route path="/admin/categories" element={<AdminAuthGuard><AdminCategories /></AdminAuthGuard>} />
            <Route path="/admin/hashtags" element={<AdminAuthGuard><AdminHashtags /></AdminAuthGuard>} />
            <Route path="/admin/comments" element={<AdminAuthGuard><AdminComments /></AdminAuthGuard>} />
            <Route path="/admin/community" element={<AdminAuthGuard><AdminCommunity /></AdminAuthGuard>} />
            <Route path="/admin/settings" element={<AdminAuthGuard><AdminSettings /></AdminAuthGuard>} />
            <Route path="/admin/ads" element={<AdminAuthGuard><AdminAds /></AdminAuthGuard>} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
