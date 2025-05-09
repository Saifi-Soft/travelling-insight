
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { toast } from 'sonner';
import { authService, SessionData } from '@/services/authService';

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
    // Check for user session in localStorage and validate with database
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const validatedSession = await authService.validateSession();
        setSession(validatedSession);
        console.log('Session validated:', validatedSession.isAuthenticated);
      } catch (error) {
        console.error('Error validating session:', error);
        setSession({ isAuthenticated: false });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);
  
  // Login function to authenticate user
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      
      if (result.success && result.user) {
        // Update session state
        setSession({
          user: result.user,
          isAuthenticated: true
        });
        
        toast("Login Successful", {
          description: `Welcome back, ${result.user.name || 'User'}!`,
        });
        
        return true;
      } else {
        toast("Login Failed", {
          description: "Invalid password. Please try again.",
          style: { backgroundColor: 'red', color: 'white' }
        });
        return false;
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
    // Clear session data
    authService.logout();
    
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
