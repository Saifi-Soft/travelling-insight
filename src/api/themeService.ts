
import { mongoApiService } from './mongoApiService';

// Theme service functions
export async function saveThemeSettings(userId: string, theme: any) {
  try {
    const userSettings = await mongoApiService.queryDocuments('userSettings', { userId });
    
    // Save complete theme settings with separate light and dark mode colors
    if (userSettings.length > 0) {
      await mongoApiService.updateDocument(
        'userSettings',
        userSettings[0].id,
        { 
          theme, 
          updatedAt: new Date().toISOString() 
        }
      );
      
      console.log('Theme settings updated successfully:', theme);
    } else {
      await mongoApiService.insertDocument(
        'userSettings', 
        {
          userId,
          theme,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );
      
      console.log('Theme settings created successfully:', theme);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving theme settings:', error);
    return { success: false, error };
  }
}

export async function getThemeSettings(userId: string) {
  try {
    const userSettings = await mongoApiService.queryDocuments('userSettings', { userId });
    
    if (userSettings.length > 0 && userSettings[0].theme) {
      return userSettings[0].theme;
    } else {
      // Return default theme settings if not found
      return {
        theme: 'light',
        // Default light theme colors
        lightThemeColors: {
          background: '#ffffff',
          foreground: '#222222',
          primary: '#065f46', // custom-green
          footer: '#065f46', // custom-green
          header: '#ffffff',
          card: '#f8f9fa',
          text: '#333333',
          link: '#065f46',
          button: '#065f46',
          accent: '#10B981',
        },
        // Default dark theme colors - restored to original values
        darkThemeColors: {
          background: '#1A1F2C',
          foreground: '#f8f9fa',
          primary: '#10B981',
          footer: '#222222',
          header: '#222222',
          card: '#2D3748',
          text: '#f8f9fa',
          link: '#10B981',
          button: '#10B981',
          accent: '#8B5CF6',
        }
      };
    }
  } catch (error) {
    console.error('Error getting theme settings:', error);
    // Return default theme settings in case of error
    return {
      theme: 'light',
      // Default light theme colors
      lightThemeColors: {
        background: '#ffffff',
        foreground: '#222222',
        primary: '#065f46',
        footer: '#065f46',
        header: '#ffffff',
        card: '#f8f9fa',
        text: '#333333',
        link: '#065f46',
        button: '#065f46',
        accent: '#10B981',
      },
      // Default dark theme colors - restored to original values
      darkThemeColors: {
        background: '#1A1F2C',
        foreground: '#f8f9fa',
        primary: '#10B981',
        footer: '#222222',
        header: '#222222',
        card: '#2D3748',
        text: '#f8f9fa',
        link: '#10B981',
        button: '#10B981',
        accent: '#8B5CF6',
      }
    };
  }
}

export async function saveAccessibilitySettings(userId: string, settings: {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
}) {
  try {
    const existingSettings = await mongoApiService.queryDocuments('accessibilitySettings', { userId });
    
    if (existingSettings.length > 0) {
      await mongoApiService.updateDocument(
        'accessibilitySettings',
        existingSettings[0].id,
        { 
          ...settings, 
          updatedAt: new Date().toISOString() 
        }
      );
    } else {
      await mongoApiService.insertDocument(
        'accessibilitySettings', 
        {
          userId,
          ...settings,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving accessibility settings:', error);
    return { success: false, error };
  }
}

export async function getAccessibilitySettings(userId: string) {
  try {
    const settings = await mongoApiService.queryDocuments('accessibilitySettings', { userId });
    
    if (settings.length > 0) {
      return settings[0];
    } else {
      // Return default settings if not found
      return {
        reducedMotion: false,
        highContrast: false,
        largeText: false
      };
    }
  } catch (error) {
    console.error('Error getting accessibility settings:', error);
    // Return default settings in case of error
    return {
      reducedMotion: false,
      highContrast: false,
      largeText: false
    };
  }
}
