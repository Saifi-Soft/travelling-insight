
import { connectToDatabase, COLLECTIONS } from './mongodb';

// Theme service functions
export async function saveThemeSettings(userId: string, theme: any) {
  try {
    const { collections } = await connectToDatabase();
    const existingSettings = await collections[COLLECTIONS.USER_SETTINGS]?.findOne({ userId });
    
    // Save complete theme settings with separate light and dark mode colors
    if (existingSettings) {
      await collections[COLLECTIONS.USER_SETTINGS]?.updateOne(
        { userId },
        { $set: { theme, updatedAt: new Date().toISOString() } }
      );
    } else {
      await collections[COLLECTIONS.USER_SETTINGS]?.insertOne({
        userId,
        theme,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
          header: '#ffffff',
          card: '#f8f9fa',
        },
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
    return null;
  }
}
