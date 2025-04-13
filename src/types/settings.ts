
export interface SiteSettings {
  general?: {
    siteTitle: string;
    siteDescription: string;
    contactEmail: string;
    footerText: string;
    maintenanceMode: boolean;
  };
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImageUrl: string;
  };
  social?: {
    facebookUrl: string;
    twitterUrl: string;
    instagramUrl: string;
    pinterestUrl: string;
  };
  notifications?: {
    enableEmailNotifications: boolean;
    adminEmailNotifications: boolean;
    commentNotifications: boolean;
    subscriptionNotifications: boolean;
  };
  analytics?: {
    googleAnalyticsId: string;
    facebookPixelId: string;
    enableAnalytics: boolean;
  };
  cookieConsent?: {
    requireCookieConsent: boolean;
    message: string;
  };
  api?: {
    apiKeysEnabled: boolean;
    rateLimit: string;
  };
  security?: {
    twoFactorAuth: boolean;
    passwordPolicy: string;
    sessionTimeout: string;
  };
  backup?: {
    autoBackup: boolean;
    backupFrequency: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export type PasswordPolicy = 'low' | 'medium' | 'high';
export type BackupFrequency = 'daily' | 'weekly' | 'monthly';
