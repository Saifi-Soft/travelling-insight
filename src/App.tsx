
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Destinations from "./pages/Destinations";
import Community from "./pages/Community";
import About from "./pages/About";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPosts from "./pages/AdminPosts";
import AdminCategories from "./pages/AdminCategories";
import AdminComments from "./pages/AdminComments";
import AdminCommunity from "./pages/AdminCommunity";
import AdminSettings from "./pages/AdminSettings";
import AdminCreatePost from "./pages/AdminCreatePost";
import AdminAuthGuard from "./components/admin/AdminAuthGuard";
import NotFound from "./pages/NotFound";

// Travel feature pages
import Travel from "./pages/Travel";
import TravelPlanner from "./pages/TravelPlanner";
import HotelResultsPage from "./pages/HotelResultsPage";
import FlightResultsPage from "./pages/FlightResultsPage";
import TourGuideResultsPage from "./pages/TourGuideResultsPage";
import BookingPage from "./pages/BookingPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";

const App = () => {
  // Move the query client creation inside the component function
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/community" element={<Community />} />
              <Route path="/about" element={<About />} />
              
              {/* Admin Login */}
              <Route path="/admin-login" element={<AdminLogin />} />
              
              {/* Protected Admin Routes */}
              <Route path="/admin" element={<AdminAuthGuard><AdminDashboard /></AdminAuthGuard>} />
              <Route path="/admin/posts" element={<AdminAuthGuard><AdminPosts /></AdminAuthGuard>} />
              <Route path="/admin/posts/new" element={<AdminAuthGuard><AdminCreatePost /></AdminAuthGuard>} />
              <Route path="/admin/categories" element={<AdminAuthGuard><AdminCategories /></AdminAuthGuard>} />
              <Route path="/admin/comments" element={<AdminAuthGuard><AdminComments /></AdminAuthGuard>} />
              <Route path="/admin/community" element={<AdminAuthGuard><AdminCommunity /></AdminAuthGuard>} />
              <Route path="/admin/settings" element={<AdminAuthGuard><AdminSettings /></AdminAuthGuard>} />
              
              {/* Legacy route - redirect to new admin dashboard */}
              <Route path="/admin-dashboard" element={<AdminAuthGuard><AdminDashboard /></AdminAuthGuard>} />
              
              {/* Travel Feature Routes */}
              <Route path="/travel" element={<Travel />} />
              <Route path="/travel/planner" element={<TravelPlanner />} />
              <Route path="/travel/hotels" element={<HotelResultsPage />} />
              <Route path="/travel/flights" element={<FlightResultsPage />} />
              <Route path="/travel/guides" element={<TourGuideResultsPage />} />
              <Route path="/travel/booking/:type/:id" element={<BookingPage />} />
              <Route path="/travel/confirmation/:type/:id" element={<BookingConfirmationPage />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
