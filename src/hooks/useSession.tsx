
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { mongoDbService } from '@/api/mongoDbService';
import { toast } from 'sonner';

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
          const user = await mongoDbService.findOne('users', { 
            email: userEmail 
          });
          
          if (user) {
            // User exists, set session
            setSession({
              user: {
                id: user._id.toString(),
                name: localStorage.getItem('userName') || user.name || undefined,
                email: userEmail,
                role: localStorage.getItem('userRole') || user.role || undefined
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
      const user = await mongoDbService.findOne('users', { email: email });
      
      if (user) {
        // In a production app, you would verify the password hash here
        // For now, we'll just check if the password matches directly (NOT SECURE FOR PRODUCTION)
        if (user.password === password) {
          const userId = user._id.toString();
          
          // Store user ID in localStorage
          localStorage.setItem('userId', userId);
          localStorage.setItem('userName', user.name || 'User');
          localStorage.setItem('userEmail', email);
          localStorage.setItem('userRole', user.role || 'user');
          localStorage.setItem('community_user_id', userId);
          
          // Update state
          setSession({
            user: {
              id: userId,
              name: user.name || 'User',
              email: email,
              role: user.role || 'user'
            },
            isAuthenticated: true
          });
          
          toast("Login Successful", {
            description: `Welcome back, ${user.name || 'User'}!`,
          });
          
          return true;
        } else {
          toast("Login Failed", {
            description: "Invalid password. Please try again.",
            style: { backgroundColor: 'red', color: 'white' }
          });
          return false;
        }
      } else {
        // If no user found, create a new one for demo purposes
        const newUser = await mongoDbService.insertOne('users', {
          name: 'Demo User',
          email,
          password: password, // In production, this should be hashed
          role: 'user',
          isSubscribed: true, // Make demo user subscribed by default
          createdAt: new Date(),
        });
        
        const userId = newUser.insertedId.toString();
        
        localStorage.setItem('community_user_id', userId);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', 'Demo User');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', 'user');
        
        // Update state
        setSession({
          user: {
            id: userId,
            name: 'Demo User',
            email: email,
            role: 'user'
          },
          isAuthenticated: true
        });
        
        // Create a subscription for the demo user
        try {
          await mongoDbService.insertOne('subscriptions', {
            userId: userId,
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
        
        toast("Account Created", {
          description: "Welcome! Your demo account has been created.",
        });
        
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast("Login Failed", {
        description: "There was a problem logging in. Please try again.",
        style: { backgroundColor: 'red', color: 'white' }
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
    
    toast("Logged Out", {
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

