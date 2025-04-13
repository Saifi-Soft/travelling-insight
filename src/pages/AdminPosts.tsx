
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import PostsAdmin from '@/components/admin/PostsAdmin';
import HashtagsManagement from '@/components/admin/HashtagsManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { topicsApi } from '@/api/mongoApiService';
import { Helmet } from 'react-helmet';

const AdminPosts = () => {
  const [activeTab, setActiveTab] = useState('posts');
  
  // Fetch topics for the hashtags tab
  const { data: topics = [], isLoading } = useQuery({
    queryKey: ['topics'],
    queryFn: topicsApi.getAll,
  });

  return (
    <AdminLayout activeItem="posts">
      <Helmet>
        <title>Manage Content - Admin Dashboard</title>
      </Helmet>
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
