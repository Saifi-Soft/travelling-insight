
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
        },
        // Default dark theme colors - restored to original values
        darkThemeColors: {
          background: '#1A1F2C',  // Dark purple for dark mode
          foreground: '#f8f9fa',  // Light text for dark mode
          primary: '#10B981',     // Emerald green for primary actions in dark mode
          footer: '#222222',      // Dark footer
          header: '#222222',      // Dark header
          card: '#2D3748',        // Dark card background
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
      },
      // Default dark theme colors - restored to original values
      darkThemeColors: {
        background: '#1A1F2C',
        foreground: '#f8f9fa',
        primary: '#10B981',
        footer: '#222222',
        header: '#222222',
        card: '#2D3748',
      }
    };
  }
}
