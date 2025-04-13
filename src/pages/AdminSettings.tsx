
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { mongoApiService } from '@/api/mongoApiService';
import { Separator } from '@/components/ui/separator';

const AdminSettings = () => {
  // State for general settings
  const [siteTitle, setSiteTitle] = useState('Nomad Nest');
  const [siteDescription, setSiteDescription] = useState('Travel blog and community platform');
  const [contactEmail, setContactEmail] = useState('contact@nomadnest.com');
  const [footerText, setFooterText] = useState('© 2025 Nomad Nest. All rights reserved.');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // State for SEO settings
  const [metaTitle, setMetaTitle] = useState('Nomad Nest | Travel Blog & Community');
  const [metaDescription, setMetaDescription] = useState('Join the Nomad Nest community to discover travel tips, destinations, and connect with fellow travelers.');
  const [keywords, setKeywords] = useState('travel, blog, destinations, community, backpacking, adventure');
  const [ogImageUrl, setOgImageUrl] = useState('https://nomadnest.com/og-image.jpg');
  
  // State for social media settings
  const [facebookUrl, setFacebookUrl] = useState('https://facebook.com/nomadnest');
  const [twitterUrl, setTwitterUrl] = useState('https://twitter.com/nomadnest');
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com/nomadnest');
  const [pinterestUrl, setPinterestUrl] = useState('https://pinterest.com/nomadnest');
  
  // State for notification settings
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(true);
  const [adminEmailNotifications, setAdminEmailNotifications] = useState(true);
  const [commentNotifications, setCommentNotifications] = useState(true);
  const [subscriptionNotifications, setSubscriptionNotifications] = useState(true);
  
  // State for analytics settings
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [facebookPixelId, setFacebookPixelId] = useState('');
  const [enableAnalytics, setEnableAnalytics] = useState(true);

  // State for cookie consent settings
  const [requireCookieConsent, setRequireCookieConsent] = useState(true);
  const [cookieConsentMessage, setCookieConsentMessage] = useState(
    'This website uses cookies to enhance your experience. By continuing to browse, you agree to our use of cookies.'
  );
  
  // State for API settings
  const [apiKeysEnabled, setApiKeysEnabled] = useState(false);
  const [rateLimit, setRateLimit] = useState('100');
  
  // State for security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [passwordPolicy, setPasswordPolicy] = useState('medium');
  const [sessionTimeout, setSessionTimeout] = useState('30');

  // State for backup settings
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');

  // Loading state for saving settings
  const [isSaving, setIsSaving] = useState(false);

  // Fetch settings from MongoDB on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await mongoApiService.queryDocuments('settings', {});
        
        if (settings.length > 0) {
          const data = settings[0];
          
          // General settings
          setSiteTitle(data.general?.siteTitle || 'Nomad Nest');
          setSiteDescription(data.general?.siteDescription || 'Travel blog and community platform');
          setContactEmail(data.general?.contactEmail || 'contact@nomadnest.com');
          setFooterText(data.general?.footerText || '© 2025 Nomad Nest. All rights reserved.');
          setMaintenanceMode(data.general?.maintenanceMode || false);
          
          // SEO settings
          setMetaTitle(data.seo?.metaTitle || 'Nomad Nest | Travel Blog & Community');
          setMetaDescription(data.seo?.metaDescription || 'Join the Nomad Nest community to discover travel tips, destinations, and connect with fellow travelers.');
          setKeywords(data.seo?.keywords || 'travel, blog, destinations, community, backpacking, adventure');
          setOgImageUrl(data.seo?.ogImageUrl || 'https://nomadnest.com/og-image.jpg');
          
          // Social media settings
          setFacebookUrl(data.social?.facebookUrl || 'https://facebook.com/nomadnest');
          setTwitterUrl(data.social?.twitterUrl || 'https://twitter.com/nomadnest');
          setInstagramUrl(data.social?.instagramUrl || 'https://instagram.com/nomadnest');
          setPinterestUrl(data.social?.pinterestUrl || 'https://pinterest.com/nomadnest');
          
          // Notification settings
          setEnableEmailNotifications(data.notifications?.enableEmailNotifications ?? true);
          setAdminEmailNotifications(data.notifications?.adminEmailNotifications ?? true);
          setCommentNotifications(data.notifications?.commentNotifications ?? true);
          setSubscriptionNotifications(data.notifications?.subscriptionNotifications ?? true);
          
          // Analytics settings
          setGoogleAnalyticsId(data.analytics?.googleAnalyticsId || '');
          setFacebookPixelId(data.analytics?.facebookPixelId || '');
          setEnableAnalytics(data.analytics?.enableAnalytics ?? true);
          
          // Cookie consent settings
          setRequireCookieConsent(data.cookieConsent?.requireCookieConsent ?? true);
          setCookieConsentMessage(data.cookieConsent?.message || 'This website uses cookies to enhance your experience. By continuing to browse, you agree to our use of cookies.');
          
          // API settings
          setApiKeysEnabled(data.api?.apiKeysEnabled ?? false);
          setRateLimit(data.api?.rateLimit || '100');
          
          // Security settings
          setTwoFactorAuth(data.security?.twoFactorAuth ?? false);
          setPasswordPolicy(data.security?.passwordPolicy || 'medium');
          setSessionTimeout(data.security?.sessionTimeout || '30');
          
          // Backup settings
          setAutoBackup(data.backup?.autoBackup ?? true);
          setBackupFrequency(data.backup?.backupFrequency || 'daily');
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    
    fetchSettings();
  }, []);

  const saveSettings = async (section) => {
    setIsSaving(true);
    try {
      const settings = await mongoApiService.queryDocuments('settings', {});
      
      let settingsData = {};
      if (settings.length > 0) {
        settingsData = settings[0];
      }
      
      const updatedSettings = {
        ...settingsData,
        general: {
          siteTitle,
          siteDescription,
          contactEmail,
          footerText,
          maintenanceMode
        },
        seo: {
          metaTitle,
          metaDescription,
          keywords,
          ogImageUrl
        },
        social: {
          facebookUrl,
          twitterUrl,
          instagramUrl,
          pinterestUrl
        },
        notifications: {
          enableEmailNotifications,
          adminEmailNotifications,
          commentNotifications,
          subscriptionNotifications
        },
        analytics: {
          googleAnalyticsId,
          facebookPixelId,
          enableAnalytics
        },
        cookieConsent: {
          requireCookieConsent,
          message: cookieConsentMessage
        },
        api: {
          apiKeysEnabled,
          rateLimit
        },
        security: {
          twoFactorAuth,
          passwordPolicy,
          sessionTimeout
        },
        backup: {
          autoBackup,
          backupFrequency
        },
        updatedAt: new Date()
      };
      
      if (settings.length > 0) {
        await mongoApiService.updateDocument('settings', settings[0].id, updatedSettings);
      } else {
        await mongoApiService.insertDocument('settings', {
          ...updatedSettings,
          createdAt: new Date()
        });
      }
      
      toast.success(`${section} settings saved successfully`);
    } catch (error) {
      console.error(`Error saving ${section} settings:`, error);
      toast.error(`Failed to save ${section} settings`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout activeItem="settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your admin settings and preferences.
          </p>
        </div>
        
        <Tabs defaultValue="general">
          <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          {/* General Settings Tab */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure general website settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="site-title">Site Title</Label>
                      <Input
                        id="site-title"
                        value={siteTitle}
                        onChange={(e) => setSiteTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="site-description">Site Description</Label>
                      <Textarea
                        id="site-description"
                        value={siteDescription}
                        onChange={(e) => setSiteDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Contact Email</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="footer-text">Footer Text</Label>
                      <Input
                        id="footer-text"
                        value={footerText}
                        onChange={(e) => setFooterText(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        id="maintenance-mode"
                        checked={maintenanceMode}
                        onCheckedChange={setMaintenanceMode}
                      />
                      <Label htmlFor="maintenance-mode">Enable Maintenance Mode</Label>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => saveSettings('General')} 
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save General Settings'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* SEO Settings Tab */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Optimize your website's search engine visibility.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="meta-title">Meta Title</Label>
                      <Input
                        id="meta-title"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="meta-description">Meta Description</Label>
                      <Textarea
                        id="meta-description"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        rows={3}
                      />
                      <p className="text-sm text-muted-foreground">
                        Recommended length: 150-160 characters
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="keywords">Keywords</Label>
                      <Input
                        id="keywords"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="Enter keywords separated by commas"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="og-image">Default Social Image URL</Label>
                      <Input
                        id="og-image"
                        value={ogImageUrl}
                        onChange={(e) => setOgImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                      <p className="text-sm text-muted-foreground">
                        This image will be used when sharing your content on social media platforms.
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => saveSettings('SEO')} 
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save SEO Settings'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Social Media Settings Tab */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Settings</CardTitle>
                <CardDescription>
                  Configure your social media links and integrations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook-url">Facebook URL</Label>
                      <Input
                        id="facebook-url"
                        value={facebookUrl}
                        onChange={(e) => setFacebookUrl(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="twitter-url">Twitter URL</Label>
                      <Input
                        id="twitter-url"
                        value={twitterUrl}
                        onChange={(e) => setTwitterUrl(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instagram-url">Instagram URL</Label>
                      <Input
                        id="instagram-url"
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pinterest-url">Pinterest URL</Label>
                      <Input
                        id="pinterest-url"
                        value={pinterestUrl}
                        onChange={(e) => setPinterestUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => saveSettings('Social Media')} 
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Social Media Settings'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Settings Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure email and system notification preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="email-notifications"
                        checked={enableEmailNotifications}
                        onCheckedChange={setEnableEmailNotifications}
                      />
                      <Label htmlFor="email-notifications">Enable Email Notifications</Label>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Email Notification Types</p>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="admin-notifications"
                            checked={adminEmailNotifications}
                            onCheckedChange={setAdminEmailNotifications}
                            disabled={!enableEmailNotifications}
                          />
                          <Label 
                            htmlFor="admin-notifications"
                            className={!enableEmailNotifications ? "text-muted-foreground" : ""}
                          >
                            Admin Notifications
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="comment-notifications"
                            checked={commentNotifications}
                            onCheckedChange={setCommentNotifications}
                            disabled={!enableEmailNotifications}
                          />
                          <Label 
                            htmlFor="comment-notifications"
                            className={!enableEmailNotifications ? "text-muted-foreground" : ""}
                          >
                            New Comment Notifications
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="subscription-notifications"
                            checked={subscriptionNotifications}
                            onCheckedChange={setSubscriptionNotifications}
                            disabled={!enableEmailNotifications}
                          />
                          <Label 
                            htmlFor="subscription-notifications"
                            className={!enableEmailNotifications ? "text-muted-foreground" : ""}
                          >
                            Subscription Notifications
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => saveSettings('Notifications')} 
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Notification Settings'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Advanced Settings Tab */}
          <TabsContent value="advanced">
            <div className="space-y-6">
              {/* Analytics Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Settings</CardTitle>
                  <CardDescription>
                    Configure website analytics tracking.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enable-analytics"
                        checked={enableAnalytics}
                        onCheckedChange={setEnableAnalytics}
                      />
                      <Label htmlFor="enable-analytics">Enable Analytics Tracking</Label>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label 
                          htmlFor="google-analytics"
                          className={!enableAnalytics ? "text-muted-foreground" : ""}
                        >
                          Google Analytics ID
                        </Label>
                        <Input
                          id="google-analytics"
                          value={googleAnalyticsId}
                          onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                          placeholder="G-XXXXXXXXXX"
                          disabled={!enableAnalytics}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label 
                          htmlFor="facebook-pixel"
                          className={!enableAnalytics ? "text-muted-foreground" : ""}
                        >
                          Facebook Pixel ID
                        </Label>
                        <Input
                          id="facebook-pixel"
                          value={facebookPixelId}
                          onChange={(e) => setFacebookPixelId(e.target.value)}
                          placeholder="XXXXXXXXXX"
                          disabled={!enableAnalytics}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => saveSettings('Analytics')} 
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Analytics Settings'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Cookie Consent Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Cookie Consent Settings</CardTitle>
                  <CardDescription>
                    Configure cookie consent requirements for your website.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="require-cookie-consent"
                        checked={requireCookieConsent}
                        onCheckedChange={setRequireCookieConsent}
                      />
                      <Label htmlFor="require-cookie-consent">Require Cookie Consent</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label 
                        htmlFor="cookie-message"
                        className={!requireCookieConsent ? "text-muted-foreground" : ""}
                      >
                        Cookie Consent Message
                      </Label>
                      <Textarea
                        id="cookie-message"
                        value={cookieConsentMessage}
                        onChange={(e) => setCookieConsentMessage(e.target.value)}
                        rows={3}
                        disabled={!requireCookieConsent}
                      />
                    </div>
                    
                    <Button 
                      onClick={() => saveSettings('Cookie Consent')} 
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Cookie Settings'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* API Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>API Settings</CardTitle>
                  <CardDescription>
                    Configure API access settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="api-keys"
                        checked={apiKeysEnabled}
                        onCheckedChange={setApiKeysEnabled}
                      />
                      <Label htmlFor="api-keys">Enable API Keys</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label 
                        htmlFor="rate-limit"
                        className={!apiKeysEnabled ? "text-muted-foreground" : ""}
                      >
                        Rate Limit (requests per minute)
                      </Label>
                      <Input
                        id="rate-limit"
                        type="number"
                        value={rateLimit}
                        onChange={(e) => setRateLimit(e.target.value)}
                        min="1"
                        disabled={!apiKeysEnabled}
                      />
                    </div>
                    
                    <Button 
                      onClick={() => saveSettings('API')} 
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save API Settings'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Configure website security settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="two-factor"
                        checked={twoFactorAuth}
                        onCheckedChange={setTwoFactorAuth}
                      />
                      <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password-policy">Password Policy</Label>
                      <Select
                        value={passwordPolicy}
                        onValueChange={setPasswordPolicy}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select password policy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - Minimum 6 characters</SelectItem>
                          <SelectItem value="medium">Medium - Minimum 8 characters with numbers</SelectItem>
                          <SelectItem value="high">High - Minimum 10 characters with numbers and special characters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input
                        id="session-timeout"
                        type="number"
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(e.target.value)}
                        min="1"
                      />
                    </div>
                    
                    <Button 
                      onClick={() => saveSettings('Security')} 
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Security Settings'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Backup Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Backup Settings</CardTitle>
                  <CardDescription>
                    Configure database backup settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-backup"
                        checked={autoBackup}
                        onCheckedChange={setAutoBackup}
                      />
                      <Label htmlFor="auto-backup">Enable Automatic Backups</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label 
                        htmlFor="backup-frequency"
                        className={!autoBackup ? "text-muted-foreground" : ""}
                      >
                        Backup Frequency
                      </Label>
                      <Select
                        value={backupFrequency}
                        onValueChange={setBackupFrequency}
                        disabled={!autoBackup}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select backup frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      onClick={() => saveSettings('Backup')} 
                      disabled={isSaving}
                      className="mr-2"
                    >
                      {isSaving ? 'Saving...' : 'Save Backup Settings'}
                    </Button>
                    
                    <Button variant="outline" onClick={() => toast.success('Manual backup initiated')}>
                      Create Manual Backup
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
