
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import CommentsAdmin from '@/components/admin/CommentsAdmin';

const AdminComments = () => {
  return (
    <AdminLayout activeItem="comments">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Comments Management</h1>
          <p className="text-gray-500 mt-2">Manage and moderate user comments</p>
        </div>
        
        <CommentsAdmin />
      </div>
    </AdminLayout>
  );
};

export default AdminComments;
