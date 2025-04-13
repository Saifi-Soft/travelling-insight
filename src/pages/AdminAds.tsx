
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdsManagement from '@/components/admin/AdsManagement';
import AdsAnalytics from '@/components/admin/AdsAnalytics';
import AdsPaymentSetup from '@/components/admin/AdsPaymentSetup';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { adStatsApi } from '@/api/adService';

const AdminAds = () => {
  const [activeTab, setActiveTab] = useState("placements");
  
  // Fetch aggregated ad statistics
  const { data: adStats, isLoading: statsLoading } = useQuery({
    queryKey: ['adStats'],
    queryFn: () => adStatsApi.getAllStats(30), // Get stats for the last 30 days
    refetchInterval: 60000 // Refresh every minute
  });

  // Stats cards for the top of the page
  const statsCards = [
    {
      title: "Total Impressions",
      value: statsLoading ? "Loading..." : (adStats?.totalImpressions || 0).toLocaleString(),
      description: "Last 30 days"
    },
    {
      title: "Total Clicks",
      value: statsLoading ? "Loading..." : (adStats?.totalClicks || 0).toLocaleString(),
      description: "Last 30 days"
    },
    {
      title: "Average CTR",
      value: statsLoading ? "Loading..." : `${(adStats?.totalCtr || 0).toFixed(2)}%`,
      description: "Click-through rate"
    },
    {
      title: "Total Revenue",
      value: statsLoading ? "Loading..." : `$${(adStats?.totalRevenue || 0).toFixed(2)}`,
      description: "Last 30 days"
    }
  ];

  return (
    <AdminLayout activeItem="ads">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Ads Management</h1>
          <p className="text-gray-500 mt-2">Manage your ad placements, view analytics, and configure payment settings</p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-[500px]">
            <TabsTrigger value="placements">Ad Placements</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="payments">Payment Setup</TabsTrigger>
          </TabsList>
          
          <TabsContent value="placements" className="mt-6">
            <AdsManagement />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <AdsAnalytics />
          </TabsContent>
          
          <TabsContent value="payments" className="mt-6">
            <AdsPaymentSetup />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminAds;
