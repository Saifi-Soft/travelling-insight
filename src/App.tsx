
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Destinations from "./pages/Destinations";
import Community from "./pages/Community";
import About from "./pages/About";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Travel feature pages
import Travel from "./pages/Travel";
import TravelPlanner from "./pages/TravelPlanner";
import HotelResultsPage from "./pages/HotelResultsPage";
import FlightResultsPage from "./pages/FlightResultsPage";
import TourGuideResultsPage from "./pages/TourGuideResultsPage";
import BookingPage from "./pages/BookingPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";

// Create a query client with appropriate settings for auto-refresh
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/community" element={<Community />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<Admin />} />
          
          {/* Travel Feature Routes */}
          <Route path="/travel" element={<Travel />} />
          <Route path="/travel/planner" element={<TravelPlanner />} />
          <Route path="/travel/hotels" element={<HotelResultsPage />} />
          <Route path="/travel/flights" element={<FlightResultsPage />} />
          <Route path="/travel/guides" element={<TourGuideResultsPage />} />
          <Route path="/travel/booking/:type/:id" element={<BookingPage />} />
          <Route path="/travel/confirmation/:type/:id" element={<BookingConfirmationPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
