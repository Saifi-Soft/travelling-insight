
import { mongoApiService } from './mongoApiService';

// Settings type definition
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

// Get all site settings
export async function getSettings(): Promise<SiteSettings | null> {
  try {
    const settings = await mongoApiService.queryDocuments('settings', {});
    
    if (settings.length > 0) {
      return settings[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error getting settings:', error);
    return null;
  }
}

// Save site settings
export async function saveSettings(settings: SiteSettings): Promise<boolean> {
  try {
    const existingSettings = await mongoApiService.queryDocuments('settings', {});
    
    if (existingSettings.length > 0) {
      await mongoApiService.updateDocument(
        'settings',
        existingSettings[0].id,
        { 
          ...settings, 
          updatedAt: new Date() 
        }
      );
    } else {
      await mongoApiService.insertDocument(
        'settings', 
        {
          ...settings,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}

// Get a specific setting value
export async function getSetting(path: string): Promise<any> {
  try {
    const settings = await getSettings();
    
    if (!settings) {
      return null;
    }
    
    // Split the path by dots and navigate through the settings object
    const pathParts = path.split('.');
    let value = settings;
    
    for (const part of pathParts) {
      if (!value || typeof value !== 'object') {
        return null;
      }
      
      value = value[part];
    }
    
    return value;
  } catch (error) {
    console.error(`Error getting setting ${path}:`, error);
    return null;
  }
}
