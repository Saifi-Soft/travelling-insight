
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

// MongoDB initialization
import { initializeCollectionsWithSampleData } from './api/mongoApiService';
import { MOCK_POSTS, MOCK_CATEGORIES, MOCK_TOPICS } from './api/sampleData';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

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

// Initialize ads for all pages
const initializePageAds = () => {
  try {
    // Force a push of any pending ads
    if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
      window.adsbygoogle.push({});
      console.log('Global ads initialized');
    }
  } catch (error) {
    console.error('Error initializing page ads:', error);
  }
};

// Initialize MongoDB with sample ad placements
const initAdPlacements = async () => {
  try {
    const { collections } = await import('./api/mongodb');
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
    const adsCollection = collections.ads;
    const existingAds = await adsCollection.find().toArray();

    if (existingAds.length === 0) {
      await adsCollection.insertMany(MOCK_ADS);
      console.log('Ad placements initialized with sample data');
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
    
    // Initialize ads when app loads
    initializePageAds();
    
    // Also initialize ads when route changes
    window.addEventListener('popstate', initializePageAds);
    
    return () => {
      window.removeEventListener('popstate', initializePageAds);
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
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminAuthGuard><Admin /></AdminAuthGuard>} />
            <Route path="/admin/dashboard" element={<AdminAuthGuard><AdminDashboard /></AdminAuthGuard>} />
            <Route path="/admin/posts" element={<AdminAuthGuard><AdminPosts /></AdminAuthGuard>} />
            <Route path="/admin/posts/create" element={<AdminAuthGuard><AdminCreatePost /></AdminAuthGuard>} />
            <Route path="/admin/categories" element={<AdminAuthGuard><AdminCategories /></AdminAuthGuard>} />
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
