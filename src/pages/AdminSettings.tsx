
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
  const { theme, lightThemeColors, darkThemeColors, setTheme, updateThemeColor } = useTheme();
  
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
  
  // Theme preview colors and current mode selection
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [lightModeColors, setLightModeColors] = useState({...lightThemeColors});
  const [darkModeColors, setDarkModeColors] = useState({...darkThemeColors});
  
  // Update preview colors when actual theme changes
  useEffect(() => {
    setLightModeColors({...lightThemeColors});
    setDarkModeColors({...darkThemeColors});
  }, [lightThemeColors, darkThemeColors]);
  
  // Get current preview colors based on selected theme mode
  const getCurrentPreviewColors = () => {
    return themeMode === 'light' ? lightModeColors : darkModeColors;
  };
  
  const handleGeneralSettingsSave = () => {
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
    // Apply theme color changes for the selected mode only
    if (themeMode === 'light') {
      Object.entries(lightModeColors).forEach(([key, value]) => {
        updateThemeColor(key as keyof typeof lightThemeColors, value, 'light');
      });
    } else {
      Object.entries(darkModeColors).forEach(([key, value]) => {
        updateThemeColor(key as keyof typeof darkThemeColors, value, 'dark');
      });
    }
    
    toast({
      title: "Success",
      description: `${themeMode === 'light' ? 'Light' : 'Dark'} theme settings saved successfully`,
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
    setApiSettings({
      ...apiSettings,
      apiKey: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    });
    
    toast({
      title: "Success",
      description: "API key regenerated successfully",
    });
  };

  const handlePreviewColorChange = (colorType: keyof typeof lightModeColors, value: string) => {
    if (themeMode === 'light') {
      setLightModeColors(prev => ({
        ...prev,
        [colorType]: value
      }));
    } else {
      setDarkModeColors(prev => ({
        ...prev,
        [colorType]: value
      }));
    }
  };

  // Color palettes for quick selection
  const lightColorPalettes = [
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

  const darkColorPalettes = [
    {
      name: 'Dark Blue',
      primary: '#60a5fa',
      background: '#111827',
      foreground: '#f3f4f6',
      footer: '#1e3a8a',
      header: '#0f172a',
      card: '#1e293b',
    },
    {
      name: 'Dark Green',
      primary: '#34d399',
      background: '#0f172a',
      foreground: '#f8fafc',
      footer: '#065f46',
      header: '#0f3a38',
      card: '#134e4a',
    },
    {
      name: 'Dark Purple',
      primary: '#a78bfa',
      background: '#1e1b4b',
      foreground: '#f5f3ff',
      footer: '#4c1d95',
      header: '#2e1065',
      card: '#4c1d95',
    },
    {
      name: 'Dark Red',
      primary: '#f87171',
      background: '#18181b',
      foreground: '#fef2f2',
      footer: '#7f1d1d',
      header: '#1c1917',
      card: '#292524',
    }
  ];

  const applyColorPalette = (palette: typeof lightColorPalettes[0]) => {
    if (themeMode === 'light') {
      setLightModeColors({
        primary: palette.primary,
        background: palette.background,
        foreground: palette.foreground,
        footer: palette.footer,
        header: palette.header,
        card: palette.card,
      });
    } else {
      setDarkModeColors({
        primary: palette.primary,
        background: palette.background,
        foreground: palette.foreground,
        footer: palette.footer,
        header: palette.header,
        card: palette.card,
      });
    }
  };

  // Get the relevant color palettes based on the selected theme mode
  const getCurrentPalettes = () => {
    return themeMode === 'light' ? lightColorPalettes : darkColorPalettes;
  };

  return (
    <AdminLayout activeItem="settings">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your blog settings and preferences</p>
        
        <Tabs defaultValue="general">
          <TabsList className="bg-white dark:bg-slate-800">
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
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">Color Settings</h3>
                          <div className="flex space-x-2">
                            <Button 
                              variant={themeMode === 'light' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setThemeMode('light')}
                              className={themeMode === 'light' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                            >
                              <Sun className="h-4 w-4 mr-1" />
                              Light Mode
                            </Button>
                            <Button 
                              variant={themeMode === 'dark' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setThemeMode('dark')}
                              className={themeMode === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                            >
                              <Moon className="h-4 w-4 mr-1" />
                              Dark Mode
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Theme Presets</label>
                              <div className="grid grid-cols-2 gap-2">
                                {getCurrentPalettes().map((palette, index) => (
                                  <Button
                                    key={`${palette.name}-${index}`}
                                    variant="outline"
                                    className="flex items-center justify-center py-4 h-auto"
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
                            
                            <div className="space-y-3 pt-4">
                              <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Primary Color</label>
                                  <div className="flex items-center gap-2">
                                    <div 
                                      className="w-6 h-6 rounded-full border"
                                      style={{backgroundColor: getCurrentPreviewColors().primary}}
                                    />
                                    <Input
                                      type="color"
                                      value={getCurrentPreviewColors().primary}
                                      onChange={(e) => handlePreviewColorChange('primary', e.target.value)}
                                      className="w-16 p-0 h-8"
                                    />
                                    <Input
                                      type="text"
                                      value={getCurrentPreviewColors().primary}
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
                                      style={{backgroundColor: getCurrentPreviewColors().background}}
                                    />
                                    <Input
                                      type="color"
                                      value={getCurrentPreviewColors().background}
                                      onChange={(e) => handlePreviewColorChange('background', e.target.value)}
                                      className="w-16 p-0 h-8"
                                    />
                                    <Input
                                      type="text"
                                      value={getCurrentPreviewColors().background}
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
                                      style={{backgroundColor: getCurrentPreviewColors().foreground}}
                                    />
                                    <Input
                                      type="color"
                                      value={getCurrentPreviewColors().foreground}
                                      onChange={(e) => handlePreviewColorChange('foreground', e.target.value)}
                                      className="w-16 p-0 h-8"
                                    />
                                    <Input
                                      type="text"
                                      value={getCurrentPreviewColors().foreground}
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
                                      style={{backgroundColor: getCurrentPreviewColors().header}}
                                    />
                                    <Input
                                      type="color"
                                      value={getCurrentPreviewColors().header}
                                      onChange={(e) => handlePreviewColorChange('header', e.target.value)}
                                      className="w-16 p-0 h-8"
                                    />
                                    <Input
                                      type="text"
                                      value={getCurrentPreviewColors().header}
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
                                      style={{backgroundColor: getCurrentPreviewColors().footer}}
                                    />
                                    <Input
                                      type="color"
                                      value={getCurrentPreviewColors().footer}
                                      onChange={(e) => handlePreviewColorChange('footer', e.target.value)}
                                      className="w-16 p-0 h-8"
                                    />
                                    <Input
                                      type="text"
                                      value={getCurrentPreviewColors().footer}
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
                                      style={{backgroundColor: getCurrentPreviewColors().card}}
                                    />
                                    <Input
                                      type="color"
                                      value={getCurrentPreviewColors().card}
                                      onChange={(e) => handlePreviewColorChange('card', e.target.value)}
                                      className="w-16 p-0 h-8"
                                    />
                                    <Input
                                      type="text"
                                      value={getCurrentPreviewColors().card}
                                      onChange={(e) => handlePreviewColorChange('card', e.target.value)}
                                      className="flex-grow"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div> 
                            <div 
                              className="p-6 border-2 rounded-md h-full" 
                              style={{
                                backgroundColor: getCurrentPreviewColors().background, 
                                color: getCurrentPreviewColors().foreground,
                                borderColor: 'rgba(120,120,120,0.2)'
                              }}
                            >
                              <h4 className="font-bold text-lg mb-6">Preview {themeMode === 'dark' ? '(Dark Mode)' : '(Light Mode)'}</h4>
                              <div 
                                className="p-4 rounded mb-4 shadow-sm" 
                                style={{
                                  backgroundColor: getCurrentPreviewColors().header,
                                  color: themeMode === 'dark' ? '#fff' : '#000'
                                }}
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-bold">Header</span>
                                  <div 
                                    className="py-1 px-2 text-sm rounded"
                                    style={{backgroundColor: getCurrentPreviewColors().primary, color: '#fff'}}
                                  >
                                    Button
                                  </div>
                                </div>
                              </div>
                              
                              <div 
                                className="p-4 rounded mb-4 shadow-sm" 
                                style={{backgroundColor: getCurrentPreviewColors().card}}
                              >
                                <h5 className="font-medium mb-2">Card Example</h5>
                                <div className="text-sm">This is sample card content</div>
                                <div 
                                  className="mt-4" 
                                  style={{color: getCurrentPreviewColors().primary}}
                                >
                                  Primary Text Link
                                </div>
                              </div>
                              
                              <div 
                                className="p-4 rounded shadow-sm mt-auto" 
                                style={{
                                  backgroundColor: getCurrentPreviewColors().footer, 
                                  color: '#ffffff'
                                }}
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-bold">Footer</span>
                                  <div className="text-sm opacity-80">© 2025</div>
                                </div>
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
                        Save {themeMode === 'dark' ? 'Dark' : 'Light'} Mode Settings
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
