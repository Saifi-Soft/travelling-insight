
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSession, SessionProvider } from './hooks/useSession';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Blog from './pages/Blog';
import Post from './pages/Post';
import Destinations from './pages/Destinations';
import TravelPlanner from './pages/TravelPlanner';
import Community from './pages/Community';
import CommunityHub from './pages/CommunityHub';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import SearchModal from './components/SearchModal';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminPosts from './pages/AdminPosts';
import AdminCategories from './pages/AdminCategories';
import AdminComments from './pages/AdminComments';
import AdminCommunity from './pages/AdminCommunity';
import AdminSettings from './pages/AdminSettings';
import AdminAds from './pages/AdminAds';
import AdminHashtags from './pages/AdminHashtags';
import { communityApi } from './api/communityApiService';
import { toast } from 'sonner';
// Import the Index component instead of Home
import Index from './pages/Index';

// Add the import for AdminAppearance
import AdminAppearance from './pages/AdminAppearance';

const App: React.FC = () => {
  return (
    <SessionProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/post/:slug" element={<Post />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/travel/planner" element={<TravelPlanner />} />
            <Route path="/community" element={<CommunityRouter />} />
            <Route path="/community-hub" element={<CommunityAuthGuard><CommunityHub /></CommunityAuthGuard>} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminAuthGuard>
                  <AdminDashboard />
                </AdminAuthGuard>
              } 
            />
            <Route 
              path="/admin/appearance" 
              element={
                <AdminAuthGuard>
                  <AdminAppearance />
                </AdminAuthGuard>
              }
            />
            <Route 
              path="/admin/posts" 
              element={
                <AdminAuthGuard>
                  <AdminPosts />
                </AdminAuthGuard>
              } 
            />
            <Route 
              path="/admin/categories" 
              element={
                <AdminAuthGuard>
                  <AdminCategories />
                </AdminAuthGuard>
              } 
            />
            <Route 
              path="/admin/hashtags" 
              element={
                <AdminAuthGuard>
                  <AdminHashtags />
                </AdminAuthGuard>
              } 
            />
            <Route 
              path="/admin/comments" 
              element={
                <AdminAuthGuard>
                  <AdminComments />
                </AdminAuthGuard>
              } 
            />
            <Route 
              path="/admin/community" 
              element={
                <AdminAuthGuard>
                  <AdminCommunity />
                </AdminAuthGuard>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <AdminAuthGuard>
                  <AdminSettings />
                </AdminAuthGuard>
              } 
            />
            <Route 
              path="/admin/ads" 
              element={
                <AdminAuthGuard>
                  <AdminAds />
                </AdminAuthGuard>
              } 
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </SessionProvider>
  );
};

// Router component to direct users to the appropriate community page based on subscription status
const CommunityRouter: React.FC = () => {
  const { session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  useEffect(() => {
    const checkSubscription = async () => {
      if (session.user?.id) {
        try {
          console.log("Checking subscription for user:", session.user.id);
          const subscriptionData = await communityApi.payments.getSubscription(session.user.id);
          console.log("Subscription data:", subscriptionData);
          setIsSubscribed(subscriptionData && subscriptionData.status === 'active');
        } catch (error) {
          console.error('Error checking subscription status:', error);
        }
      }
      setIsLoading(false);
    };
    
    checkSubscription();
  }, [session.user?.id]);
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (session.isAuthenticated && isSubscribed) {
    console.log("User is authenticated and subscribed, redirecting to community-hub");
    return <Navigate to="/community-hub" replace />;
  }
  
  console.log("User is not authenticated or not subscribed, showing Community page");
  return <Community />;
};

// Authentication guard for community hub
const CommunityAuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useSession();
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkSubscriptionWithRetry = async () => {
      if (!session.user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("CommunityAuthGuard: Checking subscription for user:", session.user.id);
        const subscriptionData = await communityApi.payments.getSubscription(session.user.id);
        console.log("CommunityAuthGuard: Subscription data:", subscriptionData);
        
        // Check if subscription is active
        if (subscriptionData && subscriptionData.status === 'active') {
          console.log("CommunityAuthGuard: User has active subscription");
          setIsSubscribed(true);
          
          // Create any missing database entries for demo if needed
          const userId = localStorage.getItem('community_user_id');
          if (userId) {
            // Check if user exists in MongoDB
            const mongoApiService = (await import('@/api/mongoApiService')).mongoApiService;
            const users = await mongoApiService.queryDocuments('subscriptions', { userId });
            
            if (users.length === 0) {
              // Create demo subscription in MongoDB if it doesn't exist
              await mongoApiService.insertDocument('subscriptions', {
                userId: session.user.id,
                planType: 'monthly',
                status: 'active',
                paymentMethod: {
                  method: 'credit_card',
                  cardLastFour: '4242',
                  expiryDate: '12/25'
                },
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                amount: 9.99,
                autoRenew: true,
                createdAt: new Date(),
                updatedAt: new Date()
              });
              console.log("CommunityAuthGuard: Created demo subscription in MongoDB");
            }
          }
        } else {
          console.log("CommunityAuthGuard: User does not have active subscription");
          setIsSubscribed(false);
        }
      } catch (error) {
        console.error('CommunityAuthGuard: Error checking subscription status:', error);
        setIsSubscribed(false);
      }
      
      setIsLoading(false);
    };
    
    checkSubscriptionWithRetry();
  }, [session.user?.id]);
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session.isAuthenticated) {
    console.log("CommunityAuthGuard: User is not authenticated, redirecting to login");
    toast.error("Please login to access the community hub");
    return <Navigate to="/login" replace />;
  }
  
  if (isSubscribed === false) {
    console.log("CommunityAuthGuard: User is not subscribed, redirecting to community page");
    toast.error("You need an active subscription to access the community hub");
    return <Navigate to="/community" replace />;
  }

  console.log("CommunityAuthGuard: User is authenticated and subscribed, showing community hub");
  return <>{children}</>;
};

// Authentication guard for admin routes
const AdminAuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useSession();
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';

  useEffect(() => {
    // Check if the user is logged in
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to /admin/login');
    }
  }, [isAuthenticated, session]);

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default App;
