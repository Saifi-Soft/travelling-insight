
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostsManagement from '@/components/admin/PostsManagement';
import CategoriesManagement from '@/components/admin/CategoriesManagement';
import TopicsManagement from '@/components/admin/TopicsManagement';
import HashtagsManagement from '@/components/admin/HashtagsManagement';
import BookingsManagement from '@/components/admin/BookingsManagement';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const { toast } = useToast();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container-custom">
          <div className="flex flex-col mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your website content and view analytics</p>
          </div>
          
          <Tabs defaultValue="analytics" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>
            
            <TabsContent value="posts">
              <PostsManagement />
            </TabsContent>
            
            <TabsContent value="categories">
              <CategoriesManagement />
            </TabsContent>
            
            <TabsContent value="topics">
              <TopicsManagement />
            </TabsContent>
            
            <TabsContent value="hashtags">
              <HashtagsManagement />
            </TabsContent>
            
            <TabsContent value="bookings">
              <BookingsManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default AdminDashboard;
