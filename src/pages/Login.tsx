
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import { mongoApiService } from '@/api/mongoApiService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');
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
        localStorage.setItem('userId', users[0]._id);
        localStorage.setItem('userName', users[0].name || 'Demo User');
        localStorage.setItem('userEmail', email);
        
        toast.success('Login successful!');
        setTimeout(() => {
          // Return to community page if that's where they came from
          const previousPage = document.referrer.includes('/community') ? '/community' : '/';
          navigate(previousPage);
        }, 1000);
      } else {
        // If no user found, create a new one for demo purposes
        const newUser = await mongoApiService.insertDocument('users', {
          name: 'Demo User',
          email,
          password: 'hashed_would_go_here',
          role: 'user',
          isSubscribed: true, // Make demo user subscribed by default
          createdAt: new Date(),
        });
        
        localStorage.setItem('community_user_id', newUser.insertedId);
        localStorage.setItem('userId', newUser.insertedId);
        localStorage.setItem('userName', 'Demo User');
        localStorage.setItem('userEmail', email);
        
        // Create a subscription for the demo user
        try {
          await mongoApiService.insertDocument('subscriptions', {
            userId: newUser.insertedId,
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
        } catch (subError) {
          console.error('Error creating subscription:', subError);
        }
        
        toast.success('Demo account created and logged in!');
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
              <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200">
                <div className="flex items-start gap-3">
                  <InfoIcon className="h-5 w-5 mt-0.5" />
                  <AlertDescription className="text-sm text-left">
                    <strong>Demo credentials:</strong><br />
                    Email: demo@example.com<br />
                    Password: password123
                  </AlertDescription>
                </div>
              </Alert>
              
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
                <Link to="/register" className="text-primary hover:underline">
                  Create an account
                </Link>
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
