
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ContentModerationPanel from '@/components/admin/ContentModerationPanel';
import { Helmet } from 'react-helmet';

const AdminModeration = () => {
  return (
    <AdminLayout activeItem="community">
      <Helmet>
        <title>Content Moderation - Admin Dashboard</title>
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Content Moderation</h1>
          <p className="text-gray-500 mt-2">
            Review and manage moderated content and user warnings
          </p>
        </div>
        
        <ContentModerationPanel />
      </div>
    </AdminLayout>
  );
};

export default AdminModeration;
