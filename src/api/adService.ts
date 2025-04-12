
import { connectToDatabase, COLLECTIONS, ObjectId, formatMongoData } from './mongodb';

export interface AdPlacement {
  id?: string;
  name: string;
  slot: string;
  type: 'header' | 'footer' | 'sidebar' | 'in-content' | 'between-posts' | 'custom';
  format: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  location: string;
  isEnabled: boolean;
  position?: number; // For in-content ads, specifies paragraph or position
  responsive: boolean;
  customCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdStats {
  placementId: string;
  impressions: number;
  clicks: number;
  ctr: number;
  revenue: number;
  date: Date;
}

// Mock ad data for development purposes
const MOCK_ADS: AdPlacement[] = [
  {
    name: 'Header Banner',
    slot: '1234567890',
    type: 'header',
    format: 'horizontal',
    location: 'all-pages',
    isEnabled: true,
    responsive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Sidebar Ad',
    slot: '0987654321',
    type: 'sidebar',
    format: 'vertical',
    location: 'blog',
    isEnabled: true,
    responsive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Between Posts',
    slot: '1122334455',
    type: 'between-posts',
    format: 'auto',
    location: 'blog',
    isEnabled: true,
    responsive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
];

// Mock ad stats data for development purposes
const generateMockStats = (placementId: string, days: number = 7) => {
  const stats: AdStats[] = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    stats.push({
      placementId,
      impressions: Math.floor(Math.random() * 1000) + 500,
      clicks: Math.floor(Math.random() * 50) + 10,
      ctr: Math.random() * 5 + 1,
      revenue: Math.random() * 10 + 1,
      date
    });
  }
  
  return stats;
};

// Ad placements API
export const adPlacementsApi = {
  // Get all ad placements
  getAll: async (): Promise<AdPlacement[]> => {
    try {
      const { collections } = await connectToDatabase();
      const placements = await collections[COLLECTIONS.ADS].find().toArray();
      return formatMongoData(placements) as AdPlacement[];
    } catch (error) {
      console.error('Error fetching ad placements:', error);
      return MOCK_ADS;
    }
  },
  
  // Get ad placement by ID
  getById: async (id: string): Promise<AdPlacement | null> => {
    try {
      const { collections } = await connectToDatabase();
      const placement = await collections[COLLECTIONS.ADS].findOne({ _id: new ObjectId(id) });
      return placement ? formatMongoData(placement) as AdPlacement : null;
    } catch (error) {
      console.error('Error fetching ad placement by ID:', error);
      return MOCK_ADS.find(ad => ad.id === id) || null;
    }
  },
  
  // Create new ad placement
  create: async (adPlacement: Omit<AdPlacement, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdPlacement> => {
    try {
      const { collections } = await connectToDatabase();
      const now = new Date();
      const newPlacement = {
        ...adPlacement,
        createdAt: now,
        updatedAt: now
      };
      
      const result = await collections[COLLECTIONS.ADS].insertOne(newPlacement);
      return {
        ...newPlacement,
        id: result.insertedId.toString()
      };
    } catch (error) {
      console.error('Error creating ad placement:', error);
      // Return mock data for development
      const mockId = Math.random().toString(36).substr(2, 9);
      return {
        ...adPlacement,
        id: mockId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
  },
  
  // Update existing ad placement
  update: async (id: string, adPlacement: Partial<AdPlacement>): Promise<AdPlacement | null> => {
    try {
      const { collections } = await connectToDatabase();
      const result = await collections[COLLECTIONS.ADS].updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...adPlacement, updatedAt: new Date() } }
      );
      
      if (result.modifiedCount === 0) {
        return null;
      }
      
      return await adPlacementsApi.getById(id);
    } catch (error) {
      console.error('Error updating ad placement:', error);
      // For development
      return {
        ...adPlacement,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      } as AdPlacement;
    }
  },
  
  // Delete ad placement
  delete: async (id: string): Promise<boolean> => {
    try {
      const { collections } = await connectToDatabase();
      const result = await collections[COLLECTIONS.ADS].deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting ad placement:', error);
      return true; // For development
    }
  },
  
  // Enable or disable ad placement
  toggleEnabled: async (id: string, isEnabled: boolean): Promise<boolean> => {
    try {
      const { collections } = await connectToDatabase();
      const result = await collections[COLLECTIONS.ADS].updateOne(
        { _id: new ObjectId(id) },
        { $set: { isEnabled, updatedAt: new Date() } }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error toggling ad placement:', error);
      return true; // For development
    }
  }
};

// Ad statistics API
export const adStatsApi = {
  // Get stats for a specific ad placement
  getPlacementStats: async (placementId: string, days: number = 7): Promise<AdStats[]> => {
    try {
      const { collections } = await connectToDatabase();
      const date = new Date();
      date.setDate(date.getDate() - days);
      
      const stats = await collections[COLLECTIONS.AD_STATS].find({
        placementId,
        date: { $gte: date }
      }).toArray();
      
      return formatMongoData(stats) as AdStats[];
    } catch (error) {
      console.error('Error fetching ad stats:', error);
      // Return mock data for development
      return generateMockStats(placementId, days);
    }
  },
  
  // Get aggregated stats across all placements
  getAllStats: async (days: number = 7): Promise<{ totalImpressions: number, totalClicks: number, totalCtr: number, totalRevenue: number, dailyStats: Record<string, any> }> => {
    try {
      const { collections } = await connectToDatabase();
      const date = new Date();
      date.setDate(date.getDate() - days);
      
      const stats = await collections[COLLECTIONS.AD_STATS].find({
        date: { $gte: date }
      }).toArray();
      
      const formattedStats = formatMongoData(stats) as AdStats[];
      
      // Calculate totals
      const totalImpressions = formattedStats.reduce((sum, stat) => sum + stat.impressions, 0);
      const totalClicks = formattedStats.reduce((sum, stat) => sum + stat.clicks, 0);
      const totalRevenue = formattedStats.reduce((sum, stat) => sum + stat.revenue, 0);
      const totalCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      
      // Group by date
      const dailyStats = formattedStats.reduce((acc: Record<string, any>, stat) => {
        const dateString = stat.date.toISOString().split('T')[0];
        
        if (!acc[dateString]) {
          acc[dateString] = {
            impressions: 0,
            clicks: 0,
            revenue: 0,
            date: stat.date
          };
        }
        
        acc[dateString].impressions += stat.impressions;
        acc[dateString].clicks += stat.clicks;
        acc[dateString].revenue += stat.revenue;
        return acc;
      }, {});
      
      return {
        totalImpressions,
        totalClicks,
        totalCtr,
        totalRevenue,
        dailyStats
      };
    } catch (error) {
      console.error('Error fetching all ad stats:', error);
      
      // Generate mock data for development
      const placements = await adPlacementsApi.getAll();
      let totalImpressions = 0;
      let totalClicks = 0;
      let totalRevenue = 0;
      const dailyStats: Record<string, any> = {};
      
      // Create date strings for the past 'days' days
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const impressions = Math.floor(Math.random() * 5000) + 1000;
        const clicks = Math.floor(Math.random() * 300) + 50;
        const revenue = Math.random() * 50 + 10;
        
        totalImpressions += impressions;
        totalClicks += clicks;
        totalRevenue += revenue;
        
        dailyStats[dateString] = {
          impressions,
          clicks,
          revenue,
          date
        };
      }
      
      const totalCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      
      return {
        totalImpressions,
        totalClicks,
        totalCtr,
        totalRevenue,
        dailyStats
      };
    }
  }
};
