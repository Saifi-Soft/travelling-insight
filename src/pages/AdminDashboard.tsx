
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { 
  LayoutDashboard, 
  Eye, 
  FileText, 
  MessageSquare,
  Users,
  TrendingUp, 
  DollarSign,
  BarChart
} from 'lucide-react';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import AdsManagement from '@/components/admin/AdsManagement';
import PostsManagement from '@/components/admin/PostsManagement';
import { mongoApiService } from '@/api/mongoApiService';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Fetch dashboard stats from MongoDB
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      try {
        // Get posts count
        const posts = await mongoApiService.queryDocuments('posts', {});
        
        // Get comments count
        const comments = await mongoApiService.queryDocuments('comments', {});
        
        // Get users count
        const users = await mongoApiService.queryDocuments('communityUsers', {});
        
        // Get subscribers count
        const subscribers = await mongoApiService.queryDocuments('subscriptions', { 
          status: 'active' 
        });
        
        // Get ads count
        const ads = await mongoApiService.queryDocuments('ads', {});
        
        // Calculate total revenue from subscriptions
        const revenue = subscribers.reduce((total, sub) => total + (sub.amount || 0), 0);
        
        // Get pageviews (mock data for now)
        const pageviews = 12458;
        
        return {
          posts: posts.length,
          draftPosts: posts.filter(p => p.status === 'draft').length,
          publishedPosts: posts.filter(p => p.status === 'published').length,
          comments: comments.length,
          users: users.length,
          subscribers: subscribers.length,
          ads: ads.length,
          revenue,
          pageviews
        };
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch dashboard statistics",
        });
        
        // Return default values if error occurs
        return {
          posts: 0,
          draftPosts: 0,
          publishedPosts: 0,
          comments: 0,
          users: 0,
          subscribers: 0,
          ads: 0,
          revenue: 0,
          pageviews: 0
        };
      }
    },
    refetchInterval: 60000, // Refresh every minute
  });

  // Calculate stats data with fallbacks
  const stats = [
    { 
      id: 'posts',
      title: 'Total Posts', 
      value: statsLoading ? '...' : statsData?.posts || 0, 
      change: '+12.3%',
      changeText: 'from last month',
      icon: FileText,
      description: statsLoading ? 'Loading...' : `${statsData?.publishedPosts || 0} published, ${statsData?.draftPosts || 0} drafts`
    },
    { 
      id: 'views',
      title: 'Total Pageviews', 
      value: statsLoading ? '...' : statsData?.pageviews || 0, 
      change: '+19.5%',
      changeText: 'from last month',
      icon: Eye,
      description: 'Unique visitors'
    },
    { 
      id: 'comments',
      title: 'Comments', 
      value: statsLoading ? '...' : statsData?.comments || 0, 
      change: '+4.6%',
      changeText: 'from last month',
      icon: MessageSquare,
      description: 'Engagement metric'
    },
    { 
      id: 'subscribers',
      title: 'Subscribers', 
      value: statsLoading ? '...' : statsData?.subscribers || 0, 
      change: '+24.5%',
      changeText: 'from last month',
      icon: Users,
      description: 'Active community members'
    },
    { 
      id: 'revenue',
      title: 'Revenue', 
      value: statsLoading ? '...' : `$${(statsData?.revenue || 0).toLocaleString()}`, 
      change: '+32.7%',
      changeText: 'from last month',
      icon: DollarSign,
      description: 'From subscriptions'
    },
    { 
      id: 'ads',
      title: 'Active Ads', 
      value: statsLoading ? '...' : statsData?.ads || 0, 
      change: '+8.2%',
      changeText: 'from last month',
      icon: BarChart,
      description: 'Ad placements'
    }
  ];

  return (
    <AdminLayout activeItem="dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Refreshing data",
                  description: "Dashboard data is being refreshed."
                });
                // This will trigger a refetch of all queries on this page
                window.location.reload();
              }}
            >
              Refresh Data
            </Button>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.slice(0, 6).map((stat) => (
            <Card key={stat.id} className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className="h-8 w-8 rounded-full bg-gray-100 p-1">
                  <stat.icon className="h-6 w-6 text-gray-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex flex-col">
                  <span className="text-xs text-green-500">
                    {stat.change} {stat.changeText}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Dashboard Tabs */}
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="ads">Ads</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="overview" className="mt-0">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Dashboard Overview</CardTitle>
                  <CardDescription>
                    Summary of your blog performance and key metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <AnalyticsDashboard />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Detailed Analytics</CardTitle>
                  <CardDescription>
                    Complete analytics and performance data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[400px]">
                    <AnalyticsDashboard />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content" className="mt-0">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                  <CardDescription>
                    Manage posts, categories, and topics
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <PostsManagement />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ads" className="mt-0">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Ad Management</CardTitle>
                  <CardDescription>
                    Manage ad placements and campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <AdsManagement />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="subscriptions" className="mt-0">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Subscription Management</CardTitle>
                  <CardDescription>
                    Manage subscription plans and subscribers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[400px]">
                    <SubscriptionManagement />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="community" className="mt-0">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Community Management</CardTitle>
                  <CardDescription>
                    Manage community users, groups, and events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[400px]">
                    <CommunityManagement />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

// Create placeholder components for features that need to be implemented
const SubscriptionManagement = () => {
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      try {
        return await mongoApiService.queryDocuments('subscriptions', {});
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        return [];
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Active Subscriptions</h2>
        <Button>Export Data</Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Loading subscription data...</div>
      ) : subscriptions?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No subscription data available</div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Plan</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Start Date</th>
                <th className="px-4 py-2 text-left">End Date</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions?.map((sub, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2">{sub.userId}</td>
                  <td className="px-4 py-2">{sub.planType}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sub.status === 'active' ? 'bg-green-100 text-green-800' : 
                      sub.status === 'canceled' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{sub.startDate ? new Date(sub.startDate).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-2">{sub.endDate ? new Date(sub.endDate).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-2">${sub.amount || 0}</td>
                  <td className="px-4 py-2">
                    <Button variant="outline" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const CommunityManagement = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['communityUsers'],
    queryFn: async () => {
      try {
        return await mongoApiService.queryDocuments('communityUsers', {});
      } catch (error) {
        console.error("Error fetching community users:", error);
        return [];
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Community Members</h2>
        <div className="space-x-2">
          <Button variant="outline">Manage Groups</Button>
          <Button>Add User</Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Loading community data...</div>
      ) : users?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No community users available</div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Member Since</th>
                <th className="px-4 py-2 text-left">Subscription</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 
                      user.status === 'blocked' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-2">{user.subscriptionTier || 'None'}</td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
