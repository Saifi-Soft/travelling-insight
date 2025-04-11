import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Brush,
  Check
} from 'lucide-react';

const AdminSettings = () => {
  const { toast } = useToast();
  const { theme, themeColors, setTheme, updateThemeColor } = useTheme();
  
  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    blogName: 'Travelling Insight',
    blogDescription: 'Discover the world through our insightful travel guides and tips',
    contactEmail: 'contact@travellinginsight.com'
  });
  
  // SEO settings
  const [seoSettings, setSeoSettings] = useState({
    metaTitle: 'Travelling Insight - Travel Guides and Tips',
    metaDescription: 'Discover amazing travel destinations, tips, and guides from around the world.',
    keywords: 'travel, destinations, guides, tips, adventure, tourism',
    generateSitemap: true
  });
  
  // Comment settings
  const [commentSettings, setCommentSettings] = useState({
    enableComments: true,
    requireModeration: true,
    emailNotifications: true
  });
  
  // API settings
  const [apiSettings, setApiSettings] = useState({
    apiKey: '•••••••••••••••••••••••••••••••',
    googleAnalyticsConnected: false,
    mailchimpConnected: false
  });
  
  // Theme preview colors
  const [previewColors, setPreviewColors] = useState({...themeColors});
  
  // Update preview colors when actual theme changes
  useEffect(() => {
    setPreviewColors({...themeColors});
  }, [themeColors]);
  
  const handleGeneralSettingsSave = () => {
    // In a real app, you would save to an API
    toast({
      title: "Success",
      description: "General settings saved successfully",
    });
  };
  
  const handleSeoSettingsSave = () => {
    toast({
      title: "Success",
      description: "SEO settings saved successfully",
    });
  };
  
  const handleThemeSettingsSave = () => {
    // Apply all theme color changes at once
    Object.entries(previewColors).forEach(([key, value]) => {
      updateThemeColor(key as keyof typeof themeColors, value);
    });
    
    toast({
      title: "Success",
      description: "Theme settings saved successfully",
    });
  };
  
  const handleCommentSettingsSave = () => {
    toast({
      title: "Success",
      description: "Comment preferences saved successfully",
    });
  };
  
  const handleApiSettingsSave = () => {
    toast({
      title: "Success",
      description: "API settings saved successfully",
    });
  };
  
  const handleRegenerateApiKey = () => {
    // In a real app, you would call an API to regenerate the key
    setApiSettings({
      ...apiSettings,
      apiKey: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    });
    
    toast({
      title: "Success",
      description: "API key regenerated successfully",
    });
  };

  const handlePreviewColorChange = (colorType: keyof typeof previewColors, value: string) => {
    setPreviewColors(prev => ({
      ...prev,
      [colorType]: value
    }));
  };

  // Color palettes for quick selection
  const colorPalettes = [
    {
      name: 'Blue',
      primary: '#3b82f6',
      background: '#ffffff',
      foreground: '#222222',
      footer: '#1e40af',
      header: '#ffffff',
      card: '#f8f9fa',
    },
    {
      name: 'Green',
      primary: '#10b981',
      background: '#f8fafc',
      foreground: '#334155',
      footer: '#064e3b',
      header: '#f0fdf4',
      card: '#ecfdf5',
    },
    {
      name: 'Purple',
      primary: '#8b5cf6',
      background: '#ffffff',
      foreground: '#1f2937',
      footer: '#5b21b6',
      header: '#f5f3ff',
      card: '#f3f4f6',
    },
    {
      name: 'Orange',
      primary: '#f97316',
      background: '#ffffff',
      foreground: '#1f2937',
      footer: '#9a3412',
      header: '#fff7ed',
      card: '#f9fafb',
    }
  ];

  const applyColorPalette = (palette: typeof colorPalettes[0]) => {
    setPreviewColors({
      primary: palette.primary,
      background: palette.background,
      foreground: palette.foreground,
      footer: palette.footer,
      header: palette.header,
      card: palette.card,
    });
  };

  return (
    <AdminLayout activeItem="settings">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your blog settings and preferences</p>
        
        <Tabs defaultValue="general">
          <TabsList className="bg-white">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="api">API & Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-2">Blog Information</h2>
                    <p className="text-sm text-gray-500 mb-4">Update your blog details and contact information</p>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="blog-name" className="text-sm font-medium">Blog Name</label>
                        <Input
                          id="blog-name"
                          value={generalSettings.blogName}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, blogName: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="blog-description" className="text-sm font-medium">Blog Description</label>
                        <Textarea
                          id="blog-description"
                          value={generalSettings.blogDescription}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, blogDescription: e.target.value })}
                          className="min-h-[80px]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="contact-email" className="text-sm font-medium">Contact Email</label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={generalSettings.contactEmail}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                        />
                      </div>
                      
                      <Button 
                        onClick={handleGeneralSettingsSave}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-6 space-y-4">
                    <h2 className="text-xl font-bold mb-2">Comments</h2>
                    <p className="text-sm text-gray-500 mb-4">Configure how comments are handled on your blog</p>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Enable Comments</h3>
                          <p className="text-sm text-gray-500">Allow visitors to leave comments on your posts</p>
                        </div>
                        <Switch 
                          checked={commentSettings.enableComments} 
                          onCheckedChange={(checked) => setCommentSettings({ ...commentSettings, enableComments: checked })}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Comment Moderation</h3>
                          <p className="text-sm text-gray-500">Review and approve comments before they are published</p>
                        </div>
                        <Switch 
                          checked={commentSettings.requireModeration} 
                          onCheckedChange={(checked) => setCommentSettings({ ...commentSettings, requireModeration: checked })}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-gray-500">Receive email notifications for new comments</p>
                        </div>
                        <Switch 
                          checked={commentSettings.emailNotifications} 
                          onCheckedChange={(checked) => setCommentSettings({ ...commentSettings, emailNotifications: checked })}
                        />
                      </div>
                      
                      <Button 
                        onClick={handleCommentSettingsSave}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-2">Theme Settings</h2>
                    <p className="text-sm text-gray-500 mb-4">Customize the appearance of your blog</p>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Theme Mode</label>
                        <div className="grid grid-cols-3 gap-4">
                          <Button 
                            variant={theme === 'light' ? 'default' : 'outline'}
                            className={theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                            onClick={() => setTheme('light')}
                          >
                            <Sun className="h-4 w-4 mr-2" />
                            Light
                          </Button>
                          <Button 
                            variant={theme === 'dark' ? 'default' : 'outline'}
                            className={theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                            onClick={() => setTheme('dark')}
                          >
                            <Moon className="h-4 w-4 mr-2" />
                            Dark
                          </Button>
                          <Button 
                            variant={theme === 'system' ? 'default' : 'outline'}
                            className={theme === 'system' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                            onClick={() => setTheme('system')}
                          >
                            <Monitor className="h-4 w-4 mr-2" />
                            System
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-3 pt-4 border-t">
                        <h3 className="text-lg font-medium">Color Settings</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Theme Presets</label>
                            <div className="grid grid-cols-2 gap-2">
                              {colorPalettes.map((palette) => (
                                <Button
                                  key={palette.name}
                                  variant="outline"
                                  className="flex items-center justify-center py-4"
                                  onClick={() => applyColorPalette(palette)}
                                >
                                  <div className="flex flex-col items-center">
                                    <div 
                                      className="w-8 h-8 rounded-full mb-2" 
                                      style={{backgroundColor: palette.primary}}
                                    />
                                    <span>{palette.name}</span>
                                  </div>
                                </Button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-md" style={{backgroundColor: previewColors.background, color: previewColors.foreground}}>
                            <h4 className="font-bold mb-2">Preview</h4>
                            <div className="p-2 rounded mb-2" style={{backgroundColor: previewColors.header}}>
                              Header
                            </div>
                            <div className="p-2 rounded mb-2" style={{backgroundColor: previewColors.card}}>
                              Card
                            </div>
                            <div className="mb-2">
                              <span style={{color: previewColors.primary}}>Primary Text</span>
                            </div>
                            <div className="p-2 rounded" style={{backgroundColor: previewColors.footer, color: '#ffffff'}}>
                              Footer
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 pt-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Primary Color</label>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-6 h-6 rounded-full border"
                                  style={{backgroundColor: previewColors.primary}}
                                />
                                <Input
                                  type="color"
                                  value={previewColors.primary}
                                  onChange={(e) => handlePreviewColorChange('primary', e.target.value)}
                                  className="w-16 p-0 h-8"
                                />
                                <Input
                                  type="text"
                                  value={previewColors.primary}
                                  onChange={(e) => handlePreviewColorChange('primary', e.target.value)}
                                  className="flex-grow"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Background Color</label>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-6 h-6 rounded-full border"
                                  style={{backgroundColor: previewColors.background}}
                                />
                                <Input
                                  type="color"
                                  value={previewColors.background}
                                  onChange={(e) => handlePreviewColorChange('background', e.target.value)}
                                  className="w-16 p-0 h-8"
                                />
                                <Input
                                  type="text"
                                  value={previewColors.background}
                                  onChange={(e) => handlePreviewColorChange('background', e.target.value)}
                                  className="flex-grow"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Text Color</label>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-6 h-6 rounded-full border"
                                  style={{backgroundColor: previewColors.foreground}}
                                />
                                <Input
                                  type="color"
                                  value={previewColors.foreground}
                                  onChange={(e) => handlePreviewColorChange('foreground', e.target.value)}
                                  className="w-16 p-0 h-8"
                                />
                                <Input
                                  type="text"
                                  value={previewColors.foreground}
                                  onChange={(e) => handlePreviewColorChange('foreground', e.target.value)}
                                  className="flex-grow"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Header Color</label>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-6 h-6 rounded-full border"
                                  style={{backgroundColor: previewColors.header}}
                                />
                                <Input
                                  type="color"
                                  value={previewColors.header}
                                  onChange={(e) => handlePreviewColorChange('header', e.target.value)}
                                  className="w-16 p-0 h-8"
                                />
                                <Input
                                  type="text"
                                  value={previewColors.header}
                                  onChange={(e) => handlePreviewColorChange('header', e.target.value)}
                                  className="flex-grow"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Footer Color</label>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-6 h-6 rounded-full border"
                                  style={{backgroundColor: previewColors.footer}}
                                />
                                <Input
                                  type="color"
                                  value={previewColors.footer}
                                  onChange={(e) => handlePreviewColorChange('footer', e.target.value)}
                                  className="w-16 p-0 h-8"
                                />
                                <Input
                                  type="text"
                                  value={previewColors.footer}
                                  onChange={(e) => handlePreviewColorChange('footer', e.target.value)}
                                  className="flex-grow"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Card Color</label>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-6 h-6 rounded-full border"
                                  style={{backgroundColor: previewColors.card}}
                                />
                                <Input
                                  type="color"
                                  value={previewColors.card}
                                  onChange={(e) => handlePreviewColorChange('card', e.target.value)}
                                  className="w-16 p-0 h-8"
                                />
                                <Input
                                  type="text"
                                  value={previewColors.card}
                                  onChange={(e) => handlePreviewColorChange('card', e.target.value)}
                                  className="flex-grow"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleThemeSettingsSave}
                        className="bg-blue-600 hover:bg-blue-700 mt-4"
                      >
                        <Brush className="mr-2 h-4 w-4" />
                        Apply Theme Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="seo" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">SEO Settings</h2>
                  <p className="text-sm text-gray-500 mb-4">Optimize your blog for search engines</p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="meta-title" className="text-sm font-medium">Default Meta Title</label>
                      <Input
                        id="meta-title"
                        value={seoSettings.metaTitle}
                        onChange={(e) => setSeoSettings({ ...seoSettings, metaTitle: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="meta-description" className="text-sm font-medium">Default Meta Description</label>
                      <Textarea
                        id="meta-description"
                        value={seoSettings.metaDescription}
                        onChange={(e) => setSeoSettings({ ...seoSettings, metaDescription: e.target.value })}
                        className="min-h-[80px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="keywords" className="text-sm font-medium">Default Keywords</label>
                      <Input
                        id="keywords"
                        value={seoSettings.keywords}
                        onChange={(e) => setSeoSettings({ ...seoSettings, keywords: e.target.value })}
                        placeholder="travel, destinations, guides, tips, adventure, tourism"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Generate Sitemap</h3>
                        <p className="text-sm text-gray-500">Automatically generate and update sitemap.xml</p>
                      </div>
                      <Switch 
                        checked={seoSettings.generateSitemap} 
                        onCheckedChange={(checked) => setSeoSettings({ ...seoSettings, generateSitemap: checked })}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleSeoSettingsSave}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Save SEO Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">API Access</h2>
                  <p className="text-sm text-gray-500 mb-4">Manage API keys and integrations</p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="api-key" className="text-sm font-medium">API Key</label>
                      <div className="flex space-x-2">
                        <Input
                          id="api-key"
                          value={apiSettings.apiKey}
                          readOnly
                          className="font-mono"
                        />
                        <Button 
                          variant="outline"
                          onClick={handleRegenerateApiKey}
                        >
                          Regenerate
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">Your API key provides full access to your blog content. Keep it secure!</p>
                    </div>
                    
                    <div className="space-y-4 pt-4">
                      <h3 className="font-medium mb-2">Connected Services</h3>
                      
                      <div className="flex justify-between items-center p-4 border rounded-md">
                        <div>
                          <h4 className="font-medium">Google Analytics</h4>
                          <p className="text-sm text-gray-500">Track website traffic</p>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => setApiSettings({ ...apiSettings, googleAnalyticsConnected: !apiSettings.googleAnalyticsConnected })}
                        >
                          {apiSettings.googleAnalyticsConnected ? 'Disconnect' : 'Connect'}
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 border rounded-md">
                        <div>
                          <h4 className="font-medium">Mailchimp</h4>
                          <p className="text-sm text-gray-500">Email newsletter integration</p>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => setApiSettings({ ...apiSettings, mailchimpConnected: !apiSettings.mailchimpConnected })}
                        >
                          {apiSettings.mailchimpConnected ? 'Disconnect' : 'Connect'}
                        </Button>
                      </div>
                      
                      <Button 
                        onClick={handleApiSettingsSave}
                        className="bg-blue-600 hover:bg-blue-700 mt-4"
                      >
                        Save API Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
