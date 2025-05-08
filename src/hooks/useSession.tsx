
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { mongoApiService } from '@/api/mongoApiService';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

interface Session {
  user?: User;
  isAuthenticated: boolean;
}

interface SessionContextType {
  session: Session;
  setSession: React.Dispatch<React.SetStateAction<Session>>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [session, setSession] = useState<Session>({
    isAuthenticated: false
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check for user session in localStorage and validate with MongoDB
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const userId = localStorage.getItem('userId');
        const userEmail = localStorage.getItem('userEmail');
        
        if (userId && userEmail) {
          // Validate user exists in MongoDB
          const users = await mongoApiService.queryDocuments('users', { 
            _id: userId,
            email: userEmail 
          });
          
          if (users && users.length > 0) {
            // User exists, set session
            setSession({
              user: {
                id: userId,
                name: localStorage.getItem('userName') || users[0].name || undefined,
                email: userEmail,
                role: localStorage.getItem('userRole') || users[0].role || undefined
              },
              isAuthenticated: true
            });
            console.log('Session restored from localStorage and validated with MongoDB');
          } else {
            // User not found in MongoDB, clear localStorage
            console.log('User not found in MongoDB, clearing session');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userRole');
            localStorage.removeItem('community_user_id');
            setSession({ isAuthenticated: false });
          }
        }
      } catch (error) {
        console.error('Error validating session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);
  
  // Login function to authenticate user with MongoDB
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Check if user exists in MongoDB
      const users = await mongoApiService.queryDocuments('users', { email: email });
      
      // For demo purposes with MongoDB, we'll just check email (no password hashing for demo)
      if (users.length > 0) {
        // Store user ID in localStorage
        localStorage.setItem('userId', users[0]._id);
        localStorage.setItem('userName', users[0].name || 'Demo User');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', users[0].role || 'user');
        localStorage.setItem('community_user_id', users[0]._id);
        
        // Update state
        setSession({
          user: {
            id: users[0]._id,
            name: users[0].name || 'Demo User',
            email: email,
            role: users[0].role || 'user'
          },
          isAuthenticated: true
        });
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${users[0].name || 'Demo User'}!`,
        });
        
        return true;
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
        localStorage.setItem('userRole', 'user');
        
        // Update state
        setSession({
          user: {
            id: newUser.insertedId,
            name: 'Demo User',
            email: email,
            role: 'user'
          },
          isAuthenticated: true
        });
        
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
        
        toast({
          title: "Account Created",
          description: "Welcome! Your demo account has been created.",
        });
        
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "There was a problem logging in. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function to clear session data
  const logout = () => {
    // Clear all localStorage items related to session
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('community_user_id');
    
    // Update state
    setSession({
      isAuthenticated: false
    });
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };
  
  return (
    <SessionContext.Provider value={{ session, setSession, login, logout, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
