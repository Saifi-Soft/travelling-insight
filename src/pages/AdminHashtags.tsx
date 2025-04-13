
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import HashtagsManagement from '@/components/admin/HashtagsManagement';
import { Helmet } from 'react-helmet';

const AdminHashtags = () => {
  return (
    <AdminLayout activeItem="hashtags">
      <Helmet>
        <title>Manage Hashtags - Admin Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Hashtags Management</h1>
          <p className="text-gray-500 mt-2">Create, edit, and manage hashtags for your content</p>
        </div>
        
        <HashtagsManagement />
      </div>
    </AdminLayout>
  );
};

export default AdminHashtags;
