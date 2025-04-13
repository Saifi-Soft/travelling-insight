
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeSettings from '@/components/admin/ThemeSettings';
import PresetThemes from '@/components/admin/PresetThemes';

const AdminAppearance = () => {
  return (
    <AdminLayout activeItem="appearance">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appearance</h1>
          <p className="text-muted-foreground">
            Customize the look and feel of your website.
          </p>
        </div>
        
        <Tabs defaultValue="presets">
          <TabsList className="mb-4">
            <TabsTrigger value="presets">Theme Presets</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets">
            <PresetThemes />
          </TabsContent>
          
          <TabsContent value="customize">
            <ThemeSettings />
          </TabsContent>
          
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Appearance Settings</CardTitle>
                <CardDescription>
                  Fine-tune advanced visual settings for your website.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Advanced appearance settings will be implemented soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminAppearance;
