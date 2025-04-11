
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import PostsAdmin from '@/components/admin/PostsAdmin';

const AdminPosts = () => {
  return (
    <AdminLayout activeItem="posts">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Posts</h1>
          <p className="text-gray-500 mt-2">Create, edit, and manage your blog posts</p>
        </div>
        
        <PostsAdmin />
      </div>
    </AdminLayout>
  );
};

export default AdminPosts;
