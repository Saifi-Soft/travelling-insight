
import { getDB } from './mongodb';

export interface ThemePreference {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  lightThemeColors: {
    background: string;
    foreground: string;
    primary: string;
    footer: string;
    header: string;
    card: string;
  };
  darkThemeColors: {
    background: string;
    foreground: string;
    primary: string;
    footer: string;
    header: string;
    card: string;
  };
}

export const themeService = {
  // Get user's theme preferences
  async getUserThemePreference(userId: string): Promise<ThemePreference | null> {
    try {
      const db = await getDB();
      const themePreference = await db.user_theme_preferences.findOne({ userId });
      return themePreference;
    } catch (error) {
      console.error('Error getting user theme preference:', error);
      return null;
    }
  },

  // Save user's theme preferences
  async saveUserThemePreference(themePreference: ThemePreference): Promise<boolean> {
    try {
      const db = await getDB();
      
      // Fix: Remove the third argument from updateOne since it only expects query and update
      await db.user_theme_preferences.updateOne(
        { userId: themePreference.userId },
        { $set: themePreference }
      );
      
      return true;
    } catch (error) {
      console.error('Error saving user theme preference:', error);
      return false;
    }
  },
  
  // Create the collection if it doesn't exist
  async initializeThemeCollection(): Promise<void> {
    try {
      const db = await getDB();
      
      // Check if the collection exists
      const collections = await db.listCollections().toArray();
      const collectionExists = collections.some(col => col.name === 'user_theme_preferences');
      
      if (!collectionExists) {
        await db.createCollection('user_theme_preferences');
        console.log('Theme preferences collection created');
      }
    } catch (error) {
      console.error('Error initializing theme collection:', error);
    }
  }
};

// Initialize the collection when this module is imported
themeService.initializeThemeCollection().catch(console.error);
