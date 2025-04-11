
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('adminAuth') === 'true';
      setIsAuthenticated(authStatus);
      
      if (!authStatus) {
        toast({
          title: "Authentication required",
          description: "Please login to access the admin area",
          variant: "destructive",
        });
        navigate('/admin-login');
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate, toast]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default AdminAuthGuard;
