
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostsAdmin from '@/components/admin/PostsAdmin';
import CategoriesAdmin from '@/components/admin/CategoriesAdmin';
import TopicsAdmin from '@/components/admin/TopicsAdmin';
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Button } from '@/components/ui/button';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Function to navigate to specific admin pages
  const navigateToAdminSection = (section: string) => {
    switch (section) {
      case 'dashboard':
        navigate('/admin/dashboard');
        break;
      case 'ads':
        navigate('/admin/ads');
        break;
      case 'community':
        navigate('/admin/community');
        break;
      default:
        // For other tabs, stay on this page and switch tabs
        setActiveTab(section);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container-custom">
          <div className="flex flex-col mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground mb-6">Manage your content and settings</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <Button 
                variant="outline" 
                onClick={() => navigateToAdminSection('dashboard')}
              >
                Main Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigateToAdminSection('ads')}
              >
                Ads Management
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigateToAdminSection('community')}
              >
                Community Management
              </Button>
            </div>
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
