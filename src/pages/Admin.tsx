
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Always redirect to login page first
    navigate('/admin/login');
  }, [navigate]);

  // This component doesn't render anything as it just redirects
  return null;
};

export default AdminPage;
