
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

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
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>({
    isAuthenticated: false
  });
  
  useEffect(() => {
    // Check for user session in localStorage or cookies
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    
    if (userId) {
      setSession({
        user: {
          id: userId,
          name: userName || undefined,
          email: userEmail || undefined,
          role: userRole || undefined
        },
        isAuthenticated: true
      });
    }
  }, []);
  
  return (
    <SessionContext.Provider value={{ session, setSession }}>
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
