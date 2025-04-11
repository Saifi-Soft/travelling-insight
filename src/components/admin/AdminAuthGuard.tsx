
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to access the admin area",
        variant: "destructive",
      });
      navigate('/admin-login');
    }
  }, [navigate, toast]);

  return <>{children}</>;
};

export default AdminAuthGuard;
