
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    
    if (!isAuthenticated) {
      // If not authenticated, redirect to login
      toast({
        title: "Authentication required",
        description: "Please login to access the admin area",
        variant: "destructive",
      });
      navigate('/admin/login');
    } else {
      // If authenticated, redirect to dashboard
      navigate('/admin/dashboard');
    }
  }, [navigate, toast]);

  // This component doesn't render anything as it just redirects
  return null;
};

export default AdminPage;
