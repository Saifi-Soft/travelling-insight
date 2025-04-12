
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
    
    return settings?.theme || null;
  } catch (error) {
    console.error('Error getting theme settings:', error);
    return null;
  }
}
