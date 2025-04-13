import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSession, SessionProvider } from './hooks/useSession';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Post from './pages/Post';
import Destinations from './pages/Destinations';
import TravelPlanner from './pages/TravelPlanner';
import Community from './pages/Community';
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

// Add the import for AdminAppearance
import AdminAppearance from './pages/AdminAppearance';

const App: React.FC = () => {
  return (
    <SessionProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/post/:slug" element={<Post />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/travel/planner" element={<TravelPlanner />} />
            <Route path="/community" element={<Community />} />
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
                  <AdminCategories />}
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
