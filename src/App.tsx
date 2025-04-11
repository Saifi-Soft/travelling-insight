
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

// Initialize data
import { postsApi, categoriesApi, topicsApi } from './api/mongoApiService';
import { MOCK_POSTS, MOCK_CATEGORIES, MOCK_TOPICS } from './api/sampleData';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  useEffect(() => {
    // Initialize MongoDB collections with sample data
    const initializeData = async () => {
      try {
        await postsApi.initializeCollection(MOCK_POSTS);
        await categoriesApi.initializeCollection(MOCK_CATEGORIES);
        await topicsApi.initializeCollection(MOCK_TOPICS);
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };
    
    initializeData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
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
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
