
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Immediately redirect to login page
    navigate('/admin/login');
  }, [navigate]);

  // This component doesn't render anything as it just redirects
  return null;
};

export default AdminPage;
