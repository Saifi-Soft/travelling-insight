
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    
    // If authenticated, redirect to dashboard, otherwise to login
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/login');
    }
  }, [navigate]);

  // This component doesn't render anything as it just redirects
  return null;
};

export default AdminPage;
