
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostsAdmin from '@/components/admin/PostsAdmin';
import CategoriesAdmin from '@/components/admin/CategoriesAdmin';
import TopicsAdmin from '@/components/admin/TopicsAdmin';
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const { toast } = useToast();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container-custom">
          <div className="flex flex-col mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your blog content</p>
          </div>
          
          <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="topics">Topics / Tags</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts">
              <PostsAdmin />
            </TabsContent>
            
            <TabsContent value="categories">
              <CategoriesAdmin />
            </TabsContent>
            
            <TabsContent value="topics">
              <TopicsAdmin />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default AdminPage;
