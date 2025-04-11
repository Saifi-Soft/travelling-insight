
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Eye, 
  FolderOpen, 
  MessageSquare,
  TrendingUp 
} from 'lucide-react';

const AdminDashboard = () => {
  // Mock data for the dashboard stats
  const stats = [
    { 
      id: 'posts',
      title: 'Total Posts', 
      value: 0, 
      change: '+12.3%',
      changeText: 'from last month',
      icon: LayoutDashboard
    },
    { 
      id: 'views',
      title: 'Total Views', 
      value: 0, 
      change: '+19.5%',
      changeText: 'from last month',
      icon: Eye
    },
    { 
      id: 'categories',
      title: 'Categories', 
      value: 6, 
      change: '+7.2%',
      changeText: 'from last month',
      icon: FolderOpen
    },
    { 
      id: 'comments',
      title: 'Comments', 
      value: 0, 
      change: '+4.6%',
      changeText: 'from last month',
      icon: MessageSquare
    }
  ];

  return (
    <AdminLayout activeItem="dashboard">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.id} className="bg-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                  <p className="text-xs text-green-500 mt-1">
                    {stat.change} {stat.changeText}
                  </p>
                </div>
                <div className="p-2 rounded-full">
                  <stat.icon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="bg-white">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TabsContent value="overview" className="col-span-2">
              <Card className="bg-white p-6">
                <h3 className="text-xl font-bold mb-4">Overview</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Overview chart will appear here
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="col-span-2">
              <Card className="bg-white p-6">
                <h3 className="text-xl font-bold mb-4">Analytics</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Analytics data will appear here
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports" className="col-span-2">
              <Card className="bg-white p-6">
                <h3 className="text-xl font-bold mb-4">Reports</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Reports will appear here
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="col-span-2">
              <Card className="bg-white p-6">
                <h3 className="text-xl font-bold mb-4">Notifications</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Notifications will appear here
                </div>
              </Card>
            </TabsContent>
            
            {/* Recent Posts Sidebar */}
            <Card className="bg-white p-6 h-fit">
              <h3 className="text-xl font-bold mb-4">Recent Posts</h3>
              <p className="text-gray-500 mb-6">You published 0 posts this month.</p>
              <div className="h-64 flex items-center justify-center text-gray-400">
                Recent posts will appear here
              </div>
            </Card>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
