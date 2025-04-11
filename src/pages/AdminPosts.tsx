
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import PostsAdmin from '@/components/admin/PostsAdmin';
import HashtagsManagement from '@/components/admin/HashtagsManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminPosts = () => {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <AdminLayout activeItem="posts">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Content</h1>
          <p className="text-gray-500 mt-2">Create, edit, and manage your blog posts and hashtags</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="mt-6">
            <PostsAdmin />
          </TabsContent>
          
          <TabsContent value="hashtags" className="mt-6">
            <HashtagsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminPosts;
