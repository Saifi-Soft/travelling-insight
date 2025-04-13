
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { mongoApiService } from '@/api/mongoApiService';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('adminAuth') === 'true';
      if (authStatus) {
        navigate('/admin/dashboard');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if admin collection exists in MongoDB
      const adminUsers = await mongoApiService.queryDocuments('adminUsers', {
        username: username
      });

      // If there's no admin user yet, accept hardcoded credentials
      if (adminUsers.length === 0) {
        // Hardcoded credentials for first login
        if (username === 'admin' && password === 'password') {
          // Store the first admin in the database
          await mongoApiService.insertDocument('adminUsers', {
            username: 'admin',
            passwordHash: 'password', // In a real app, you'd hash this
            role: 'superadmin',
            createdAt: new Date(),
            lastLogin: new Date()
          });
          
          localStorage.setItem('adminAuth', 'true');
          toast({
            title: "Login successful",
            description: "Welcome to the admin dashboard",
          });
          navigate('/admin/dashboard');
        } else {
          toast({
            title: "Login failed",
            description: "Invalid username or password",
            variant: "destructive",
          });
        }
      } else {
        // Verify against stored admin user
        const adminUser = adminUsers[0];
        if (adminUser && adminUser.passwordHash === password) { // In real app, compare hashed passwords
          // Update last login time
          await mongoApiService.updateDocument('adminUsers', adminUser._id, {
            lastLogin: new Date()
          });
          
          localStorage.setItem('adminAuth', 'true');
          toast({
            title: "Login successful",
            description: "Welcome back to the admin dashboard",
          });
          navigate('/admin/dashboard');
        } else {
          toast({
            title: "Login failed",
            description: "Invalid username or password",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 px-8 pb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Admin Login</h1>
            <p className="text-muted-foreground mt-2">Enter your credentials to access the admin dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium">Username</label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full"
                placeholder="admin"
                autoComplete="username"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
