
import { useState, useEffect } from 'react';

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

export function useSession() {
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
  
  return { session };
}
