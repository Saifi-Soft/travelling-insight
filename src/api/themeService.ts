
import { connectToDatabase, COLLECTIONS } from './mongodb';

// Theme service functions
export async function saveThemeSettings(userId: string, theme: any) {
  try {
    const { collections } = await connectToDatabase();
    const existingSettings = await collections[COLLECTIONS.USER_SETTINGS]?.findOne({ userId });
    
    if (existingSettings) {
      await collections[COLLECTIONS.USER_SETTINGS]?.updateOne(
        { userId },
        { $set: { theme } }
      );
    } else {
      await collections[COLLECTIONS.USER_SETTINGS]?.insertOne({
        userId,
        theme,
        createdAt: new Date().toISOString()
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving theme settings:', error);
    return { success: false, error };
  }
}

export async function getThemeSettings(userId: string) {
  try {
    const { collections } = await connectToDatabase();
    const settings = await collections[COLLECTIONS.USER_SETTINGS]?.findOne({ userId });
    
    if (settings?.theme) {
      return settings.theme;
    } else {
      // Return default theme settings if not found
      return {
        theme: 'light',
        lightThemeColors: {
          background: '#ffffff',
          foreground: '#222222',
          primary: '#065f46', // custom-green
          footer: '#065f46', // custom-green
          header: '#065f46', // custom-green
          card: '#f8f9fa',
        },
        darkThemeColors: {
          background: '#1f2937',
          foreground: '#f8f9fa',
          primary: '#065f46', // custom-green
          footer: '#065f46', // custom-green
          header: '#065f46', // custom-green
          card: '#374151',
        }
      };
    }
  } catch (error) {
    console.error('Error getting theme settings:', error);
    return null;
  }
}
