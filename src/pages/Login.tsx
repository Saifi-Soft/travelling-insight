
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { mongoApiService } from '@/api/mongoApiService';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check if user exists in MongoDB
      const users = await mongoApiService.queryDocuments('users', { email: email });
      
      // For demo purposes with MongoDB, we'll just check email (no password hashing for demo)
      if (users.length > 0) {
        // Store user ID in localStorage
        localStorage.setItem('community_user_id', users[0]._id);
        
        toast.success('Login successful!');
        setTimeout(() => {
          // Return to community page if that's where they came from
          const previousPage = document.referrer.includes('/community') ? '/community' : '/';
          navigate(previousPage);
        }, 1000);
      } else {
        // If no user found, create a new one for demo purposes
        const newUser = await mongoApiService.insertDocument('users', {
          email,
          password: 'hashed_would_go_here',
          createdAt: new Date(),
        });
        
        localStorage.setItem('community_user_id', newUser.insertedId);
        
        toast.success('Account created and logged in!');
        setTimeout(() => {
          // Return to community page if that's where they came from
          const previousPage = document.referrer.includes('/community') ? '/community' : '/';
          navigate(previousPage);
        }, 1000);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="w-full max-w-md px-4">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="your.email@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button variant="link" className="p-0 h-auto font-normal text-xs" type="button">
                      Forgot password?
                    </Button>
                  </div>
                  <Input 
                    id="password"
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-gray-500">
                Don't have an account?{' '}
                <Button variant="link" className="p-0 h-auto" onClick={() => toast.info('Registration coming soon!')}>
                  Create an account
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
