
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Always redirect to login page first
    navigate('/admin/login');
    // This ensures we don't rely on localStorage checking here
    // The AdminLogin component will handle checking if already logged in
  }, [navigate]);

  // This component doesn't render anything as it just redirects
  return null;
};

export default AdminPage;
