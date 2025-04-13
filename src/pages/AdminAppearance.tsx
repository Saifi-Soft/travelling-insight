
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeSettings from '@/components/admin/ThemeSettings';
import PresetThemes, { AppearanceTabsContext } from '@/components/admin/PresetThemes';
import AdvancedThemeSettings from '@/components/admin/AdvancedThemeSettings';
import GeneralThemeSettings from '@/components/admin/GeneralThemeSettings';

const AdminAppearance = () => {
  const [activeTab, setActiveTab] = useState('presets');
  
  return (
    <AdminLayout activeItem="appearance">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appearance</h1>
          <p className="text-muted-foreground">
            Customize the look and feel of your website.
          </p>
        </div>
        
        <AppearanceTabsContext.Provider value={{ activeTab, setActiveTab }}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="presets">Theme Presets</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="presets">
              <PresetThemes />
            </TabsContent>
            
            <TabsContent value="customize">
              <ThemeSettings />
            </TabsContent>
            
            <TabsContent value="general">
              <GeneralThemeSettings />
            </TabsContent>
            
            <TabsContent value="advanced">
              <AdvancedThemeSettings />
            </TabsContent>
          </Tabs>
        </AppearanceTabsContext.Provider>
      </div>
    </AdminLayout>
  );
};

export default AdminAppearance;
