
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdsManagement from '@/components/admin/AdsManagement';
import AdsAnalytics from '@/components/admin/AdsAnalytics';
import AdsPaymentSetup from '@/components/admin/AdsPaymentSetup';

const AdminAds = () => {
  const [activeTab, setActiveTab] = useState("placements");

  return (
    <AdminLayout activeItem="ads">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Ads Management</h1>
          <p className="text-gray-500 mt-2">Manage your ad placements, view analytics, and configure payment settings</p>
        </div>

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
